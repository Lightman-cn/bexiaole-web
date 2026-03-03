import { useState, useEffect, useRef } from 'react';
import { Briefcase, Building2, FileText, ThumbsUp } from 'lucide-react';
import type { Job, Company } from '@/types';

interface StatsProps {
  jobs: Job[];
  companies: Company[];
}

export default function Stats({ jobs, companies }: StatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    jobCount: 0,
    companyCount: 0,
    resumeCount: 0,
    satisfactionRate: 0,
  });
  const sectionRef = useRef<HTMLElement>(null);

  // 计算统计数据
  const totalResumes = jobs.reduce((sum, job) => sum + job.resumeCount, 0);
  const satisfactionRate = 98; // 固定值

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        jobCount: Math.floor(jobs.length * easeOut),
        companyCount: Math.floor(companies.length * easeOut),
        resumeCount: Math.floor(totalResumes * easeOut),
        satisfactionRate: Math.floor(satisfactionRate * easeOut),
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          jobCount: jobs.length,
          companyCount: companies.length,
          resumeCount: totalResumes,
          satisfactionRate: satisfactionRate,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, jobs.length, companies.length, totalResumes]);

  const statItems = [
    {
      icon: Briefcase,
      value: animatedValues.jobCount,
      suffix: '',
      label: '在招职位',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Building2,
      value: animatedValues.companyCount,
      suffix: '',
      label: '合作企业',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: FileText,
      value: animatedValues.resumeCount,
      suffix: '',
      label: '收到简历',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: ThumbsUp,
      value: animatedValues.satisfactionRate,
      suffix: '%',
      label: '客户满意度',
      color: 'from-orange-400 to-orange-600',
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2b4a] via-[#2a3b5a] to-[#4a5c7a]">
        {/* Animated gradient orbs */}
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-[#c4a35a]/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <div
              key={item.label}
              className={`text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              {/* Icon */}
              <div 
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className="w-8 h-8 text-white" />
              </div>

              {/* Value */}
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {item.value}
                <span className="text-[#c4a35a]">{item.suffix}</span>
              </div>

              {/* Label */}
              <p className="text-white/70 text-sm sm:text-base">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div 
          className={`mt-16 pt-8 border-t border-white/10 transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-center text-white/50 text-sm">
            数据实时更新，反映最新招聘市场动态
          </p>
        </div>
      </div>
    </section>
  );
}
