import { useState, useEffect, useRef } from 'react';
import { Sparkles, Brain, Scale, Search, Rocket, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BolingFeatureProps {
  onApplyClick: () => void;
}

export default function BolingFeature({ onApplyClick }: BolingFeatureProps) {
  const [isVisible, setIsVisible] = useState(false);
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

  const highlights = [
    {
      icon: Sparkles,
      title: '授人以渔的方法论',
      description: '教会您一套科学的职业决策方法，而非简单推荐岗位',
    },
    {
      icon: Brain,
      title: '资深猎头经验内核',
      description: '融合多年高端人才服务经验与专业评估框架',
    },
    {
      icon: Scale,
      title: '绝对中立客观',
      description: '在您完成自我评估并明确授权前，不涉及任何具体岗位推荐',
    },
    {
      icon: Search,
      title: '深度自我认知',
      description: '引导您系统性地分析现状、目标、市场与风险',
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      id="boling" 
      className="py-20 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1]" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#c4a35a]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#1a2b4a]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1a2b4a] to-[#4a5c7a] px-8 py-12 text-center">
            <div 
              className={`inline-flex items-center gap-2 bg-[#c4a35a] text-[#1a2b4a] px-4 py-1.5 rounded-full text-sm font-semibold mb-6 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              增值服务
            </div>
            
            <h2 
              className={`text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-800 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              伯小乐 · AI职业决策教练
            </h2>
            
            <p 
              className={`text-white/80 text-lg max-w-2xl mx-auto transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              源自资深猎头经验，帮助您科学评估每一次职业选择
            </p>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-12">
            {/* Core Value Quote */}
            <div 
              className={`bg-gradient-to-br from-[#c4a35a]/10 to-[#d4b36a]/10 border border-[#c4a35a]/20 rounded-2xl p-8 mb-10 text-center transition-all duration-800 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <p className="text-xl text-[#1a2b4a] font-medium leading-relaxed mb-4">
                "这不是一个帮您'找'工作的工具，而是一个帮您'想清楚'职业选择的AI教练。"
              </p>
              <p className="text-[#c4a35a] font-semibold">
                —— 授人以渔，而非授人以鱼
              </p>
            </div>

            {/* Description */}
            <p 
              className={`text-gray-600 text-lg leading-relaxed text-center max-w-3xl mx-auto mb-10 transition-all duration-700 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              "伯小乐"封装了我作为资深猎头顾问，用于评估高端人才职业变动的
              <span className="text-[#1a2b4a] font-semibold">系统化思考框架与决策模型</span>。
              它是一位主动的"教练"，为您提供一套清晰、可操作的思考路径，确保您不留死角地审视每一次职业选择。
            </p>

            {/* Highlights Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {highlights.map((item, index) => (
                <div
                  key={item.title}
                  className={`bg-gray-50 rounded-xl p-6 border-l-4 border-[#c4a35a] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${700 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#c4a35a]/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#c4a35a]" />
                    </div>
                    <h4 className="text-[#1a2b4a] font-semibold">{item.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed pl-13">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Status Banner */}
            <div 
              className={`bg-amber-50 border border-amber-200 rounded-xl p-6 text-center mb-8 transition-all duration-700 delay-1100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Rocket className="w-5 h-5 text-amber-600" />
                <h3 className="text-amber-800 font-semibold">正在精心打磨中</h3>
              </div>
              <p className="text-amber-700 text-sm mb-2">
                我们正在为这个独特的AI伙伴做最后的优化，预计近期开放限量体验资格。
              </p>
              <p className="text-amber-600 text-xs">
                现开放抢先体验申请，根据注册顺序与背景优先发出邀请。
              </p>
            </div>

            {/* CTA */}
            <div 
              className={`text-center transition-all duration-700 delay-1200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h3 className="text-xl font-semibold text-[#1a2b4a] mb-6">
                抢先体验伯小乐
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={onApplyClick}
                  className="px-8 py-6 bg-gradient-to-r from-[#1a2b4a] to-[#4a5c7a] text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  加微信申请体验资格
                </Button>
                <Button
                  variant="outline"
                  onClick={() => alert('体验申请功能即将开放，请先通过微信联系')}
                  className="px-8 py-6 border-2 border-[#1a2b4a] text-[#1a2b4a] rounded-full font-semibold hover:bg-[#1a2b4a] hover:text-white transition-all duration-300"
                >
                  在线申请（即将开放）
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
