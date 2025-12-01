import { MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { useState } from 'react';

const events = [
  {
    id: 1,
    sport: 'Cricket',
    title: 'India vs Australia',
    date: 'Nov 10, 2025',
    time: '14:30',
    venue: 'Melbourne Cricket Ground',
    timer: '2d 7h 22m',
    status: 'upcoming'
  },
  {
    id: 2,
    sport: 'Football',
    title: 'Real Madrid vs Barcelona',
    date: 'Nov 9, 2025',
    time: '20:00',
    venue: 'Santiago Bernabéu',
    timer: 'In Progress',
    status: 'live'
  },
  {
    id: 3,
    sport: 'Basketball',
    title: 'Lakers vs Warriors',
    date: 'Nov 11, 2025',
    time: '19:30',
    venue: 'Staples Center',
    timer: '3d 12h 22m',
    status: 'upcoming'
  },
  {
    id: 4,
    sport: 'Tennis',
    title: 'Djokovic vs Nadal',
    date: 'Nov 12, 2025',
    time: '15:00',
    venue: 'Roland Garros',
    timer: '4d 7h 52m',
    status: 'upcoming'
  }
];

export const UpcomingEvents = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredEvents = activeTab === 'all' 
    ? events 
    : events.filter(e => e.status === activeTab);

  return (
    <section className="py-20 bg-[#1A1A1D] relative">
      <div className="absolute top-[45%] left-[-20%] -translate-y-1/2 w-[450px] h-[500px] blur-[50px] z-50 pointer-events-none">
        <svg width="450" height="500" viewBox="0 0 299 617" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="291" cy="308.5" rx="291" ry="308.5" fill="url(#paint0_radial_2043_1685)" fillOpacity="1"></ellipse>
          <defs>
            <radialGradient id="paint0_radial_2043_1685" cx="0" cy="0" r="1" gradientTransform="matrix(10.0537 288.96 -443.72 17.351 414.996 343.436)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FF73"></stop>
              <stop offset="1" stopColor="#1A1A1D" stopOpacity="0"></stop>
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Upcoming <span className="text-primary">Events</span>
            </h2>
            <p className="text-gray-text">Don't miss out on these exciting matches</p>
          </div>
          
          <div className="flex bg-dark-card p-1.5 rounded-[10px] border border-white/10">
            <button 
                onClick={() => setActiveTab('all')}
                className={`px-8 py-2.5 rounded-[8px] text-sm font-medium transition-all duration-200 ${activeTab === 'all' ? 'bg-accent-yellow text-black shadow-sm' : 'text-gray-text hover:text-white'}`}
            >
                All
            </button>
            <button 
                onClick={() => setActiveTab('live')}
                className={`px-8 py-2.5 rounded-[8px] text-sm font-medium transition-all duration-200 ${activeTab === 'live' ? 'bg-accent-yellow text-black shadow-sm' : 'text-gray-text hover:text-white'}`}
            >
                Live
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
                <span className="px-3 py-1 rounded-[8px] bg-primary/10 text-primary text-xs font-medium border border-primary/30">
                  {event.sport}
                </span>
                {event.status === 'live' && (
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FB2C36] text-white text-xs font-bold animate-pulse">
                    LIVE
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                {event.title}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-text text-sm">
                  <Calendar size={16} className="text-[#FEDE39]" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-text text-sm">
                  <MapPin size={16} className="text-[#FEDE39]" />
                  <span>{event.venue}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
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
