import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import Portfolio from './pages/Portfolio';
import Clan from './pages/Clan';
import ClanDetail from './pages/ClanDetail';
import Sports from './pages/Sports';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/Toast';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'portfolio' | 'clan' | 'clanDetail' | 'sports'>('home');
  const [selectedClanId, setSelectedClanId] = useState<string | undefined>();

  const handleNavigateToClanDetail = (clanId: string) => {
    setSelectedClanId(clanId);
    setCurrentPage('clanDetail');
  };

  const handleBackFromClanDetail = () => {
    setSelectedClanId(undefined);
    setCurrentPage('clan');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-primary/30 selection:text-primary">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main>
        {currentPage === 'home' ? (
          <Home />
        ) : currentPage === 'portfolio' ? (
          <Portfolio />
        ) : currentPage === 'clan' ? (
          <Clan onSelectClan={handleNavigateToClanDetail} />
        ) : currentPage === 'clanDetail' ? (
          <ClanDetail groupId={selectedClanId} onBack={handleBackFromClanDetail} />
        ) : (
          <Sports />
        )}
      </main>
      {!['clan', 'clanDetail', 'sports'].includes(currentPage) && <Footer />}
      <Toaster />
    </div>
  );
}

export default App;
