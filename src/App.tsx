import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import Portfolio from './pages/Portfolio';
import Clan from './pages/Clan';
import ClanDetail from './pages/ClanDetail';
import Sports from './pages/Sports';
import About from './pages/About';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import { Login } from './pages/Login';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/Toast';

function App() {
  const [selectedSport, setSelectedSport] = useState<string | undefined>();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-bg text-white selection:bg-primary/30 selection:text-primary">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home setSelectedSport={setSelectedSport} />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/clan" element={<Clan />} />
            <Route path="/clan/:clanId" element={<ClanDetail onBack={function (): void {
              throw new Error('Function not implemented.');
            } } />} />
            <Route path="/sports" element={<Sports selectedSport={selectedSport} />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Home setSelectedSport={setSelectedSport} />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
