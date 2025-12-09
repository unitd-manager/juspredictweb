import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import { useHostname } from './lib/useHostname';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import { Home } from './pages/Home';
import Portfolio from './pages/Portfolio';
import Clan from './pages/Clan';
const ClanList = lazy(() => import('./pages/ClanList'));
const ClanDetailDyn = lazy(() => import('./pages/ClanDetailDyn'));
import ClanDetail from './pages/ClanDetail';
import Sports from './pages/Sports';
import SportsDyn from './pages/SportsDyn';
import About from './pages/About';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import { Login } from './pages/Login';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/Toast';
import Transactions from './pages/Transactions';


function App() {
  const [ selectedSport ] = useState<string | undefined>();
  const hostname = useHostname();
  const allowedHosts = [
    'localhost',
    '127.0.0.1',
  ];
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-dark-bg text-white selection:bg-primary/30 selection:text-primary">
        <Navbar />
        <main>
          <Routes>
              {allowedHosts.includes(hostname) && (
              <>
                <Route
                  path="/clanlist"
                  element={<Suspense fallback={null}><ClanList /></Suspense>}
                />
                <Route
                  path="/clanDetailDyn/:groupId"
                  element={<Suspense fallback={null}><ClanDetailDyn /></Suspense>}
                />
                <Route
                  path="/sportsDyn"
                  element={<Suspense fallback={null}><SportsDyn /></Suspense>}
                  />
              </>
            )}
            
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/clan" element={<Clan />} />
            <Route path="/clan/:clanId" element={<ClanDetail onBack={function (): void {
              throw new Error('Function not implemented.');
            } } />} />
            <Route path="/sports" element={<Sports selectedSport={selectedSport} />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
