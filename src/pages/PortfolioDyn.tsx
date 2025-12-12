// src/pages/PortfolioDyn.tsx
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

/* --------------------
   MAPPERS
---------------------*/

const mapPortfolioResponse = (api: any) => ({
  totalValue: Number(api?.totalValue ?? api?.balance ?? 0),
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
  activity: [] as any[],

  longestWin: Number(api?.longestWin ?? 0),
});

const mapActivity = (api: any) => {
  const list = api?.activities ?? api?.data?.activities ?? api ?? [];
  if (!Array.isArray(list)) return [];

  return list.map((a: any) => ({
    activityId: a.activityId ?? a.id ?? Math.random().toString(36).slice(2),
    activityType: a.activityType ?? "",
    activitySubType: a.activitySubType ?? "",
    activityDescription: a.activityDescription ?? a.description ?? "",
    activityAmount: a.activityAmount ?? a.amount ?? 0,
    activityTime: a.activityTime ?? a.time ?? a.createdAt ?? "",
  }));
};


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

const PortfolioDyn: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [performanceChart, setPerformanceChart] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadPortfolio = async () => {
    try {
      setLoading(true);

      // 1) Balance - assume balanceApi.getBalance() returns final payload (no .data)
      const balanceRes = await balanceApi.getBalance();
      const balancePayload = balanceRes ?? {};
      const mapped = mapPortfolioResponse(balancePayload);

      // 2) Activity - pass userId if available (from localStorage or your auth)
      const userId = (typeof window !== "undefined" && localStorage.getItem("userId")) ?? undefined;
      let activityRes: any;
      try {
        // call with argument if api expects payload; use safe any
        activityRes = await (activityApi as any).getUserActivity(userId ? { userId } : {});
      } catch (err) {
        // fallback: try without payload
        try {
          activityRes = await (activityApi as any).getUserActivity();
        } catch (err2) {
          console.warn("Activity API call failed, continuing without activity", err2);
          activityRes = [];
        }
      }
      mapped.activity = mapActivity(activityRes);

      // set data early so UI shows top-cards while performance loads
      setData(mapped);

      // 3) Prediction performance
      // payload shape may vary; construct as any to avoid TS mismatches
      const perfPayload: any = {
        day: 0,
        month: 0,
        year: 0,
        timeInForce: "PREDICTIONTIMEINFORCE_UNSPECIFIED",
      };

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
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
    const interval = setInterval(loadPortfolio, 30000);
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
      <PageHeader title="Portfolio" tagline="Track your investments and performance metrics" compact isSubpage />

      <div className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-[1400px] mx-auto">
          {/* TOP CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm text-gray-text mb-2">Total Portfolio Value</h2>
              <p className="text-4xl font-bold text-white">
                ${Number(data.totalValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-primary font-semibold mt-2">
                {Number(data.todayChange ?? 0) >= 0 ? "+" : "-"}${Math.abs(Number(data.todayChange ?? 0)).toLocaleString()}
              </p>
            </div>

            <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm text-gray-text mb-2">Available Balance</h2>
              <p className="text-4xl font-bold text-white">
                ${Number(data.availableBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Portfolio Chart */}
          <div className="bg-dark-card border border-white/5 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Portfolio Value</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chartData ?? []}>
                <XAxis dataKey="name" stroke="#99A1AF" />
                <YAxis stroke="#99A1AF" />
                <Tooltip contentStyle={{ background: "#1A1A1D", border: "1px solid #333" }} />
                <Line type="monotone" dataKey="value" stroke="#00FF73" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Positions */}
          <div className="bg-dark-card border border-white/5 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Positions</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4">Outcome</th>
                  <th className="text-left py-3 px-4">Average</th>
                  <th className="text-left py-3 px-4">Current</th>
                  <th className="text-left py-3 px-4">Price</th>
                </tr>
              </thead>
              <tbody>
                {(data.positions ?? []).map((p: any) => (
                  <tr key={p.id} className="border-b border-white/5">
                    <td className="py-3 px-4">{p.outcome}</td>
                    <td className={`py-3 px-4 font-semibold ${p.average === "YES" ? "text-primary" : "text-red-400"}`}>{p.average}</td>
                    <td className="py-3 px-4">${Number(p.current ?? 0).toFixed(2)}</td>
                    <td className="py-3 px-4">${Number(p.price ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* P&L */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Unrealized P&L</h2>
              <p className="text-4xl text-primary font-bold mb-6">
                {Number(data.unrealizedPnl ?? 0) >= 0 ? "+" : "-"}${Math.abs(Number(data.unrealizedPnl ?? 0))}
              </p>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={data.unrealizedPnlData ?? []}>
                  <Bar dataKey="value" fill="#00FF73" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Realized P&L</h2>
              <p className="text-4xl text-primary font-bold mb-6">
                {Number(data.realizedPnl ?? 0) >= 0 ? "+" : "-"}${Math.abs(Number(data.realizedPnl ?? 0))}
              </p>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={data.realizedPnlData ?? []}>
                  <Bar dataKey="value" fill="#00FF73" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ACTIVITY TABLE */}
<div className="bg-dark-card border border-white/5 rounded-2xl p-6 mb-8 overflow-x-auto">
  <h2 className="text-2xl font-bold text-white mb-4">Activity</h2>

  <table className="w-full table-auto">
    <thead>
      <tr className="border-b border-white/10 text-left text-gray-400 text-sm">
        <th className="py-3 px-4">Type</th>
        <th className="py-3 px-4">Sub Type</th>
        <th className="py-3 px-4">Description</th>
        <th className="py-3 px-4">Amount</th>
        <th className="py-3 px-4">Time</th>
      </tr>
    </thead>

    <tbody>
      {(data.activity ?? []).map((a: any) => (
        <tr key={a.activityId} className="border-b border-white/5 text-white text-sm">
          
          {/* TYPE */}
          <td className="py-3 px-4 max-w-[120px] truncate" title={a.activityType}>
            {a.activityType}
          </td>

          {/* SUBTYPE */}
          <td className="py-3 px-4 max-w-[120px] truncate" title={a.activitySubType}>
            {a.activitySubType}
          </td>

          {/* DESCRIPTION */}
          <td className="py-3 px-4 max-w-[200px] truncate" title={a.activityDescription}>
            {a.activityDescription}
          </td>

          {/* AMOUNT */}
          <td className="py-3 px-4">${a.activityAmount}</td>

          {/* TIME */}
          <td className="py-3 px-4 max-w-[150px] truncate" title={a.activityTime}>
            {a.activityTime}
          </td>

        </tr>
      ))}
    </tbody>
  </table>
</div>


          {/* Prediction Performance */}
          <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Prediction Performance</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceChart ?? []}>
                <XAxis dataKey="name" stroke="#99A1AF" />
                <YAxis stroke="#99A1AF" />
                <Tooltip contentStyle={{ background: "#1A1A1D", border: "1px solid #333" }} />
                <Line type="monotone" dataKey="value" stroke="#00FF73" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>

            <div className="text-xl text-primary font-bold mt-4">Total Earnings: ${totalEarnings}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDyn;
