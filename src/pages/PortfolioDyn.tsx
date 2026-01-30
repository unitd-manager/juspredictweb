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
} from "recharts";
import { PageHeader } from "../components/PageHeader";
import AppCoin from "../assets/appCoin.svg"
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
  eventName: string;
  question: string;
  answeredAt: string;
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

const getTypeLabel = (typeNum: any): string => {
  const typeMap: { [key: number]: string } = {
    0: "Unspecified",
    1: "Prediction",
    2: "Challenge",
  };
  return typeMap[Number(typeNum)] ?? "Unknown";
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  } catch {
    return dateStr;
  }
};

const formatFilterLabel = (filterStr: string): string => {
  return filterStr
    .replace("PREDICTIONTIMEINFORCE_", "")
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const mapPredictionsToPositions = (predictions: any[]): Position[] =>
  predictions.map((p: any) => ({
    id: p.predictionId ?? crypto.randomUUID(),
     date: formatDate(p?.eventStartDate ?? ""),
    outcome: getTypeLabel(p?.type),
    eventName: p?.eventName ?? "Event",
    question: p?.question ?? "Question",
    answeredAt: p?.predictedOutcome ?? "",
    average: p?.percentage,
    current: Number(p?.potentialReturns ?? 0),
    price: Number(p?.investmentAmt ?? 0),
  }));

/* ---------------------------------------------------
   COMPONENT
--------------------------------------------------- */

const PortfolioDyn: React.FC = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const isInitialMount = React.useRef(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  // TimeInForce filter state (shared for chart and positions)
  const timeInForceOptions = [
    "PREDICTIONTIMEINFORCE_LIVE",
    "PREDICTIONTIMEINFORCE_COMPLETED_TODAY",
    "PREDICTIONTIMEINFORCE_COMPLETED_YESTERDAY",
    "PREDICTIONTIMEINFORCE_COMPLETED_LASTWEEK",
    "PREDICTIONTIMEINFORCE_COMPLETED_LASTMONTH",
    "PREDICTIONTIMEINFORCE_COMPLETED_ALLTIME",
    "PREDICTIONTIMEINFORCE_COMPLETED_THISMONTH",
    "PREDICTIONTIMEINFORCE_UPCOMING",
    "PREDICTIONTIMEINFORCE_PENDING_LIVE",
    "PREDICTIONTIMEINFORCE_CANCELLED",
    "PREDICTIONTIMEINFORCE_EXITED"
  ];
  const [chartTimeInForce, setChartTimeInForce] = useState<string>("PREDICTIONTIMEINFORCE_COMPLETED_THISMONTH");
  const [positionsTimeInForce, setPositionsTimeInForce] = useState<string>("PREDICTIONTIMEINFORCE_LIVE");

  // Load positions separately with dependency tracking to prevent race conditions
  const loadPositions = async (timeInForce: string) => {
    try {
      const userId = getUserIdFromToken();
      const posRes = await predictionApi.getUserPredictions({
        userId: userId || "",
        pageRequest: { pageNumber: 1, pageSize: 20 },
        timeInForce: timeInForce,
      } as any);
      
      // Only update if the current filter still matches the request that was sent
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          positions: mapPredictionsToPositions((posRes as any)?.predictions ?? [])
        };
      });
    } catch (e) {
      console.warn("Failed to load positions");
    }
  };

  const loadPortfolio = async (showLoading = false) => {
    if (showLoading) setLoading(true);

    const userId = getUserIdFromToken();
    const timeSince = getTimeSince();

    let mapped = mapPortfolioResponse({});
    try {
      const balanceRes = await balanceApi.getBalance();
      mapped = mapPortfolioResponse(balanceRes);
    } catch (e) {
      console.warn("Balance API failed");
    }

    // Fetch performance data for chart
    try {
        const perfRes = await predictionApi.getPredictionPerformance({
          timeInForce: chartTimeInForce,
        });
        // Map performance data to chartData using the performances array if available
        if (Array.isArray((perfRes as any)?.performances)) {
          mapped.chartData = (perfRes as any).performances.map((item: any, idx: number) => ({
            name: item.day ? `Day ${item.day}` : `Day ${idx + 1}`,
            value: Number(item.earnings ?? 0),
          }));
          console.log('Portfolio Chart Data:', mapped.chartData);
        } else if (perfRes?.performance) {
          mapped.chartData = [
            { name: 'Earnings', value: Number(perfRes.performance.earnings ?? 0) },
            { name: 'Accuracy', value: Number(perfRes.performance.accuracy ?? 0) }
          ];
          console.log('Portfolio Chart Data:', mapped.chartData);
        } else {
          mapped.chartData = [];
          console.log('Portfolio Chart Data: EMPTY');
        }
    } catch (e) {
      console.warn("Performance API failed");
      mapped.chartData = [];
    }

    try {
      const activityRes = await (activityApi as any).getUserActivity(
        userId ? { userId } : {}
      );
      mapped.activity = mapActivity(activityRes);
    } catch {}

    mapped.unrealizedPnl = await safeGetPnL("PNLTYPE_UNREALIZED", timeSince);
    mapped.realizedPnl = await safeGetPnL("PNLTYPE_REALIZED", timeSince);

    mapped.unrealizedPnlData = [
      { name: "Unrealized", value: mapped.unrealizedPnl },
    ];
    mapped.realizedPnlData = [
      { name: "Realized", value: mapped.realizedPnl },
    ];

    // Preserve existing positions data if a filter is active
    setData(prev => {
      if (prev && positionsTimeInForce && prev.positions.length > 0) {
        return {
          ...mapped,
          positions: prev.positions // Keep existing filtered positions
        };
      }
      return mapped;
    });
    setLoading(false);
  };

  useEffect(() => {
    loadPortfolio(true); // initial load, show loading
    isInitialMount.current = false;
  }, [chartTimeInForce]);

  // Refresh positions data when portfolio updates if a filter is active
  useEffect(() => {
    if (positionsTimeInForce && data?.positions.length === 0) {
      // Only reload if positions were cleared and filter is active
      loadPositions(positionsTimeInForce);
    }
  }, [data?.positions.length]);

  // Update positions when positionsTimeInForce changes, but do not show loading spinner
  useEffect(() => {
    if (!isInitialMount.current) {
      setCurrentPage(1);
      setData(prev => prev ? { ...prev, positions: [] } : prev); // clear positions instantly
      loadPositions(positionsTimeInForce); // load only positions for the selected filter
    }
  }, [positionsTimeInForce]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [positionsTimeInForce]);

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
          {/* ===== TOP STATS ROW ===== */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Total Portfolio Value */}
            <div className="flex-1 min-w-[200px] bg-dark-card border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
              <h2 className="text-sm text-gray-text mb-2">Total Portfolio Value</h2>
              <p className="text-2xl font-bold text-white flex items-center justify-center gap-1">
  <span>
    {Number(data.totalValue).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}
  </span>
  <img src={AppCoin} alt="coin" className="w-4 h-4 translate-y-[1px]" />
</p>

            <span className="text-primary font-semibold mt-1 flex items-center justify-center gap-1">
  <span>
    {data.todayChange >= 0 ? "+" : "-"}
    {Math.abs(data.todayChange).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}
  </span>
  <img src={AppCoin} alt="coin" className="w-4 h-4 translate-y-[1px]" />
</span>

            </div>
            {/* Available Balance */}
            <div className="flex-1 min-w-[200px] bg-dark-card border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
              <h2 className="text-sm text-gray-text mb-2">Available Balance</h2>
             <p className="text-2xl font-bold text-white flex items-center justify-center gap-1">
  <span>
    {Number(data.availableBalance).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}
  </span>
  <img src={AppCoin} alt="coin" className="w-4 h-4 translate-y-[1px]" />
</p>

            </div>
            {/* Unrealized P&L */}
            <div className="flex-1 min-w-[200px] bg-dark-card border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
              <h2 className="text-sm text-gray-text mb-2">UnRealized P&L</h2>
            <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
  <span>
    {data.unrealizedPnl >= 0 ? "+" : "-"}
    {Math.abs(data.unrealizedPnl).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}
  </span>
  <img src={AppCoin} alt="coin" className="w-4 h-4 translate-y-[1px]" />
</p>

            </div>
            {/* Realized P&L */}
            <div className="flex-1 min-w-[200px] bg-dark-card border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
              <h2 className="text-sm text-gray-text mb-2">Realized P&L</h2>
             <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
  <span>
    {data.realizedPnl >= 0 ? "+" : "-"}
    {Math.abs(data.realizedPnl).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}
  </span>
  <img src={AppCoin} alt="coin" className="w-4 h-4 translate-y-[1px]" />
</p>

            </div>
          </div>

          {/* ===== PORTFOLIO CHART ===== */}
          <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
            <h2 className="text-2xl font-bold text-white mb-2">Portfolio Value</h2>
            <p className="text-gray-text text-sm mb-6">12-month performance overview</p>
            {/* Chart Filter Dropdown */}
            <div className="mb-4 flex items-center gap-2">
              {/* <label htmlFor="chart-timeinforce" className="text-gray-text">Filter:</label> */}
              <select
                id="chart-timeinforce"
                className="bg-dark-lighter text-white border border-white/10 rounded px-2 py-1"
                value={chartTimeInForce}
                onChange={e => setChartTimeInForce(e.target.value)}
              >
                {timeInForceOptions.map(opt => (
                  <option key={opt} value={opt}>{formatFilterLabel(opt)}</option>
                ))}
              </select>
            </div>
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

          {/* ===== POSITIONS ===== */}
          <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Positions</h2>
            {/* TimeInForce Filter for Positions */}
            <div className="mb-4 flex items-center gap-2">
              {/* <label htmlFor="positions-timeinforce" className="text-gray-text">Filter by TimeInForce:</label> */}
              <select
                id="positions-timeinforce"
                className="bg-dark-lighter text-white border border-white/10 rounded px-2 py-1"
                value={positionsTimeInForce}
                onChange={e => setPositionsTimeInForce(e.target.value)}
              >
                {timeInForceOptions.map(opt => (
                  <option key={opt} value={opt}>{formatFilterLabel(opt)}</option>
                ))}
              </select>
            </div>
            {data.positions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-text text-lg">No predictions found for {formatFilterLabel(positionsTimeInForce)}</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-gray-text">
                   <th className="py-4 px-4 text-left">Date</th>
                   <th className="py-4 px-4 text-left">Event</th>
                   <th className="py-4 px-4 text-left">Question</th>
                   <th className="py-4 px-4 text-left">Predicted Outcome</th>
                    <th className="py-4 px-4 text-center">Percentage</th>
                    <th className="py-4 px-4 text-center">Current value of position</th>
                    <th className="py-4 px-4 text-center">Invested Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Paginate positions
                    const startIdx = (currentPage - 1) * pageSize;
                    const paginated = data.positions.slice(startIdx, startIdx + pageSize);
                    return paginated.map((p: any) => (
                      <tr
                        key={p.id}
                        className="border-b border-white/5 hover:bg-dark-lighter/50"
                      >
                         <td className="py-4 px-4 text-left">{p.date}</td>
                         <td className="py-4 px-4 text-left">{p.eventName}</td>
                          <td className="py-4 px-4 text-left">{p.question}</td>
                           <td className="py-4 px-4 text-left">{p.answeredAt}</td>
                        <td
                          className={`py-4 px-4 text-center font-semibold ${
                            p.average === "YES" ? "text-primary" : "text-red-400"
                          }`}
                        >
                          {p.average}
                        </td>
                    <td className="py-4 px-4 text-center">
  <div className="flex items-center justify-center gap-1">
    <span>{p.current.toFixed(2)}</span>
    <img src={AppCoin} alt="coin" className="w-4 h-4" />
  </div>
</td>

<td className="py-4 px-4 text-center">
  <div className="flex items-center justify-center gap-1">
    <span>{p.price.toFixed(2)}</span>
    <img src={AppCoin} alt="coin" className="w-4 h-4" />
  </div>
</td>
  </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
            )}
            {/* Pagination Controls */}
            {data.positions.length > 0 && (
            <div className="flex justify-end items-center mt-4 gap-2">
              {(() => {
                const totalPages = Math.ceil(data.positions.length / pageSize) || 1;
                return (
                  <>
                    <button
                      className="px-3 py-1 rounded bg-dark-lighter text-white border border-white/10 disabled:opacity-50"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    <span className="text-gray-text mx-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="px-3 py-1 rounded bg-dark-lighter text-white border border-white/10 disabled:opacity-50"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </>
                );
              })()}
            </div>
            )}
          </div>
        
        </div>
      </div>
    </div>
  );
}

export default PortfolioDyn;
