import { useState, useEffect } from 'react';
import { Menu, X, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '首页', href: '#hero' },
    { name: '职位', href: '#jobs' },
    { name: '公司', href: '#companies' },
    { name: '行业洞察', href: '#research' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => scrollToSection('#hero')}
          >
            <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
              isScrolled ? 'bg-[#1a2b4a]' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <Briefcase className={`w-6 h-6 ${isScrolled ? 'text-[#c4a35a]' : 'text-white'}`} />
            </div>
            <span className={`text-xl font-semibold transition-colors duration-300 ${
              isScrolled ? 'text-[#1a2b4a]' : 'text-white'
            }`}>
              AI伯乐网
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`relative text-sm font-medium transition-colors duration-300 group ${
                  isScrolled ? 'text-gray-700 hover:text-[#1a2b4a]' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#c4a35a] transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={onContactClick}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                isScrolled
                  ? 'bg-gradient-to-r from-[#1a2b4a] to-[#4a5c7a] text-white hover:shadow-lg hover:scale-105'
                  : 'bg-white text-[#1a2b4a] hover:bg-[#c4a35a] hover:text-white'
              }`}
            >
              联系我们
            </Button>
          </div>

          {/* Mobile Menu Button - 44px touch target */}
          <button
            className="md:hidden p-3 min-h-[44px] min-w-[44px] flex items-center justify-center -m-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-[#1a2b4a]' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-[#1a2b4a]' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu - Improved touch targets */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200/20">
            <div className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-left font-medium py-3 px-2 min-h-[44px] flex items-center rounded-lg transition-colors ${
                    isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <Button
                onClick={onContactClick}
                className="w-full mt-2 bg-gradient-to-r from-[#1a2b4a] to-[#4a5c7a] text-white min-h-[44px]"
              >
                联系我们
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
