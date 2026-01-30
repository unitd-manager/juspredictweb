import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
//import { useHostname } from './lib/useHostname';
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
import { Signup } from './pages/Signup'
import { VerifyEmail } from './pages/VerifyEmail';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/Toast';
import Transactions from './pages/Transactions';
import OrderDetails from './pages/OrderDetails';
import Profile from "./pages/Profile";
import PortfolioDyn from './pages/PortfolioDyn';
import TransactionsDyn from './pages/TransactionsDyn';
import Predictions from './pages/Predictions';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [ selectedSport ] = useState<string | undefined>();
  // const hostname = useHostname();
  // const allowedHosts = [
  //   'localhost',
  //   '127.0.0.1',
  // ];
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-dark-bg text-white selection:bg-primary/30 selection:text-primary">
        <Navbar />
        <main>
       <Routes>
  {/* PUBLIC ROUTES */}
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/faq" element={<Faq />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/verify-email" element={<VerifyEmail />} />

  {/* 🔒 PROTECTED ROUTES */}
  <Route path="/portfoliodyn" element={
    <ProtectedRoute>
      <Portfolio />
    </ProtectedRoute>
  } />

  <Route path="/portfolio" element={
    <ProtectedRoute>
      <PortfolioDyn />
    </ProtectedRoute>
  } />

  <Route path="/predictions" element={
    <ProtectedRoute>
      <Predictions />
    </ProtectedRoute>
  } />

  <Route path="/clanlist" element={
    <ProtectedRoute>
      <Clan />
    </ProtectedRoute>
  } />

  <Route path="/clan/:clanId" element={
    <ProtectedRoute>
      <ClanDetail onBack={() => {}} />
    </ProtectedRoute>
  } />

  <Route path="/clan" element={
    <ProtectedRoute>
      <Suspense fallback={null}>
        <ClanList />
      </Suspense>
    </ProtectedRoute>
  } />

  <Route path="/clanDetailDyn/:groupId" element={
    <ProtectedRoute>
      <Suspense fallback={null}>
        <ClanDetailDyn />
      </Suspense>
    </ProtectedRoute>
  } />

  <Route path="/sports" element={
    <ProtectedRoute>
      <Suspense fallback={null}>
        <SportsDyn />
      </Suspense>
    </ProtectedRoute>
  } />

  <Route path="/sportsDyn" element={
    <ProtectedRoute>
      <Sports selectedSport={selectedSport} />
    </ProtectedRoute>
  } />

  <Route path="/transactionsdyn" element={
    <ProtectedRoute>
      <Transactions />
    </ProtectedRoute>
  } />

  <Route path="/transactions" element={
    <ProtectedRoute>
      <TransactionsDyn />
    </ProtectedRoute>
  } />

  <Route path="/order-details/:orderId" element={
    <ProtectedRoute>
      <OrderDetails />
    </ProtectedRoute>
  } />

  <Route path="/profile" element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } />

  {/* FALLBACK */}
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
