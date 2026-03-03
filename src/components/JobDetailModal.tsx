import { useState } from 'react';
import { X, MapPin, Clock, TrendingUp, Users, FileText, Building2, MessageSquare, AlertCircle, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Job } from '@/types';
import { recruiterInsights } from '@/data/mockData';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export default function JobDetailModal({ job, isOpen, onClose, onApply }: JobDetailModalProps) {
  const [activeTab, setActiveTab] = useState('jd');

  if (!isOpen || !job) return null;

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
        return '紧急招聘';
      case 'medium':
        return '急招';
      default:
        return '正常招聘';
    }
  };

  const insight = recruiterInsights[job.company.id] || '该职位招聘情况良好，欢迎投递简历。';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Full screen on mobile */}
      <div className="relative w-full max-w-4xl max-h-[90vh] sm:max-h-[90vh] bg-white rounded-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Mobile Header - Simple */}
        <div className="sm:hidden relative bg-gradient-to-br from-[#1a2b4a] to-[#4a5c7a] p-4">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-11 h-11 min-w-[44px] bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 pr-12">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <img 
                src={job.company.logo} 
                alt={job.company.name}
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white truncate">{job.title}</h2>
              <p className="text-white/70 text-sm truncate">{job.company.name}</p>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block relative bg-gradient-to-br from-[#1a2b4a] to-[#4a5c7a] p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <img 
                src={job.company.logo} 
                alt={job.company.name}
                className="w-12 h-12 object-contain"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                <Badge 
                  variant="outline" 
                  className={`${getUrgencyColor(job.urgency)}`}
                >
                  {job.urgency === 'high' && <Flame className="w-3 h-3 mr-1" />}
                  {getUrgencyText(job.urgency)}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {job.company.name}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  发布于 {job.publishedAt}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-[#c4a35a]">{job.salary}</div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-[#1a2b4a] font-bold text-xl">
                <TrendingUp className="w-5 h-5 text-[#c4a35a]" />
                {job.hcCount}
              </div>
              <p className="text-xs text-gray-500 mt-1">招聘HC</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="flex items-center justify-center gap-2 text-[#4a5c7a] font-bold text-xl">
                <Users className="w-5 h-5 text-[#c4a35a]" />
                {job.inProcessCount}
              </div>
              <p className="text-xs text-gray-500 mt-1">流程中</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600 font-bold text-xl">
                <FileText className="w-5 h-5 text-[#c4a35a]" />
                {job.resumeCount}
              </div>
              <p className="text-xs text-gray-500 mt-1">收到简历</p>
            </div>
          </div>
          
          <p className="mt-3 text-xs text-gray-400 text-center">
            * 以上数据为本猎头个人操盘数据，非全网数据
          </p>
        </div>

        {/* Content - Full height on mobile */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-180px)] sm:max-h-[50vh]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
              <TabsTrigger value="jd" className="min-h-[44px] text-xs sm:text-sm">职位详情</TabsTrigger>
              <TabsTrigger value="company" className="min-h-[44px] text-xs sm:text-sm">公司信息</TabsTrigger>
              <TabsTrigger value="insight" className="min-h-[44px] text-xs sm:text-sm">猎头洞察</TabsTrigger>
            </TabsList>

            <TabsContent value="jd" className="space-y-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-[#f5f5f5] text-gray-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* JD */}
              <div className="prose prose-gray max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: job.jd.replace(/\n/g, '<br/>') }}
                />
              </div>

              {/* Requirements */}
              <div>
                <h4 className="font-semibold text-[#1a2b4a] mb-3">任职要求</h4>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-[#c4a35a] rounded-full mt-2 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="company" className="space-y-6">
              <div className="flex items-start gap-4">
                <img 
                  src={job.company.logo} 
                  alt={job.company.name}
                  className="w-20 h-20 object-contain bg-gray-50 rounded-xl p-2"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#1a2b4a]">{job.company.name}</h3>
                  <p className="text-gray-500 mt-1">{job.company.description}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-[#1a2b4a] mb-3">公司亮点</h4>
                <div className="grid grid-cols-2 gap-3">
                  {job.company.reportContent.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5 bg-[#c4a35a]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-[#c4a35a] rounded-full" />
                      </span>
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <h4 className="font-semibold text-[#1a2b4a]">公司介绍</h4>
                <p className="text-gray-600">{job.company.reportContent.preview}</p>
              </div>
            </TabsContent>

            <TabsContent value="insight" className="space-y-6">
              <div className="bg-gradient-to-br from-[#c4a35a]/10 to-[#d4b36a]/10 rounded-xl p-6 border border-[#c4a35a]/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#c4a35a] rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a2b4a]">猎头独家洞察</h4>
                    <p className="text-sm text-gray-500">来自一线猎头的真实反馈</p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {insight}
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">投递建议</h4>
                    <p className="text-sm text-blue-700">
                      该职位目前{job.urgency === 'high' ? '需求紧急' : '正常招聘'}，建议尽快投递。
                      简历筛选周期约3-5个工作日，面试流程共{job.urgency === 'high' ? '3' : '4'}轮。
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            对职位感兴趣？立即联系我们
          </div>
          <Button
            onClick={onApply}
            className="w-full sm:w-auto px-8 py-3 min-h-[44px] bg-gradient-to-r from-[#1a2b4a] to-[#4a5c7a] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            投递简历
          </Button>
        </div>
      </div>
    </div>
  );
}
