import { Hero } from '../components/Hero';
import { TrendingSports } from '../components/TrendingSports';
import { LivePredictions } from '../components/LivePredictions';
import { UpcomingEvents } from '../components/UpcomingEvents';
import { HowItWorks } from '../components/HowItWorks';
import { StatsCTA } from '../components/StatsCTA';
import { Features } from '../components/Features';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <>
      <Hero />
      <TrendingSports onNavigate={onNavigate} />
      <LivePredictions onNavigate={onNavigate} />
      <UpcomingEvents />
      <HowItWorks />
      <StatsCTA />
      <Features />
    </>
  );
};
