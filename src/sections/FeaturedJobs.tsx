import { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Users, TrendingUp, ChevronRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Job } from '@/types';

interface FeaturedJobsProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
  onViewAll: () => void;
}

export default function FeaturedJobs({ jobs, onJobClick, onViewAll }: FeaturedJobsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return '紧急';
      case 'medium':
        return '急招';
      default:
        return '正常';
    }
  };

  // 只显示前8个职位
  const displayJobs = jobs.slice(0, 8);

  return (
    <section ref={sectionRef} id="jobs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <h2 
              className={`text-3xl sm:text-4xl font-bold text-[#1a2b4a] mb-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              精选职位
            </h2>
            <p 
              className={`text-gray-600 transition-all duration-600 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {jobs.length > 0 ? '最新发布的热门职位机会' : '暂无在招职位，敬请期待'}
            </p>
          </div>
          
          {jobs.length > 0 && (
            <Button
              onClick={onViewAll}
              variant="outline"
              className={`mt-4 sm:mt-0 border-[#1a2b4a] text-[#1a2b4a] hover:bg-[#1a2b4a] hover:text-white transition-all duration-500 delay-400 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
            >
              查看全部职位
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Job Cards Grid */}
        {displayJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">暂无在招职位</p>
            <p className="text-gray-400 text-sm mt-2">正在积极拓展合作企业，敬请期待</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayJobs.map((job, index) => {
              const isHovered = hoveredJob === job.id;
              
              return (
                <div
                  key={job.id}
                  onClick={() => onJobClick(job)}
                  onMouseEnter={() => setHoveredJob(job.id)}
                  onMouseLeave={() => setHoveredJob(null)}
                  className={`group relative bg-white rounded-xl border border-gray-100 cursor-pointer transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  } ${
                    isHovered 
                      ? 'shadow-2xl -translate-y-4 border-[#c4a35a]/30' 
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                  style={{ 
                    transitionDelay: `${400 + index * 100}ms`,
                  }}
                >
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img 
                          src={job.company.logo} 
                          alt={job.company.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium ${getUrgencyColor(job.urgency)}`}
                      >
                        {job.urgency === 'high' && <Flame className="w-3 h-3 mr-1" />}
                        {getUrgencyText(job.urgency)}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-[#1a2b4a] group-hover:text-[#c4a35a] transition-colors duration-300 line-clamp-1">
                      {job.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mt-1">{job.company.name}</p>

                    <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {job.publishedAt.slice(5)}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="text-xl font-bold text-[#c4a35a] mb-4">
                      {job.salary}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center justify-center gap-1 text-[#1a2b4a] font-semibold text-sm">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {job.hcCount}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">HC</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center justify-center gap-1 text-[#4a5c7a] font-semibold text-sm">
                          <Users className="w-3.5 h-3.5" />
                          {job.inProcessCount}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">流程中</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center justify-center gap-1 text-gray-600 font-semibold text-sm">
                          <Clock className="w-3.5 h-3.5" />
                          {job.resumeCount}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">简历数</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-[#f5f5f5] text-gray-600 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                      {job.tags.length > 2 && (
                        <span className="px-2 py-1 bg-[#f5f5f5] text-gray-400 text-xs rounded-md">
                          +{job.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-t from-[#1a2b4a]/5 to-transparent rounded-xl transition-opacity duration-300 pointer-events-none ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Data Notice */}
        {jobs.length > 0 && (
          <p className="mt-8 text-center text-xs text-gray-400">
            * 以上数据（HC数量、流程中人数、简历数）均为本猎头个人操盘数据，非全网数据
          </p>
        )}
      </div>
    </section>
  );
}
