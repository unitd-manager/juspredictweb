// src/pages/PortfolioDyn.tsx
import React, { useEffect, useState } from "react";
import { balanceApi } from "../api/balanceDyn";
import { predictionApi } from "../api/prediction";
// import { activityApi } from "../api/activity";
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

/* --------------------
   MAPPERS
---------------------*/

const mapPortfolioResponse = (api: any) => ({
  totalValue: Number(api?.currentBalance ?? api?.balance ?? 0),
  todayChange: Number(api?.todayChange ?? 0),
  availableBalance: Number(api?.availableBalance ?? api?.available ?? 0),

  chartData:
    (api?.history ?? []).map((h: any) => ({
      name: h?.date ?? "",
      value: Number(h?.value ?? 0),
    })) ?? [],

  positions:
    (api?.positions ?? []).map((p: any) => ({
      id: p?.id ?? p?.positionId ?? Math.random().toString(36).slice(2),
      outcome: p?.outcomeName ?? p?.outcome ?? "Outcome",
      average:
        typeof p?.averagePrice === "number"
          ? p.averagePrice >= 0.5
            ? "YES"
            : "NO"
          : p?.average ?? "NO",
      current: Number(p?.currentPrice ?? p?.current ?? 0),
      price: Number(p?.buyPrice ?? p?.price ?? 0),
    })) ?? [],

  unrealizedPnl: Number(api?.unrealizedPnl ?? 0),
  realizedPnl: Number(api?.realizedPnl ?? 0),

  unrealizedPnlData: [{ name: "Unrealized", value: Number(api?.unrealizedPnl ?? 0) }],
  realizedPnlData: [{ name: "Realized", value: Number(api?.realizedPnl ?? 0) }],

  // Important: annotate as any[] to avoid 'never[]' inference issues
  // activity: [] as any[],

  longestWin: Number(api?.longestWin ?? 0),
});




const mapPerformance = (api: any) => {
  const list = api?.performances ?? api?.data?.performances ?? api ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((p: any, idx: number) => ({
    name: `Day ${p?.day ?? idx + 1}`,
    value: Number(p?.earnings ?? p?.value ?? 0),
  }));
};

/* --------------------
   COMPONENT
---------------------*/
function getUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("auth_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log('payload',payload);
    return payload.id || null;
  } catch {
    return null;
  }
}

const PortfolioDyn: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [performanceChart, setPerformanceChart] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const loadPortfolio = async (isInitial = false) => {
    try {
            if (isInitial) setLoading(true);

      // 1) Balance - assume balanceApi.getBalance() returns final payload (no .data)
      const balanceRes = await balanceApi.getBalance();
      const balancePayload = balanceRes ?? {};
      const mapped = mapPortfolioResponse(balancePayload);
const userId = getUserIdFromToken() ||"undefined";


      // set data early so UI shows top-cards while performance loads
      setData(mapped);

    
const perfPayload = {
    // day: 0,
    //     month: 0,
  userId:userId,
  //  year: new Date().getFullYear(),
  // timeInForce: "PREDICTIONTIMEINFORCE_UNSPECIFIED",
};
console.log('userid',userId);
      // robust call — support different method names on predictionApi
      let perfRes: any;
      const predApiAny = predictionApi as any;
      if (typeof predApiAny.getPredictionPerformance === "function") {
        perfRes = await predApiAny.getPredictionPerformance(perfPayload);
      } else if (typeof predApiAny.getPerformance === "function") {
        perfRes = await predApiAny.getPerformance(perfPayload);
      } else if (typeof predApiAny.get === "function") {
        // last resort: generic call
        perfRes = await predApiAny.get(perfPayload);
      } else {
        // if no method available, just set empty
        perfRes = { performances: [] };
        console.warn("No prediction performance method found on predictionApi");
      }

      const perfPayloadNormalized = perfRes?.data ?? perfRes ?? {};
      setPerformanceChart(mapPerformance(perfPayloadNormalized));
    } catch (err) {
      console.error("Portfolio load error:", err);
      setData(mapPortfolioResponse(null));
      setPerformanceChart([]);
    } finally {
      if (isInitial) setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    loadPortfolio(true);
    const interval = setInterval(() => loadPortfolio(false), 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-dark-bg text-gray-light min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">Loading portfolio…</div>
      </div>
    );
  }

  const totalEarnings = performanceChart.reduce((s, x) => s + Number(x.value ?? 0), 0);

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* TOTAL VALUE */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                <h2 className="text-sm text-gray-text mb-3">Total Portfolio Value</h2>
                <p className="text-4xl font-bold text-white">
                  ${Number(data.totalValue).toLocaleString(undefined,{minimumFractionDigits:2})}
                </p>
                <span className="text-primary font-semibold mt-2 inline-block">
                  {data.todayChange >= 0 ? "+" : "-"}${Math.abs(data.todayChange)}
                </span>
              </div>

              {/* AVAILABLE BALANCE */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                <h2 className="text-sm text-gray-text mb-3">Available Balance</h2>
                <p className="text-4xl font-bold text-white">
                  ${Number(data.availableBalance).toLocaleString(undefined,{minimumFractionDigits:2})}
                </p>
              </div>

              {/* UNREALIZED P&L */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                <h2 className="text-sm text-gray-text mb-3">Unrealized P&amp;L</h2>
                <p className="text-4xl font-bold text-primary mb-2">
                  {data.unrealizedPnl >= 0 ? "+" : "-"}${Math.abs(data.unrealizedPnl)}
                </p>
              </div>

              {/* REALIZED P&L */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                <h2 className="text-sm text-gray-text mb-3">Realized P&amp;L</h2>
                <p className="text-4xl font-bold text-primary mb-2">
                  {data.realizedPnl >= 0 ? "+" : "-"}${Math.abs(data.realizedPnl)}
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
                      <stop offset="5%" stopColor="#00FF73" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00FF73" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#99A1AF"/>
                  <YAxis stroke="#99A1AF"/>
                  <Tooltip contentStyle={{background:"#1A1A1D",border:"1px solid #2A2A2D"}}/>
                  <Line type="monotone" dataKey="value" stroke="#00FF73" strokeWidth={3} dot={false} fill="url(#portfolioGrad)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ===== P&L ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Unrealized P&L", value: data.unrealizedPnl, chart: data.unrealizedPnlData },
                { title: "Realized P&L", value: data.realizedPnl, chart: data.realizedPnlData },
              ].map((item) => (
                <div key={item.title} className="relative bg-dark-card border border-white/5 rounded-2xl p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full -mr-16 -mt-16 blur-lg" />
                  <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
                  <p className="text-4xl font-bold text-primary mb-6">
                    {item.value >= 0 ? "+" : "-"}${Math.abs(item.value)}
                  </p>
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={item.chart}>
                      <Bar dataKey="value" fill="#00FF73" radius={[4,4,0,0]} />
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
                      <th className="py-4 px-4">Average</th>
                      <th className="py-4 px-4">Current</th>
                      <th className="py-4 px-4">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.positions.map((p:any)=>(
                      <tr key={p.id} className="border-b border-white/5 hover:bg-dark-lighter/50">
                        <td className="py-4 px-4">{p.outcome}</td>
                        <td className={`py-4 px-4 font-semibold ${p.average==="YES"?"text-primary":"text-red-400"}`}>
                          {p.average}
                        </td>
                        <td className="py-4 px-4">${p.current.toFixed(2)}</td>
                        <td className="py-4 px-4">${p.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
</div>
);

};

export default PortfolioDyn;
