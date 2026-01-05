import React, { useEffect, useState } from "react";
import { balanceApi } from "../api/balanceDyn";
import { predictionApi } from "../api/prediction";
import { activityApi } from "../api/activity";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { PageHeader } from "../components/PageHeader";

/* ---------------------------------------------------
   HELPERS
--------------------------------------------------- */

function getUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("auth_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.id ?? null;
  } catch {
    return null;
  }
}

const getTimeSince = (): string => {
  const DAYS = 7;
  return new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000).toISOString();
};

/* ---------- SAFE OPTIONAL API ---------- */
async function safeGetPnL(
  type: "PNLTYPE_REALIZED" | "PNLTYPE_UNREALIZED",
  timeSince?: string
): Promise<number> {
  try {
    const res = await predictionApi.getPnL({
      pnlType: type,
      ...(timeSince ? { timeSince } : {}),
    });
    return Number((res as any)?.pnl ?? 0);
  } catch {
    console.warn(`PnL API not available (${type})`);
    return 0;
  }
}

/* ---------------------------------------------------
   TYPES
--------------------------------------------------- */

interface ChartPoint {
  name: string;
  value: number;
}

interface Position {
  id: string;
  outcome: string;
  average: string;
  current: number;
  price: number;
}

interface Activity {
  activityId: string;
  activityType: string;
  activitySubType: string;
  activityDescription: string;
  activityAmount: number;
  activityTime: string;
}

interface PortfolioData {
  totalValue: number;
  todayChange: number;
  availableBalance: number;
  chartData: ChartPoint[];
  positions: Position[];
  unrealizedPnl: number;
  realizedPnl: number;
  unrealizedPnlData: ChartPoint[];
  realizedPnlData: ChartPoint[];
  activity: Activity[];
}

/* ---------------------------------------------------
   MAPPERS
--------------------------------------------------- */

const mapPortfolioResponse = (api: any): PortfolioData => ({
  totalValue: Number(api?.currentBalance ?? api?.balance ?? 0),
  todayChange: Number(api?.todayChange ?? 0),
  availableBalance: Number(api?.availableBalance ?? api?.available ?? 0),
  chartData: (api?.history ?? []).map((h: any) => ({
    name: h?.date ?? "",
    value: Number(h?.value ?? 0),
  })),
  positions: [],
  unrealizedPnl: 0,
  realizedPnl: 0,
  unrealizedPnlData: [{ name: "Unrealized", value: 0 }],
  realizedPnlData: [{ name: "Realized", value: 0 }],
  activity: [],
});

const mapActivity = (api: any): Activity[] => {
  const list = api?.activities ?? api?.data?.activities ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((a: any) => ({
    activityId: a.activityId ?? a.id ?? crypto.randomUUID(),
    activityType: a.activityType ?? "",
    activitySubType: a.activitySubType ?? "",
    activityDescription: a.activityDescription ?? "",
    activityAmount: Number(a.activityAmount ?? 0),
    activityTime: a.activityTime ?? "",
  }));
};

const mapPredictionsToPositions = (predictions: any[]): Position[] =>
  predictions.map((p: any) => ({
    id: p.predictionId ?? crypto.randomUUID(),
    outcome: p?.meta?.outcomeName ?? "Outcome",
    average: p?.isCorrect ? "YES" : "NO",
    current: Number(p?.potentialReturn ?? 0),
    price: Number(p?.stakeAmount ?? 0),
  }));

/* ---------------------------------------------------
   COMPONENT
--------------------------------------------------- */

const PortfolioDyn: React.FC = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPortfolio = async () => {
    setLoading(true);

    const userId = getUserIdFromToken();
    const timeSince = getTimeSince();

    /* -------- BALANCE -------- */
    let mapped = mapPortfolioResponse({});
    try {
      const balanceRes = await balanceApi.getBalance();
      mapped = mapPortfolioResponse(balanceRes);
    } catch (e) {
      console.warn("Balance API failed");
    }

    /* -------- ACTIVITY -------- */
    try {
      const activityRes = await (activityApi as any).getUserActivity(
        userId ? { userId } : {}
      );
      mapped.activity = mapActivity(activityRes);
    } catch {}

    /* -------- PnL (OPTIONAL) -------- */
    mapped.unrealizedPnl = await safeGetPnL("PNLTYPE_UNREALIZED", timeSince);
    mapped.realizedPnl = await safeGetPnL("PNLTYPE_REALIZED", timeSince);

    mapped.unrealizedPnlData = [
      { name: "Unrealized", value: mapped.unrealizedPnl },
    ];
    mapped.realizedPnlData = [
      { name: "Realized", value: mapped.realizedPnl },
    ];

    /* -------- POSITIONS -------- */
    try {
      const posRes = await predictionApi.getUserPredictions({
        userId: userId ?? "",
        pageRequest: { pageNumber: 1, pageSize: 10 },
        day: 0,
        month: 0,
        year: 0,
        timeInForce: "PREDICTIONTIMEINFORCE_COMPLETED_LIVE",
      } as any);

      mapped.positions = mapPredictionsToPositions(
        (posRes as any)?.predictions ?? []
      );
    } catch {}

    setData(mapped);
    setLoading(false);
  };

  useEffect(() => {
    loadPortfolio();
    const interval = setInterval(loadPortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-dark-bg min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">Loading portfolio…</div>
      </div>
    );
  }

  /* ---------------- UI BELOW (UNCHANGED) ---------------- */

  return (
    <div className="bg-dark-bg text-gray-light">
      <PageHeader
        title="Portfolio"
        tagline="Track your investments and performance metrics in real-time"
        compact
        isSubpage
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-10 relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 lg:flex-[3] space-y-8">
              {/* ===== TOP PROFILE + CARDS ===== */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TOTAL VALUE */}
                <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                  <h2 className="text-sm text-gray-text mb-3">Total Portfolio Value</h2>
                  <p className="text-4xl font-bold text-white">
                    ${Number(data.totalValue).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <span className="text-primary font-semibold mt-2 inline-block">
                    {data.todayChange >= 0 ? "+" : "-"}$
                    {Math.abs(data.todayChange).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* AVAILABLE BALANCE */}
                <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                  <h2 className="text-sm text-gray-text mb-3">Available Balance</h2>
                  <p className="text-4xl font-bold text-white">
                    ${Number(data.availableBalance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              {/* ===== PORTFOLIO CHART ===== */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                <h2 className="text-2xl font-bold text-white mb-2">Portfolio Value</h2>
                <p className="text-gray-text text-sm mb-6">12-month performance overview</p>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.chartData}>
                    <defs>
                      <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF73" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#00FF73" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#99A1AF" />
                    <YAxis stroke="#99A1AF" />
                    <Tooltip
                      contentStyle={{
                        background: "#1A1A1D",
                        border: "1px solid #2A2A2D",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00FF73"
                      strokeWidth={3}
                      dot={false}
                      fill="url(#portfolioGrad)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* ===== P&L ===== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "Unrealized P&L",
                    value: data.unrealizedPnl,
                    chart: data.unrealizedPnlData,
                  },
                  {
                    title: "Realized P&L",
                    value: data.realizedPnl,
                    chart: data.realizedPnlData,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {item.title}
                    </h2>
                    <p className="text-4xl font-bold text-primary mb-6">
                      {item.value >= 0 ? "+" : "-"}$
                      {Math.abs(item.value).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <ResponsiveContainer width="100%" height={60}>
                      <BarChart data={item.chart}>
                        <Bar
                          dataKey="value"
                          fill="#00FF73"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>

              {/* ===== POSITIONS ===== */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden">
                <h2 className="text-2xl font-bold text-white mb-6">Positions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-text">
                        <th className="py-4 px-4 text-left">Outcome</th>
                        <th className="py-4 px-4 text-center">Average</th>
                        <th className="py-4 px-4 text-center">Current</th>
                        <th className="py-4 px-4 text-center">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.positions.map((p: any) => (
                        <tr
                          key={p.id}
                          className="border-b border-white/5 hover:bg-dark-lighter/50"
                        >
                          <td className="py-4 px-4 text-left">{p.outcome}</td>
                          <td
                            className={`py-4 px-4 text-center font-semibold ${
                              p.average === "YES" ? "text-primary" : "text-red-400"
                            }`}
                          >
                            {p.average}
                          </td>
                          <td className="py-4 px-4 text-center">${p.current.toFixed(2)}</td>
                          <td className="py-4 px-4 text-center">${p.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ===== ACTIVITY ===== */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-6">Activity</h2>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-text text-sm">
                          <th className="py-4 px-4 text-left">Type</th>
                          <th className="py-4 px-4 text-left">Sub Type</th>
                          <th className="py-4 px-4 text-left">Description</th>
                          <th className="py-4 px-4 text-left">Amount</th>
                          <th className="py-4 px-4 text-left">Time</th>
                        </tr>
                      </thead>

                      <tbody>
                        {(data.activity ?? []).map((a: any) => (
                          <tr
                            key={a.activityId}
                            className="border-b border-white/5 hover:bg-dark-lighter/50 transition-colors"
                          >
                            <td className="py-4 px-4 max-w-[140px] truncate">
                              {a.activityType}
                            </td>

                            <td className="py-4 px-4 max-w-[140px] truncate">
                              {a.activitySubType}
                            </td>

                            <td className="py-4 px-4 max-w-[260px] truncate">
                              {a.activityDescription}
                            </td>

                            <td className="py-4 px-4 text-white">
                              ${Number(a.activityAmount ?? 0).toFixed(2)}
                            </td>

                            <td className="py-4 px-4 text-gray-muted">
                              {a.activityTime
                                ? new Date(a.activityTime).toLocaleString()
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= SIDEBAR ================= */}
            <div className="w-full lg:w-80 space-y-6">
              {/* ADVANCED FILTERS */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Advanced Filters
                  </h2>

                  <div className="space-y-4 mb-6">
                    {[
                      { label: "Market Type", options: ["Politics"] },
                      { label: "Position Type", options: ["Yes", "No"] },
                      { label: "Sort By", options: ["Value", "Date"] },
                      { label: "Date Entered", options: ["Market End Date"] },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="block text-sm font-medium text-primary mb-2">
                          {f.label}
                        </label>
                        <select className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-all">
                          {f.options.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    ))}

                    {/* STATUS */}
                    <div>
                      <label className="block text-sm font-medium text-primary mb-3">
                        Status
                      </label>
                      <div className="space-y-2">
                        {["Open", "Settled", "High"].map((s) => (
                          <button
                            key={s}
                            className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white hover:border-white/10 hover:bg-white/[0.02] transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* RISK */}
                    <div>
                      <label className="block text-sm font-medium text-primary mb-3">
                        Risk Level
                      </label>
                      <div className="space-y-2">
                        {["Low", "Medium", "High"].map((r) => (
                          <button
                            key={r}
                            className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white hover:border-white/10 hover:bg-white/[0.02] transition-all"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-dark-bg font-bold py-3 rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg shadow-primary/30">
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* PERFORMANCE ANALYTICS */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Performance Analytics
                </h2>
                <p className="text-sm text-gray-text mb-2">Total Earnings</p>
                <h3 className="text-4xl font-bold text-primary">
                  ${(data.totalValue - data.availableBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDyn;
