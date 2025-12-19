import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { PageHeader } from '../components/PageHeader';

const Portfolio: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  });

  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 4000 },
    { name: 'Sep', value: 3000 },
    { name: 'Oct', value: 2000 },
    { name: 'Nov', value: 2780 },
    { name: 'Dec', value: 1890 },
  ];

  const unrealizedPnlData = [
    { name: 'Mon', value: 100 },
    { name: 'Tue', value: 200 },
    { name: 'Wed', value: 150 },
    { name: 'Thu', value: 250 },
    { name: 'Fri', value: 180 },
  ];

  const realizedPnlData = [
    { name: 'Mon', value: 150 },
    { name: 'Tue', value: 250 },
    { name: 'Wed', value: 100 },
    { name: 'Thu', value: 300 },
    { name: 'Fri', value: 200 },
  ];

  const pieChartData = [
    { name: 'Wins', value: 70, color: '#00FF73' },
    { name: 'Losses', value: 30, color: '#ff4d4d' },
  ];

  return (
    <div className="bg-dark-bg text-gray-light">
      {/* Page Header */}
      <PageHeader
        title="Portfolio"
        tagline="Track your investments and performance metrics in real-time"
        compact={true}
        isSubpage={true}
      />

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-10 relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="flex-1 lg:flex-[3] space-y-8">
              {/* Profile Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Section */}
                <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Email</label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Value Cards Column */}
                <div className="space-y-6">
                  {/* Total Portfolio Value Card */}
                  <div className="relative bg-dark-card border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                    <div className="relative z-10">
                      <h2 className="text-sm font-medium text-gray-text mb-3">Total Portfolio Value</h2>
                      <p className="text-4xl font-bold text-white mb-2">$12,450.37</p>
                      <span className="text-primary font-semibold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12 17a1 1 0 01-1.447.894l-4-2A1 1 0 0115 15.382V5.618a1 1 0 00-1.447-.894l-4 2A1 1 0 009 7.618v9.764z" clipRule="evenodd" />
                        </svg>
                        $412 Today
                      </span>
                    </div>
                  </div>

                  {/* Available Balance Card */}
                  <div className="relative bg-dark-card border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                    <div className="relative z-10">
                      <h2 className="text-sm font-medium text-gray-text mb-3">Available Balance</h2>
                      <p className="text-4xl font-bold text-white mb-2">$11,300.00</p>
                      <span className="text-primary font-semibold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12 17a1 1 0 01-1.447.894l-4-2A1 1 0 0115 15.382V5.618a1 1 0 00-1.447-.894l-4 2A1 1 0 009 7.618v9.764z" clipRule="evenodd" />
                        </svg>
                        $8,590
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Value Chart */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2">Portfolio Value</h2>
                <p className="text-gray-text text-sm mb-6">12-month performance overview</p>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF73" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#008000" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#99A1AF" />
                    <YAxis stroke="#99A1AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1A1D', border: '1px solid #2A2A2D', borderRadius: '8px' }}
                      labelStyle={{ color: '#00FF73' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#00FF73" strokeWidth={3} dot={false} fill="url(#colorValue)" />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
   {/* P&L Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-2">Unrealized P&L</h2>
                    <p className="text-gray-text text-sm mb-4">Current open positions</p>
                    <p className="text-4xl font-bold text-primary mb-6">+$1,320.00</p>
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={unrealizedPnlData}>
                      <Bar dataKey="value" fill="#00FF73" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                </div>

                <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-2">Realized P&L</h2>
                    <p className="text-gray-text text-sm mb-4">Closed positions</p>
                    <p className="text-4xl font-bold text-primary mb-6">+$2,640.70</p>
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={realizedPnlData}>
                      <Bar dataKey="value" fill="#00FF73" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Positions Table */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-6">Positions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left py-4 px-4 text-gray-text font-semibold text-sm">Outcome</th>
                        <th className="text-left py-4 px-4 text-gray-text font-semibold text-sm">Average</th>
                        <th className="text-left py-4 px-4 text-gray-text font-semibold text-sm">Current</th>
                        <th className="text-left py-4 px-4 text-gray-text font-semibold text-sm">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5 hover:bg-dark-lighter/50 transition-colors">
                        <td className="py-4 px-4 text-white">Will BTC close above 100 by 2028?</td>
                        <td className="py-4 px-4 text-primary font-semibold">YES</td>
                        <td className="py-4 px-4 text-white">$1.07</td>
                        <td className="py-4 px-4 text-white font-semibold">$1.307</td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-dark-lighter/50 transition-colors">
                        <td className="py-4 px-4 text-white">Cryptocurrency price prediction</td>
                        <td className="py-4 px-4 text-red-400 font-semibold">NO</td>
                        <td className="py-4 px-4 text-white">$1.30</td>
                        <td className="py-4 px-4 text-white font-semibold">$1.32</td>
                      </tr>
                      <tr className="hover:bg-dark-lighter/50 transition-colors">
                        <td className="py-4 px-4 text-white">Market volatility prediction</td>
                        <td className="py-4 px-4 text-red-400 font-semibold">NO</td>
                        <td className="py-4 px-4 text-white">$1.38</td>
                        <td className="py-4 px-4 text-white font-semibold">$1.30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                </div>
              </div>

           
              {/* Activity Section */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-6">Activity</h2>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between pb-4 border-b border-white/5 hover:text-primary transition-colors">
                    <span className="text-gray-text">Market entry</span>
                    <span className="text-sm text-gray-muted">10:26 AM Today</span>
                  </li>
                  <li className="flex items-center justify-between pb-4 border-b border-white/5 hover:text-primary transition-colors">
                    <span className="text-gray-text">Sell position closed</span>
                    <span className="text-sm text-gray-muted">23:58 May</span>
                  </li>
                  <li className="flex items-center justify-between hover:text-primary transition-colors">
                    <span className="text-gray-text">Payout received</span>
                    <span className="text-sm text-gray-muted">05:48 Apr</span>
                  </li>
                </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-6">
              {/* Advanced Filters */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-6">Advanced Filters</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Market Type</label>
                    <select className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-all">
                      <option>Politics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Position Type</label>
                    <select className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-all">
                      <option>Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Sort by</label>
                    <select className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-all">
                      <option>Value</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Date Entered</label>
                    <select className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-all">
                      <option>Market End Date</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-3">Status</label>
                    <div className="space-y-2">
                      <button className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white hover:border-white/10 hover:bg-white/[0.02] transition-all">Open</button>
                      <button className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white hover:border-white/10 hover:bg-white/[0.02] transition-all">Settled</button>
                      <button className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white hover:border-white/10 hover:bg-white/[0.02] transition-all">High</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-3">Risk Level</label>
                    <div className="space-y-2">
                      <button className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white hover:border-white/10 hover:bg-white/[0.02] transition-all">Low</button>
                      <button className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white hover:border-white/10 hover:bg-white/[0.02] transition-all">Medium</button>
                      <button className="w-full bg-dark-bg border border-white/5 rounded-lg px-4 py-2.5 text-white hover:border-white/10 hover:bg-white/[0.02] transition-all">High</button>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-dark-bg font-bold py-3 px-4 rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50">Apply Filters</button>
                </div>
              </div>

              {/* Performance Analytics */}
              <div className="relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-4">Performance Analytics</h2>
                <p className="text-sm text-gray-text mb-2">Longest Winning Trade</p>
                <h3 className="text-4xl font-bold text-primary mb-6">+$1,320.00</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1A1D', border: '1px solid #2A2A2D', borderRadius: '8px' }}
                      labelStyle={{ color: '#00FF73' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
