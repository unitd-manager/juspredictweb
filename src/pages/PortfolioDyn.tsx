import React, { useEffect, useState } from "react";
import { balanceApi } from "../api/balanceDyn";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { PageHeader } from "../components/PageHeader";

const PortfolioDyn: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadPortfolio = async () => {
    try {
      const response = await balanceApi.getBalance();
      setData(response);
    } catch (err) {
      console.error("Portfolio load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
    const interval = setInterval(loadPortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-dark-bg text-gray-light min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">Loading portfolio…</div>
      </div>
    );
  }

  return (
    <div className="bg-dark-bg text-gray-light">
      <PageHeader
        title="Portfolio"
        tagline="Track your investments and performance metrics"
        compact={true}
        isSubpage={true}
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-[1400px] mx-auto">

          {/* TOP VALUE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

            {/* TOTAL VALUE */}
            <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm text-gray-text mb-2">Total Portfolio Value</h2>
              <p className="text-4xl font-bold text-white">
                ${data.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-primary font-semibold mt-2">
                {data.todayChange >= 0 ? "+" : "-"}${Math.abs(data.todayChange).toLocaleString()}
              </p>
            </div>

            {/* AVAILABLE */}
            <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm text-gray-text mb-2">Available Balance</h2>
              <p className="text-4xl font-bold text-white">
                ${data.availableBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

          </div>

          {/* VALUE CHART */}
          <div className="bg-dark-card border border-white/5 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Portfolio Value</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chartData}>
                <XAxis dataKey="name" stroke="#99A1AF" />
                <YAxis stroke="#99A1AF" />
                <Tooltip
                  contentStyle={{ background: "#1A1A1D", border: "1px solid #333" }}
                />
                <Line type="monotone" dataKey="value" stroke="#00FF73" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* POSITIONS */}
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
                {data.positions?.map((p: any) => (
                  <tr key={p.id} className="border-b border-white/5">
                    <td className="py-3 px-4">{p.outcome}</td>
                    <td className={`py-3 px-4 font-semibold ${p.average === "YES" ? "text-primary" : "text-red-400"}`}>
                      {p.average}
                    </td>
                    <td className="py-3 px-4">${p.current.toFixed(2)}</td>
                    <td className="py-3 px-4">${p.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PNL SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

            {/* UNREALIZED */}
            <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Unrealized P&L</h2>
              <p className="text-4xl text-primary font-bold mb-6">
                {data.unrealizedPnl >= 0 ? "+" : "-"}${Math.abs(data.unrealizedPnl)}
              </p>

              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={data.unrealizedPnlData}>
                  <Bar dataKey="value" fill="#00FF73" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* REALIZED */}
            <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Realized P&L</h2>
              <p className="text-4xl text-primary font-bold mb-6">
                {data.realizedPnl >= 0 ? "+" : "-"}${Math.abs(data.realizedPnl)}
              </p>

              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={data.realizedPnlData}>
                  <Bar dataKey="value" fill="#00FF73" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* ACTIVITY */}
          <div className="bg-dark-card border border-white/5 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Activity</h2>

            <ul className="space-y-3">
              {data.activity.map((a: any) => (
                <li key={a.id} className="flex justify-between border-b border-white/5 pb-3">
                  <span>{a.label}</span>
                  <span className="text-gray-text">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PIE CHART */}
          <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Performance Analytics</h2>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.pieChartData}
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.pieChartData.map((entry: any, index: number) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <h3 className="text-4xl text-primary font-bold mt-6">
              +${data.longestWin.toLocaleString()}
            </h3>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PortfolioDyn;
