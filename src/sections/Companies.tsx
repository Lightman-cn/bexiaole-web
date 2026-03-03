import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Building2, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Company } from '@/types';

interface CompaniesProps {
  companies: Company[];
  onCompanyClick: (company: Company) => void;
  onViewAll: () => void;
}

export default function Companies({ companies, onCompanyClick, onViewAll }: CompaniesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);
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

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? companies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === companies.length - 1 ? 0 : prev + 1));
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + companies.length) % companies.length);
    
    if (normalizedDiff === 0) {
      return {
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        zIndex: 10,
        opacity: 1,
      };
    } else if (normalizedDiff === 1 || normalizedDiff === -companies.length + 1) {
      return {
        transform: 'translateX(60%) scale(0.85) rotateY(-25deg)',
        zIndex: 5,
        opacity: 0.7,
      };
    } else if (normalizedDiff === companies.length - 1 || normalizedDiff === -1) {
      return {
        transform: 'translateX(-60%) scale(0.85) rotateY(25deg)',
        zIndex: 5,
        opacity: 0.7,
      };
    } else {
      return {
        transform: 'translateX(0) scale(0.6) rotateY(0deg)',
        zIndex: 0,
        opacity: 0,
      };
    }
  };

  if (companies.length === 0) {
    return (
      <section ref={sectionRef} id="companies" className="py-20 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2b4a] mb-4">
              热门招聘公司
            </h2>
            <p className="text-gray-600">正在拓展合作企业，敬请期待</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="companies" className="py-20 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className={`text-3xl sm:text-4xl font-bold text-[#1a2b4a] mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            热门招聘公司
          </h2>
          <p 
            className={`text-gray-600 max-w-2xl mx-auto transition-all duration-600 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            与优质企业建立合作关系
          </p>
        </div>

        {/* Mobile: Simple horizontal scroll cards */}
        <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
          <div className="flex gap-4">
            {companies.map((company, index) => (
              <div
                key={company.id}
                onClick={() => onCompanyClick(company)}
                className="flex-shrink-0 w-[280px] snap-center bg-white rounded-2xl shadow-lg p-6 cursor-pointer"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#1a2b4a] mb-2">
                    {company.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {company.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#1a2b4a] text-[#1a2b4a] hover:bg-[#1a2b4a] hover:text-white"
                  >
                    查看详情
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 3D Carousel */}
        <div 
          className={`hidden lg:block relative h-[400px] perspective-1000 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {companies.map((company, index) => {
              const style = getCardStyle(index);
              const isHovered = hoveredCompany === company.id;
              
              return (
                <div
                  key={company.id}
                  onClick={() => index === activeIndex && onCompanyClick(company)}
                  onMouseEnter={() => setHoveredCompany(company.id)}
                  onMouseLeave={() => setHoveredCompany(null)}
                  className={`absolute w-full max-w-md bg-white rounded-2xl shadow-xl cursor-pointer transition-all duration-600 ${
                    index === activeIndex ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  style={{
                    ...style,
                    transform: `${style.transform} ${isHovered && index === activeIndex ? 'translateY(-10px)' : ''}`,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div className="p-8">
                    {/* Company Logo */}
                    <div className="flex justify-center mb-6">
                      <div 
                        className={`w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                          isHovered && index === activeIndex ? 'scale-110 shadow-lg' : ''
                        }`}
                      >
                        <img 
                          src={company.logo} 
                          alt={company.name}
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-[#1a2b4a] mb-2">
                        {company.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        {company.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-center gap-6 mb-6">
                        <div className="flex items-center gap-2 text-[#1a2b4a]">
                          <Building2 className="w-4 h-4 text-[#c4a35a]" />
                          <span className="font-semibold">{company.jobCount}</span>
                          <span className="text-sm text-gray-500">在招职位</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a2b4a]">
                          <TrendingUp className="w-4 h-4 text-[#c4a35a]" />
                          <span className="text-sm text-gray-500">
                            {company.type === 'internet' ? '互联网大厂' : 
                             company.type === 'startup' ? '创业公司' :
                             company.type === 'state' ? '国央企' : '硬件厂商'}
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      {index === activeIndex && (
                        <Button
                          variant="outline"
                          className="border-[#1a2b4a] text-[#1a2b4a] hover:bg-[#1a2b4a] hover:text-white transition-all duration-300"
                        >
                          查看公司详情
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1a2b4a] hover:bg-[#c4a35a] hover:text-white transition-all duration-300 z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1a2b4a] hover:bg-[#c4a35a] hover:text-white transition-all duration-300 z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator - Desktop only */}
        <div className="hidden lg:flex justify-center gap-2 mt-8">
          {companies.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'w-8 bg-[#c4a35a]' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            onClick={onViewAll}
            className="px-8 py-3 bg-gradient-to-r from-[#1a2b4a] to-[#4a5c7a] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            查看全部公司
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
