import { Twitter, Facebook, Instagram, Youtube, Github } from 'lucide-react';
import logoImg from '../assets/juspredict-logo.svg';

interface FooterProps {
  onNavigate?: (page: 'home' | 'portfolio' | 'clan' | 'clanDetail' | 'sports' | 'about' | 'faq' | 'contact') => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  const handleLinkClick = (e: React.MouseEvent, page?: string) => {
    if (page && onNavigate) {
      e.preventDefault();
      onNavigate(page as any);
    }
  };

  return (
    <footer className="bg-dark-bg border-t border-white/5 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-y-8 lg:gap-x-12 gap-x-6 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="JusPredict" className="h-16 w-auto" />
            </div>
            <p className="text-gray-text text-sm leading-relaxed">
              The ultimate sports prediction platform. Join thousands of sports enthusiasts and start earning rewards today.
            </p>
            <div className="flex gap-4">
              {[Twitter, Facebook, Instagram, Youtube, Github].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-10 h-10 rounded-lg bg-dark-card border border-white/5 flex items-center justify-center text-gray-text hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {[
            {
              title: 'Product',
              links: ['Features', 'Sports', 'Leaderboard', 'Pricing']
            },
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Blog', 'Press']
            },
            {
              title: 'Support',
              links: ['Help Center', 'Contact', 'FAQ', 'Terms']
            },
            {
              title: 'Legal',
              links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Responsible Gaming']
            }
          ].map((column, idx) => (
            <div key={idx}>
              <h4 className="text-white font-bold mb-6">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link) => {
                  let pageLink: string | undefined;
                  if (link === 'Contact') pageLink = 'contact';
                  else if (link === 'FAQ') pageLink = 'faq';
                  else if (link === 'About Us') pageLink = 'about';

                  return (
                    <li key={link}>
                      <a
                        href="#"
                        onClick={(e) => handleLinkClick(e, pageLink)}
                        className="text-gray-text hover:text-primary text-sm transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-text text-sm">
            © 2025 JusPredict. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-text hover:text-white text-sm">Privacy</a>
            <a href="#" className="text-gray-text hover:text-white text-sm">Terms</a>
            <a href="#" className="text-gray-text hover:text-white text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
