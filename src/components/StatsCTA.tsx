import { Button } from './ui/Button';
import { Sparkles } from 'lucide-react';
import dollarImg from '../assets/dollar.png';
import trendingReverseImg from '../assets/trending-reverse.png';

export const StatsCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* SVG background (behind content) */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <svg width="961" height="620" viewBox="0 0 961 620" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="332.5" cy="367.5" rx="332.5" ry="352.5" fill="url(#paint0_radial_35_50)" fill-opacity="0.5" />
          <ellipse cx="628.5" cy="318.5" rx="332.5" ry="352.5" fill="url(#paint1_radial_35_50)" fill-opacity="0.5" />
          <defs>
            {/* <radialGradient id="paint0_radial_35_50" cx="0" cy="0" r="1" gradientTransform="matrix(75.1627 280.515 -293.643 78.6823 332.5 368.071)" gradientUnits="userSpaceOnUse">
              <stop stop-color="#00FF73" />
              <stop offset="1" stop-color="#1A1A1D" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="paint1_radial_35_50" cx="0" cy="0" r="1" gradientTransform="matrix(75.1627 280.515 -293.643 78.6823 628.5 319.071)" gradientUnits="userSpaceOnUse">
              <stop stop-color="#00FF73" />
              <stop offset="1" stop-color="#1A1A1D" stop-opacity="0" />
            </radialGradient> */}
          </defs>
        </svg>
      </div>

      {/* Backgrounds */}
      <div className="absolute left-[10%] top-[65%]">
        <img src={dollarImg} alt="left dollar" />
      </div>
      <div className="absolute right-[15%] top-25">
        <img src={trendingReverseImg} alt="trending-reverse" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-8 animate-pulse border border-primary/20">
          <Sparkles size={32} />
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to start <span className="text-primary">predicting?</span>
        </h2>

        <p className="text-lg text-gray-text mb-10 max-w-2xl mx-auto">
          Join JusPredict today and earn rewards with every prediction! Be part of a global community of sports enthusiasts.
        </p>

        <Button size="lg" className="h-14 px-10 text-lg bg-primary text-black font-bold shadow-glow hover:shadow-[0_0_40px_rgba(0,255,115,0.5)] transition-shadow">
          Get Started
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-20 pt-12">
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '50K+', label: 'Predictions Made' },
            { value: '$1M+', label: 'Rewards Distributed' },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-4xl font-bold text-primary mb-2">{stat.value}</span>
              <span className="text-gray-text text-sm font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
