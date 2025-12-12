import { Hero } from '../components/Hero';
//import { TrendingSports } from '../components/TrendingSports';
//import { LivePredictions } from '../components/LivePredictions';
import { UpcomingEvents } from '../components/UpcomingEvents';
import { HowItWorks } from '../components/HowItWorks';
import { StatsCTA } from '../components/StatsCTA';
import { Features } from '../components/Features';
//import { UpcomingEventsDyn } from '../components/UpcomingEventsDyn';

// interface HomeProps {
//   onNavigate: (page: string) => void;
//   setSelectedSport:(sport:string)=>void;
// }

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      {/* <TrendingSports onNavigate={onNavigate} setSelectedSport={setSelectedSport} />
      <LivePredictions onNavigate={onNavigate} /> */}
      {/* <UpcomingEventsDyn /> */}
      <UpcomingEvents />
      <HowItWorks />
      <StatsCTA />
      <Features />
    </>
  );
};
