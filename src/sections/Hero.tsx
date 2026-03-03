import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Building2, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { stats } from '@/data/mockData';

interface HeroProps {
  onSearch: (keyword: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ jobCount: 0, companyCount: 0, satisfactionRate: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate stats
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedStats({
        jobCount: Math.floor(stats.jobCount * easeOut),
        companyCount: Math.floor(stats.companyCount * easeOut),
        satisfactionRate: Math.floor(stats.satisfactionRate * easeOut),
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          jobCount: stats.jobCount,
          companyCount: stats.companyCount,
          satisfactionRate: stats.satisfactionRate,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      onSearch(searchKeyword.trim());
    }
  };

  const statItems = [
    { icon: TrendingUp, value: animatedStats.jobCount, suffix: '+', label: '在招职位' },
    { icon: Building2, value: animatedStats.companyCount, suffix: '+', label: '合作企业' },
    { icon: Star, value: animatedStats.satisfactionRate, suffix: '%', label: '客户满意度' },
  ];

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2b4a] via-[#2a3b5a] to-[#4a5c7a]">
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(196, 163, 90, 0.3) 0%, transparent 50%)',
          }}
        />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 70% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <h1 
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <span className="inline-block" style={{ transitionDelay: '300ms' }}>连接</span>
                <span className="inline-block text-[#c4a35a]" style={{ transitionDelay: '400ms' }}>顶尖人才</span>
                <br />
                <span className="inline-block" style={{ transitionDelay: '500ms' }}>与优质机会</span>
              </h1>
              
              <p 
                className={`text-lg text-white/80 max-w-xl transition-all duration-700 delay-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                我们专注于中高端人才招聘，为企业提供精准的人才解决方案，为候选人匹配理想的职业发展机会。
              </p>
            </div>

            {/* Search Box */}
            <div 
              className={`flex gap-3 max-w-lg transition-all duration-800 delay-900 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="搜索职位、公司或关键词..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-6 bg-white/95 backdrop-blur-sm border-0 rounded-xl text-gray-800 placeholder:text-gray-400 shadow-xl focus:ring-2 focus:ring-[#c4a35a] transition-all"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="px-8 py-6 bg-gradient-to-r from-[#c4a35a] to-[#d4b36a] text-[#1a2b4a] font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                搜索
              </Button>
            </div>

            {/* Quick Tags */}
            <div 
              className={`flex flex-wrap gap-2 transition-all duration-700 delay-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-white/60 text-sm">热门搜索：</span>
              {['产品经理', '算法工程师', '大模型', '杭州', '北京'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchKeyword(tag);
                    onSearch(tag);
                  }}
                  className="px-3 py-1 text-sm text-white/80 bg-white/10 rounded-full hover:bg-white/20 hover:text-white transition-all duration-300"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div 
            className={`relative hidden lg:block transition-all duration-1200 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95'
            }`}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#c4a35a]/20 to-transparent rounded-3xl blur-2xl" />
              
              {/* Image container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <ResponsiveImage
                  src="/hero-woman.jpg"
                  alt="Professional"
                  className="w-full h-auto"
                  aspectRatio="video"
                  objectFit="cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b4a]/40 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <div 
                className={`absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl transition-all duration-800 delay-1100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#c4a35a] to-[#d4b36a] rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1a2b4a]">5000+</p>
                    <p className="text-sm text-gray-500">成功匹配</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div 
          className={`mt-16 transition-all duration-800 delay-1100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-3 gap-8">
              {statItems.map((item, index) => (
                <div 
                  key={item.label} 
                  className="text-center"
                  style={{ transitionDelay: `${1300 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <item.icon className="w-5 h-5 text-[#c4a35a]" />
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {item.value}{item.suffix}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
