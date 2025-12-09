import { MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { useState } from 'react';

const events = [
  {
    id: 1,
    sport: "Cricket",
    title: "India vs Australia",
    date: "Nov 10, 2025",
    time: "14:30",
    venue: "MCG",
    timer: "2d 7h",
    status: "upcoming",
    question: "Who will score the most runs in this match?"
  },
  {
    id: 2,
    sport: "Football",
    title: "Real Madrid vs Barcelona",
    date: "Nov 9, 2025",
    time: "20:00",
    venue: "Santiago Bernabéu",
    timer: "Live",
    status: "live",
    question: "Which team will score the next goal?"
  },
  {
    id: 3,
    sport: "Basketball",
    title: "Lakers vs Warriors",
    date: "Nov 11, 2025",
    time: "19:30",
    venue: "Staples Center",
    timer: "3d 12h",
    status: "upcoming",
    question: "Who will be the highest scorer of the game?"
  },
  {
    id: 4,
    sport: "Tennis",
    title: "Djokovic vs Nadal",
    date: "Nov 12, 2025",
    time: "15:00",
    venue: "Roland Garros",
    timer: "4d 7h",
    status: "upcoming",
    question: "Who will win this match?"
  },
  {
    id: 5,
    sport: "Hockey",
    title: "India vs Germany",
    date: "Nov 15, 2025",
    time: "17:10",
    venue: "Berlin Arena",
    timer: "7d 1h",
    status: "sports",
    question: "Which team will score first?"
  },

  {
    id: 6,
    sport: "Cricket",
    title: "England vs Pakistan",
    date: "Nov 16, 2025",
    time: "12:30",
    venue: "Lord’s",
    timer: "8d",
    status: "upcoming",
    question: "Who will take the most wickets?"
  },
  {
    id: 7,
    sport: "Football",
    title: "Chelsea vs Arsenal",
    date: "Nov 18, 2025",
    time: "19:00",
    venue: "Stamford Bridge",
    timer: "9d",
    status: "trending",
    question: "Who will win the London derby?"
  },
  {
    id: 8,
    sport: "Football",
    title: "PSG vs Bayern",
    date: "Nov 20, 2025",
    time: "21:30",
    venue: "Allianz Arena",
    timer: "11d",
    status: "upcoming",
    question: "Will Mbappé or Kane score first?"
  },
  {
    id: 9,
    sport: "Baseball",
    title: "Yankees vs Red Sox",
    date: "Nov 21, 2025",
    time: "16:00",
    venue: "Yankee Stadium",
    timer: "12d",
    status: "sports",
    question: "Who will hit the first home run?"
  },
  {
    id: 10,
    sport: "Tennis",
    title: "Serena vs Osaka",
    date: "Nov 22, 2025",
    time: "13:45",
    venue: "US Open",
    timer: "13d",
    status: "upcoming",
    question: "Who will win this women’s singles match?"
  },

  {
    id: 11,
    sport: "Basketball",
    title: "Celtics vs Heat",
    date: "Nov 23, 2025",
    time: "18:00",
    venue: "TD Garden",
    timer: "14d",
    status: "trending",
    question: "Who will dominate the fourth quarter?"
  },
  {
    id: 12,
    sport: "Rugby",
    title: "Wales vs Ireland",
    date: "Nov 25, 2025",
    time: "15:15",
    venue: "Dublin Stadium",
    timer: "16d",
    status: "sports",
    question: "Which team will score the winning try?"
  },
  {
    id: 13,
    sport: "Cricket",
    title: "New Zealand vs SA",
    date: "Nov 26, 2025",
    time: "10:00",
    venue: "Auckland Park",
    timer: "17d",
    status: "upcoming",
    question: "Will the match reach 300+ total runs?"
  },
  {
    id: 14,
    sport: "Football",
    title: "Inter vs AC Milan",
    date: "Nov 28, 2025",
    time: "19:30",
    venue: "San Siro",
    timer: "19d",
    status: "trending",
    question: "Who will win the Milan derby?"
  },
  {
    id: 15,
    sport: "Hockey",
    title: "Canada vs USA",
    date: "Nov 29, 2025",
    time: "20:45",
    venue: "Toronto Arena",
    timer: "20d",
    status: "upcoming",
    question: "Who will be the top goalscorer?"
  },

  {
    id: 16,
    sport: "Cricket",
    title: "Sri Lanka vs WI",
    date: "Dec 1, 2025",
    time: "12:00",
    venue: "Colombo",
    timer: "22d",
    status: "upcoming",
    question: "Who will win the toss?"
  },
  {
    id: 17,
    sport: "Tennis",
    title: "Thiem vs Zverev",
    date: "Dec 2, 2025",
    time: "14:40",
    venue: "ATP Finals",
    timer: "23d",
    status: "sports",
    question: "Will this match go to five sets?"
  },
  {
    id: 18,
    sport: "Football",
    title: "Juventus vs Napoli",
    date: "Dec 3, 2025",
    time: "20:30",
    venue: "Juventus Stadium",
    timer: "24d",
    status: "upcoming",
    question: "Who will score the opening goal?"
  },
  {
    id: 19,
    sport: "Basketball",
    title: "Nets vs Bulls",
    date: "Dec 5, 2025",
    time: "21:00",
    venue: "Barclays Center",
    timer: "26d",
    status: "trending",
    question: "Who will make the most 3-pointers?"
  },
  {
    id: 20,
    sport: "Rugby",
    title: "France vs England",
    date: "Dec 6, 2025",
    time: "17:00",
    venue: "Paris Stadium",
    timer: "27d",
    status: "upcoming",
    question: "Which team will win the first half?"
  },

  {
    id: 21,
    sport: "Cricket",
    title: "India vs England",
    date: "Dec 7, 2025",
    time: "09:30",
    venue: "Eden Gardens",
    timer: "28d",
    status: "upcoming",
    question: "Who will hit the highest individual score?"
  },
  {
    id: 22,
    sport: "Football",
    title: "Dortmund vs Leipzig",
    date: "Dec 8, 2025",
    time: "18:00",
    venue: "Signal Iduna Park",
    timer: "29d",
    status: "sports",
    question: "Will Haaland score a brace?"
  },
  {
    id: 23,
    sport: "Tennis",
    title: "Rafa vs Alcaraz",
    date: "Dec 10, 2025",
    time: "17:20",
    venue: "Madrid Arena",
    timer: "31d",
    status: "upcoming",
    question: "Who will win the tie-break?"
  },
  {
    id: 24,
    sport: "Basketball",
    title: "Suns vs Nuggets",
    date: "Dec 11, 2025",
    time: "19:45",
    venue: "Phoenix Arena",
    timer: "32d",
    status: "sports",
    question: "Who will lead in assists?"
  },
  {
    id: 25,
    sport: "Cricket",
    title: "Australia vs NZ",
    date: "Dec 12, 2025",
    time: "11:15",
    venue: "SCG",
    timer: "33d",
    status: "trending",
    question: "Will any bowler take a 5-wicket haul?"
  },

  {
    id: 26,
    sport: "Hockey",
    title: "Russia vs Finland",
    date: "Dec 13, 2025",
    time: "20:15",
    venue: "Helsinki Arena",
    timer: "34d",
    status: "upcoming",
    question: "Who will win the shootout?"
  },
  {
    id: 27,
    sport: "Football",
    title: "Argentina vs Chile",
    date: "Dec 15, 2025",
    time: "16:30",
    venue: "Buenos Aires Stadium",
    timer: "36d",
    status: "upcoming",
    question: "Will Messi score in this match?"
  },
  {
    id: 28,
    sport: "Cricket",
    title: "Pakistan vs SA",
    date: "Dec 16, 2025",
    time: "10:00",
    venue: "Karachi Stadium",
    timer: "37d",
    status: "sports",
    question: "Who will win the man of the match?"
  },
  {
    id: 29,
    sport: "Tennis",
    title: "Wawrinka vs Medvedev",
    date: "Dec 18, 2025",
    time: "15:40",
    venue: "Swiss Indoor",
    timer: "39d",
    status: "upcoming",
    question: "Will this match go to a tie-break?"
  },
  {
    id: 30,
    sport: "Basketball",
    title: "Raptors vs Clippers",
    date: "Dec 19, 2025",
    time: "20:20",
    venue: "Scotiabank Arena",
    timer: "40d",
    status: "trending",
    question: "Who will score the game-winning shot?"
  },

  {
    id: 31,
    sport: "Football",
    title: "USA vs Mexico",
    date: "Dec 20, 2025",
    time: "18:00",
    venue: "LA Stadium",
    timer: "41d",
    status: "upcoming",
    question: "Who will win the match?"
  },
  {
    id: 32,
    sport: "Cricket",
    title: "Bangladesh vs India",
    date: "Dec 22, 2025",
    time: "13:00",
    venue: "Dhaka Stadium",
    timer: "43d",
    status: "upcoming",
    question: "Will any batsman hit a century?"
  },
  {
    id: 33,
    sport: "Tennis",
    title: "Halep vs Barty",
    date: "Dec 23, 2025",
    time: "14:00",
    venue: "Australian Arena",
    timer: "44d",
    status: "sports",
    question: "Who will win in straight sets?"
  },
  {
    id: 34,
    sport: "Basketball",
    title: "Spurs vs Rockets",
    date: "Dec 25, 2025",
    time: "20:30",
    venue: "Toyota Center",
    timer: "46d",
    status: "upcoming",
    question: "Who will get the most rebounds?"
  },
  {
    id: 35,
    sport: "Football",
    title: "Brazil vs Uruguay",
    date: "Dec 26, 2025",
    time: "21:50",
    venue: "Maracanã",
    timer: "47d",
    status: "trending",
    question: "Which team will score first?"
  },

  {
    id: 36,
    sport: "Cricket",
    title: "India vs Sri Lanka",
    date: "Dec 28, 2025",
    time: "12:45",
    venue: "Chennai Stadium",
    timer: "49d",
    status: "upcoming",
    question: "Will this match have a super over?"
  },
  {
    id: 37,
    sport: "Football",
    title: "Manchester United vs Tottenham",
    date: "Dec 29, 2025",
    time: "20:10",
    venue: "Old Trafford",
    timer: "50d",
    status: "sports",
    question: "Will any player score a hat-trick?"
  },
  {
    id: 38,
    sport: "Tennis",
    title: "Sinner vs Rublev",
    date: "Dec 30, 2025",
    time: "15:15",
    venue: "ATP Arena",
    timer: "51d",
    status: "upcoming",
    question: "Who will win the match?"
  },
  {
    id: 39,
    sport: "Basketball",
    title: "Jazz vs Kings",
    date: "Dec 31, 2025",
    time: "19:00",
    venue: "Utah Arena",
    timer: "52d",
    status: "sports",
    question: "Which team will score 100 points first?"
  },
  {
    id: 40,
    sport: "Football",
    title: "Barcelona vs Atletico",
    date: "Jan 2, 2026",
    time: "19:30",
    venue: "Camp Nou",
    timer: "54d",
    status: "upcoming",
    question: "Who will be the player of the match?"
  }
];



export const UpcomingEvents = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredEvents = activeTab === 'all' 
    ? events 
    : events.filter(e => e.status === activeTab);

  return (
    <section className="py-20 bg-[#1A1A1D] relative">
      {/* <div className="absolute top-[45%] left-[-20%] -translate-y-1/2 w-[450px] h-[500px] blur-[50px] z-50 pointer-events-none">
        <svg width="450" height="500" viewBox="0 0 299 617" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="291" cy="308.5" rx="291" ry="308.5" fill="url(#paint0_radial_2043_1685)" fillOpacity="1"></ellipse>
          <defs>
            {/* <radialGradient id="paint0_radial_2043_1685" cx="0" cy="0" r="1" gradientTransform="matrix(10.0537 288.96 -443.72 17.351 414.996 343.436)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FF73"></stop>
              <stop offset="1" stopColor="#1A1A1D" stopOpacity="0"></stop>
            </radialGradient> */}
          {/* </defs>
        </svg>
      </div> */} 
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          {/* <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Upcoming <span className="text-primary">Events</span>
            </h2>
            <p className="text-gray-text">Don't miss out on these exciting matches</p>
          </div> */}
          
          <div className="flex flex-wrap gap-2 bg-dark-card p-1.5 rounded-[10px] border border-white/10">
            <button 
                onClick={() => setActiveTab('all')}
                className={`px-8 py-2.5 rounded-[8px] text-sm font-medium transition-all duration-200 ${activeTab === 'all' ? 'bg-accent-yellow text-black shadow-sm' : 'text-gray-text hover:text-white'}`}
            >
                All
            </button>
             <button 
                onClick={() => setActiveTab('sports')}
                className={`px-8 py-2.5 rounded-[8px] text-sm font-medium transition-all duration-200 ${activeTab === 'sports' ? 'bg-accent-yellow text-black shadow-sm' : 'text-gray-text hover:text-white'}`}
            >
                Sports
            </button>
              <button 
                onClick={() => setActiveTab('live')}
                className={`px-8 py-2.5 rounded-[8px] text-sm font-medium transition-all duration-200 ${activeTab === 'live' ? 'bg-accent-yellow text-black shadow-sm' : 'text-gray-text hover:text-white'}`}
            >
                Live
            </button>
            <button 
                onClick={() => setActiveTab('trending')}
                className={`px-8 py-2.5 rounded-[8px] text-sm font-medium transition-all duration-200 ${activeTab === 'trending' ? 'bg-accent-yellow text-black shadow-sm' : 'text-gray-text hover:text-white'}`}
            >
                Trending
            </button>
            <button 
                onClick={() => setActiveTab('upcoming')}
                className={`px-8 py-2.5 rounded-[8px] text-sm font-medium transition-all duration-200 ${activeTab === 'upcoming' ? 'bg-accent-yellow text-black shadow-sm' : 'text-gray-text hover:text-white'}`}
            >
                Upcoming
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-dark-card border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 rounded-[8px] bg-gray-500 text-white text-xs font-medium border border-gray-400">
                  {event.sport}
                </span>
                {event.status === 'trending' && (
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FB2C36] text-white text-xs font-bold animate-pulse">
                    Trending
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-white mb-2 group-hover:text-primary transition-colors">
  {event.title}
</p>
<p className="text-lg font-bold min-h-[60px] text-white mb-4 group-hover:text-primary transition-colors">
                {event.question}
              </p>
              <div className="space-y-3 mb-2">
                <div className="flex items-center gap-3 text-gray-text text-sm">
                  <Calendar size={16} className="text-[#FEDE39]" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-text text-sm">
                  <MapPin size={16} className="text-[#FEDE39]" />
                  <span>{event.venue}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  <Clock size={16} className="text-primary" />
                  {event.timer}
                </div>
                <Button size="sm" className="bg-primary text-black hover:bg-primary/90 border-transparent font-bold px-6">

                  Predict
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
