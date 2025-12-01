import { Zap, Globe, Gift, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: 'Real-Time Match Predictions',
    description: 'Get instant updates and make predictions as the action unfolds. Stay ahead with live data.',
    icon: <Zap size={24} />
  },
  {
    title: 'Global Community',
    description: 'Join thousands of sports enthusiasts worldwide. Compete, collaborate, and climb leaderboards.',
    icon: <Globe size={24} />
  },
  {
    title: 'Transparent Rewards',
    description: 'Earn real rewards for accurate predictions. Track your earnings with our transparent system.',
    icon: <Gift size={24} />
  },
  {
    title: 'Secure & Fair Platform',
    description: 'Built with security and fairness in mind. Your data and rewards are protected with encryption.',
    icon: <ShieldCheck size={24} />
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-black/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-primary">JusPredict</span>
          </h2>
          <p className="text-gray-text">Experience the future of sports prediction</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-dark-card border border-white/5 rounded-2xl p-8 hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-text leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
