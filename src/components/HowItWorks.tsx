import { Target, TrendingUp, Users, Award } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Predict',
    description: 'Choose your favorite sport and make predictions on match outcomes.',
    icon: <Target size={24} />
  },
  {
    id: 2,
    title: 'Trading',
    description: 'Trade your predictions with other users in real-time markets.',
    icon: <TrendingUp size={24} />
  },
  {
    id: 3,
    title: 'Clan',
    description: 'Join or create clans to compete together and share strategies.',
    icon: <Users size={24} />
  },
  {
    id: 4,
    title: 'Rewards',
    description: 'Earn points and rewards based on your prediction accuracy.',
    icon: <Award size={24} />
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements (decorative SVG) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <svg width="768" height="544" viewBox="0 0 768 544" fill="none" className="max-w-none w-[768px] h-[544px]" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_f_35_50)">
            <rect x="64" width="384" height="384" rx="192" fill="#00FF73" fillOpacity="0.05" />
          </g>
          <g filter="url(#filter1_f_35_50)">
            <rect x="320" y="159.5" width="384" height="384" rx="192" fill="#00FF73" fillOpacity="0.05" />
          </g>
          <defs>
            <filter id="filter0_f_35_50" x="0" y="-64" width="512" height="512" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="32" result="effect1_foregroundBlur_35_50" />
            </filter>
            <filter id="filter1_f_35_50" x="256" y="95.5" width="512" height="512" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="32" result="effect1_foregroundBlur_35_50" />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-gray-text">Start your prediction journey in four simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative group">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-[2px] bg-gradient-to-r from-primary/30 to-accent-yellow z-0 -translate-y-1/2" />
              )}
              
              <div className="relative z-10 bg-dark-card border border-white/5 rounded-2xl p-8 text-center h-full hover:border-primary/30 transition-all duration-300 hover:-translate-y-2">
                
                {/* Number Badge - Absolute Positioned */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black font-bold text-base shadow-lg shadow-primary/20 z-20">
                    {step.id}
                </div>

                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-[14px] flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-text text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
