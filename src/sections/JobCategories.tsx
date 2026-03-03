import { useState, useEffect, useRef } from 'react';
import { Building2, Users, Landmark, Lightbulb, Handshake, Brain, Globe, Rocket, Cpu, ChevronRight } from 'lucide-react';
import { categories } from '@/data/mockData';

interface JobCategoriesProps {
  onCategoryClick: (categoryId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Users,
  Landmark,
  Lightbulb,
  Handshake,
  Brain,
  Globe,
  Rocket,
  Cpu,
};

export default function JobCategories({ onCategoryClick }: JobCategoriesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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

  const groupedCategories = {
    industry: categories.filter(c => c.type === 'industry'),
    jobType: categories.filter(c => c.type === 'jobType'),
    companyType: categories.filter(c => c.type === 'companyType'),
  };

  const groupTitles: Record<string, string> = {
    industry: '按行业浏览',
    jobType: '按职位类型',
    companyType: '按公司类型',
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className={`text-3xl sm:text-4xl font-bold text-[#1a2b4a] mb-4 transition-all duration-800 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            按分类浏览职位
          </h2>
          <div 
            className={`w-16 h-1 bg-[#c4a35a] mx-auto rounded-full transition-all duration-500 delay-400 ${
              isVisible ? 'opacity-100 w-16' : 'opacity-0 w-0'
            }`}
          />
          <p 
            className={`mt-4 text-gray-600 max-w-2xl mx-auto transition-all duration-600 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            探索不同行业、职能和公司类型的机会
          </p>
        </div>

        {/* Category Groups */}
        <div className="space-y-12">
          {Object.entries(groupedCategories).map(([groupKey, groupCategories], groupIndex) => (
            <div 
              key={groupKey}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${500 + groupIndex * 150}ms` }}
            >
              <h3 className="text-xl font-semibold text-[#1a2b4a] mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#c4a35a] rounded-full" />
                {groupTitles[groupKey]}
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupCategories.map((category, index) => {
                  const Icon = iconMap[category.icon] || Building2;
                  const isHovered = hoveredCard === category.id;
                  
                  return (
                    <div
                      key={category.id}
                      onClick={() => onCategoryClick(category.id)}
                      onMouseEnter={() => setHoveredCard(category.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`group relative bg-white rounded-xl p-6 cursor-pointer transition-all duration-500 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      } ${
                        isHovered 
                          ? 'shadow-2xl -translate-y-3 scale-[1.02]' 
                          : 'shadow-md hover:shadow-xl'
                      }`}
                      style={{ 
                        transitionDelay: `${600 + groupIndex * 150 + index * 80}ms`,
                        transform: isHovered 
                          ? 'translateY(-12px) scale(1.02)' 
                          : 'translateY(0) scale(1)',
                      }}
                    >
                      {/* Border gradient on hover */}
                      <div 
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#c4a35a] to-[#d4b36a] opacity-0 transition-opacity duration-300 ${
                          isHovered ? 'opacity-100' : ''
                        }`}
                        style={{ padding: '2px' }}
                      >
                        <div className="w-full h-full bg-white rounded-xl" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between">
                          <div 
                            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                              isHovered 
                                ? 'bg-gradient-to-br from-[#c4a35a] to-[#d4b36a]' 
                                : 'bg-[#1a2b4a]/5'
                            }`}
                          >
                            <Icon 
                              className={`w-7 h-7 transition-colors duration-300 ${
                                isHovered ? 'text-white' : 'text-[#1a2b4a]'
                              }`} 
                            />
                          </div>
                          
                          <span className="px-3 py-1 bg-[#f5f5f5] text-[#4a5c7a] text-sm font-medium rounded-full">
                            {category.count} 个职位
                          </span>
                        </div>

                        <h4 className="mt-4 text-lg font-semibold text-[#1a2b4a] group-hover:text-[#c4a35a] transition-colors duration-300">
                          {category.name}
                        </h4>

                        <div className="mt-4 flex items-center text-[#4a5c7a] text-sm font-medium group-hover:text-[#c4a35a] transition-colors duration-300">
                          <span>查看职位</span>
                          <ChevronRight 
                            className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                              isHovered ? 'translate-x-1' : ''
                            }`} 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
