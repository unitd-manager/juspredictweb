import { Clock, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Button } from './ui/Button';

const matches = [
  {
    id: 1,
    sport: 'Cricket',
    team1: { name: 'India', code: 'IN', odds: 1.85, color: 'bg-team-blue' },
    team2: { name: 'Australia', code: 'AU', odds: 2.10, color: 'bg-team-gold' },
    predictions: '12,435',
    startsIn: '2h 30m',
    pool: '$45,230',
    fill: 62,
    trend: '+15%'
  },
  {
    id: 2,
    sport: 'Football',
    team1: { name: 'Barcelona', code: 'BL', odds: 1.65, color: 'bg-team-red' },
    team2: { name: 'Real Madrid', code: 'RM', odds: 2.35, color: 'bg-team-purple' },
    predictions: '18,234',
    startsIn: '4h 15m',
    pool: '$82,150',
    fill: 91,
    trend: '+28%'
  },
  {
    id: 3,
    sport: 'Basketball',
    team1: { name: 'Lakers', code: 'L', odds: 1.90, color: 'bg-team-teal' },
    team2: { name: 'Warriors', code: 'W', odds: 1.95, color: 'bg-team-green' },
    predictions: '9,876',
    startsIn: '1h 45m',
    pool: '$82,150',
    fill: 49,
    trend: '-5%'
  }
];

export const LivePredictions = () => {
  return (
    <section className="py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Live <span className="text-primary">Match Predictions</span>
          </h2>
          <p className="text-gray-text">Make your predictions and compete with the community</p>
        </div>

        <div className="space-y-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-dark-card border border-primary/20 rounded-[18px] p-4 lg:px-8 lg:py-6 hover:border-primary/40 transition-all duration-300 shadow-card"
            >
              <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center lg:gap-12">

                {/* Matchup Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between flex-1 w-full lg:w-auto gap-4 lg:gap-0">
                    {/* Team 1 */}
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className={`w-10 lg:w-12 h-10 lg:h-12 rounded-[24px] ${match.team1.color} flex items-center justify-center font-bold text-white text-sm lg:text-lg shrink-0`}>
                            {match.team1.code}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-white text-base lg:text-xl leading-none mb-1 truncate lg:truncate-none">{match.team1.name}</h3>
                            <span className="text-xs lg:text-sm text-gray-text font-medium">Odds: <span className="text-[#00FF73]">{match.team1.odds}</span></span>
                        </div>
                    </div>

                    {/* VS Center */}
                    <div className="flex flex-col items-center px-2 lg:px-4">
                        <span className="text-lg lg:text-2xl font-bold text-gray-500 mb-1 lg:mb-2">Vs</span>
                        <span className={`text-[10px] lg:text-[12px] px-2 lg:px-3 py-0.5 lg:py-1 rounded-full bg-[#173025] text-[#0CFF66] border border-[#106E3C] font-medium`}>
                            {match.sport}
                        </span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className={`w-10 lg:w-12 h-10 lg:h-12 rounded-[24px] ${match.team2.color} flex items-center justify-center font-bold text-white text-sm lg:text-lg shrink-0`}>
                            {match.team2.code}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-white text-base lg:text-xl leading-none mb-1 truncate lg:truncate-none">{match.team2.name}</h3>
                            <span className="text-xs lg:text-sm text-gray-text font-medium">Odds: <span className="text-[#00FF73]">{match.team2.odds}</span></span>
                        </div>
                    </div>
                </div>

                {/* Divider for Desktop */}
                <div className="hidden lg:block w-px h-16 bg-white/10"></div>

                {/* Stats & Action Right */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:w-auto gap-4 lg:gap-8 lg:xl:gap-12">
                    <div className="flex gap-4 lg:gap-8">
                        <div className="flex flex-col bg-[#131315] p-2 lg:p-3 rounded-[11px] flex-1 lg:flex-none lg:min-w-[100px]">
                            <span className="text-xs text-gray-500 flex items-center gap-1 mb-1 truncate"><Users size={12}/> <span className="truncate">Predictions</span></span>
                            <span className="text-base lg:text-lg font-bold text-white">{match.predictions}</span>
                        </div>
                        <div className="flex flex-col bg-[#131315] p-2 lg:p-3 rounded-[11px] flex-1 lg:flex-none lg:min-w-[100px]">
                            <span className="text-xs text-gray-500 flex items-center gap-1 mb-1 truncate"><Clock size={12}/> <span className="truncate">Starts In</span></span>
                            <span className="text-base lg:text-lg font-bold text-white">{match.startsIn}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-stretch lg:items-end gap-2 w-full lg:w-auto">
                        <Button className="bg-primary text-black font-bold px-6 lg:px-8 py-2 lg:py-3 rounded-lg hover:bg-primary/90 h-auto text-sm lg:text-base w-full lg:w-auto">
                            Predict
                        </Button>
                        <span className={`text-[10px] lg:text-[12px] font-medium flex items-center justify-center lg:justify-end gap-1 ${match.trend.startsWith('+') ? 'text-[#33CE78]' : 'text-[#DF3801]'}`}>
                            {match.trend.startsWith('+') ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {match.trend}
                        </span>
                    </div>
                </div>

              </div>

              {/* Progress Bar */}
              <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-white/5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                <div className="text-xs lg:text-sm font-medium text-gray-400">
                  Prize Pool : <span className="text-lg lg:text-[20px] font-bold text-[#00FF73]">{match.pool}</span>
                </div>
                <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto lg:ml-auto">
                    <div className="flex-1 lg:flex-none lg:w-48 h-2 lg:h-2.5 bg-black rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#00FC71] to-[#058640] rounded-full"
                        style={{ width: `${match.fill}%` }}
                    />
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-gray-text whitespace-nowrap">{match.fill}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8">View All Matches</Button>
        </div>
      </div>
    </section>
  );
};
