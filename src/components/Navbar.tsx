import { useState } from 'react';
import { Button } from './ui/Button';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/juspredict-logo.svg';

interface NavbarProps {
  onNavigate: (page: 'home' | 'portfolio' | 'clan' | 'clanDetail' | 'sports') => void;
  currentPage: 'home' | 'portfolio' | 'clan' | 'clanDetail' | 'sports';
}

export const Navbar = ({ onNavigate, currentPage }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#', page: 'home' as const },
    { name: 'FAQ', href: '#', page: undefined },
    { name: 'Portfolio', href: '#', page: 'portfolio' as const },
    { name: 'Clan', href: '#', page: 'clan' as const },
    { name: 'Sports', href: '#', page: 'sports' as const },
    { name: 'Events', href: '#', page: undefined },
    { name: 'Leaderboard', href: '#', page: undefined },
    { name: 'About', href: '#', page: undefined },
    { name: 'API Docs', href: '#', page: undefined },
  ];

  const handleLinkClick = (e: React.MouseEvent, page?: 'home' | 'portfolio' | 'clan' | 'clanDetail' | 'sports') => {
    if (page) {
      e.preventDefault();
      onNavigate(page);
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <img src={logoImg} alt="JusPredict" className="h-16 w-auto" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.page && currentPage === link.page;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.page)}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-gray-light hover:text-primary'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-light hover:text-white">Login</Button>
            <Button size="sm" className="bg-primary text-black hover:bg-primary/90 font-bold px-6">Sign Up</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-text hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-bg border-b border-white/5">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = link.page && currentPage === link.page;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.page)}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-primary font-bold bg-white/5'
                      : 'text-gray-text hover:text-primary hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <div className="pt-4 flex flex-col gap-3">
              <Button variant="ghost" className="w-full text-white">Login</Button>
              <Button className="w-full bg-primary text-black font-bold">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
