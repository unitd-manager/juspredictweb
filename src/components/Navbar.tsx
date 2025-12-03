import { useState } from 'react';
import { Button } from './ui/Button';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/juspredict-logo.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', page: 'home' as const },
    { name: 'About', path: '/about', page: 'about' as const },
    { name: 'Sports', path: '/sports', page: 'sports' as const },
    { name: 'Clan', path: '/clan', page: 'clan' as const },
    { name: 'Portfolio', path: '/portfolio', page: 'portfolio' as const },
    { name: 'Transactions', path: '/transactions', page: 'transactions' as const },
    // { name: 'Events', path: '#', page: undefined },
    // { name: 'Leaderboard', path: '#', page: undefined },
    { name: 'FAQ', path: '/faq', page: 'faq' as const },
    { name: 'Contact', path: '/contact', page: 'contact' as const },
    // { name: 'API Docs', path: '#', page: undefined },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/">
              <img src={logoImg} alt="JusPredict" className="h-16 w-auto" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-gray-light hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-light hover:text-white" onClick={() => navigate('/login')}>Login</Button>
            <Button size="sm" className="bg-primary text-black hover:bg-primary/90 font-bold px-6">Sign Up</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex-shrink-0 -mr-4 sm:-mr-6 lg:-mr-8">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-text hover:text-white p-4 sm:p-6 lg:p-8"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-dark-bg border-b border-white/5">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-primary font-bold bg-white/5'
                      : 'text-gray-text hover:text-primary hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 flex flex-col gap-3">
              <Button variant="ghost" className="w-full text-white" onClick={() => navigate('/login')}>Login</Button>
              <Button className="w-full bg-primary text-black font-bold">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
