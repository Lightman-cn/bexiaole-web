import { useState } from 'react';
import { Briefcase, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FooterProps {
  onSubscribe: (email: string) => void;
}

export default function Footer({ onSubscribe }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      onSubscribe(email.trim());
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const quickLinks = [
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
  };

  return (
    <footer className="relative bg-[#1a2b4a] text-white overflow-hidden">
      {/* Wave SVG */}
      <div className="absolute top-0 left-0 right-0">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z" 
            fill="#f5f5f5"
          />
        </svg>
      </div>

      <div className="relative z-10 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#c4a35a] rounded-lg">
                  <Briefcase className="w-6 h-6 text-[#1a2b4a]" />
                </div>
                <span className="text-xl font-bold">AI伯乐网</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                专注中高端人才招聘，连接企业与优秀人才。我们提供专业的招聘服务和深度的行业洞察。
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">快速链接</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-white/70 hover:text-[#c4a35a] transition-colors duration-300 text-sm py-2 min-h-[44px] block w-full text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">联系方式</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white/70 text-sm">
                  <Phone className="w-4 h-4 text-[#c4a35a]" />
                  <span>400-XXX-XXXX</span>
                </li>
                <li className="flex items-center gap-3 text-white/70 text-sm">
                  <Mail className="w-4 h-4 text-[#c4a35a]" />
                  <span>contact@liepin.com</span>
                </li>
                <li className="flex items-center gap-3 text-white/70 text-sm">
                  <MapPin className="w-4 h-4 text-[#c4a35a]" />
                  <span>北京市朝阳区XXX大厦</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">订阅职位资讯</h3>
              <p className="text-white/70 text-sm mb-4">
                获取最新职位信息和行业洞察
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="输入您的邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#c4a35a]"
                />
                <Button
                  onClick={handleSubscribe}
                  className="min-w-[44px] min-h-[44px] sm:min-h-[36px] bg-[#c4a35a] text-[#1a2b4a] hover:bg-[#d4b36a] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {isSubscribed && (
                <p className="mt-2 text-green-400 text-sm animate-fade-in">
                  订阅成功！
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white/50 text-sm">
                © 2024 AI伯乐网. All rights reserved.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <button 
                  aria-label="微信"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c4a35a] hover:text-[#1a2b4a] transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button 
                  aria-label="LinkedIn"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c4a35a] hover:text-[#1a2b4a] transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.194 2H3.806A1.806 1.806 0 002 3.806v16.388A1.806 1.806 0 003.806 22h16.388A1.806 1.806 0 0022 20.194V3.806A1.806 1.806 0 0020.194 2zM8.085 18.937H5.522V9.593h2.563v9.344zM6.803 8.449a1.485 1.485 0 110-2.97 1.485 1.485 0 010 2.97zm12.134 10.488h-2.563v-4.548c0-1.085-.02-2.481-1.512-2.481-1.514 0-1.746 1.182-1.746 2.401v4.628h-2.563V9.593h2.461v1.279h.035c.342-.647 1.178-1.33 2.424-1.33 2.593 0 3.07 1.707 3.07 3.927v5.468z"/>
                  </svg>
                </button>
                <button 
                  aria-label="GitHub"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c4a35a] hover:text-[#1a2b4a] transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
