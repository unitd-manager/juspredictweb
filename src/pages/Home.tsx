import { Hero } from '../components/Hero';
import { TrendingSports } from '../components/TrendingSports';
import { LivePredictions } from '../components/LivePredictions';
import { UpcomingEvents } from '../components/UpcomingEvents';
import { HowItWorks } from '../components/HowItWorks';
import { StatsCTA } from '../components/StatsCTA';
import { Features } from '../components/Features';

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <TrendingSports />
      <LivePredictions />
      <UpcomingEvents />
      <HowItWorks />
      <StatsCTA />
      <Features />
    </>
  );
};
