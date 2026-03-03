import { useState, useEffect, useRef } from 'react';
import { Check, Lock, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { companies } from '@/data/mockData';

interface ResearchProps {
  onRegisterClick: () => void;
}

export default function Research({ onRegisterClick }: ResearchProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredReport, setHoveredReport] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const reports = companies.filter(c => c.reportAvailable).slice(0, 3);

  const highlights = [
    '业务模式与市场定位分析',
    '团队架构与企业文化解读',
    '发展前景与行业竞争力评估',
    '薪酬福利与职业发展路径',
  ];

  return (
    <section ref={sectionRef} id="research" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 
                className={`text-3xl sm:text-4xl font-bold text-[#1a2b4a] mb-4 transition-all duration-800 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                深度公司调研
              </h2>
              <p 
                className={`text-gray-600 text-lg transition-all duration-600 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                我们提供深入的公司分析报告，帮助候选人全面了解目标企业的业务状况、团队文化、发展前景等关键信息。
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              {highlights.map((item, index) => (
                <div 
                  key={item}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-[#c4a35a]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#c4a35a]" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div 
              className={`transition-all duration-700 delay-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Button
                onClick={onRegisterClick}
                className="px-8 py-6 bg-gradient-to-r from-[#c4a35a] to-[#d4b36a] text-[#1a2b4a] font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                注册查看完整版
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="mt-3 text-sm text-gray-400">
                已有账号？登录后即可查看完整调研报告
              </p>
            </div>
          </div>

          {/* Right - Report Cards Stack */}
          <div 
            className={`relative h-[500px] transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ perspective: '800px' }}
          >
            {reports.map((report, index) => {
              const isHovered = hoveredReport === report.id;
              const offset = (index - 1) * 30;
              const rotation = (index - 1) * -5;
              
              return (
                <div
                  key={report.id}
                  onMouseEnter={() => setHoveredReport(report.id)}
                  onMouseLeave={() => setHoveredReport(null)}
                  className={`absolute top-1/2 left-1/2 w-72 h-96 bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${offset}px) rotateY(${rotation}deg) translateZ(${isHovered ? '50px' : '0'})`,
                    zIndex: isHovered ? 10 : 3 - index,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${500 + index * 100}ms`,
                  }}
                >
                  {/* Report Cover */}
                  <div className="relative h-full">
                    <ResponsiveImage 
                      src={report.reportImage} 
                      alt={`${report.name}调研报告`}
                      className="w-full h-full"
                      aspectRatio="auto"
                      objectFit="cover"
                      lazy={true}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-[#c4a35a]" />
                        <span className="text-sm text-gray-500">调研报告</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#1a2b4a] mb-2">
                        {report.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {report.reportContent.preview}
                      </p>
                      
                      {/* Preview Badge */}
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-[#c4a35a]/10 text-[#c4a35a] text-xs font-medium rounded-full">
                          免费预览
                        </span>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Lock className="w-3.5 h-3.5" />
                          <span>完整版需注册</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Decorative elements */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 bg-black/10 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
