import { useState } from 'react';
import { X, Building2, TrendingUp, FileText, Lock, Check, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Company } from '@/types';

interface CompanyDetailModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
  isRegistered: boolean;
  onDownloadReport: () => void;
}

export default function CompanyDetailModal({ 
  company, 
  isOpen, 
  onClose, 
  onRegister, 
  isRegistered,
  onDownloadReport 
}: CompanyDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !company) return null;

  const getCompanyTypeText = (type: string) => {
    switch (type) {
      case 'internet':
        return '互联网大厂';
      case 'startup':
        return '创业公司';
      case 'state':
        return '国央企';
      case 'hardware':
        return '硬件集成厂商';
      default:
        return '其他';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#1a2b4a] to-[#4a5c7a] p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <img 
                src={company.logo} 
                alt={company.name}
                className="w-16 h-16 object-contain"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{company.name}</h2>
                <Badge className="bg-[#c4a35a] text-[#1a2b4a]">
                  {getCompanyTypeText(company.type)}
                </Badge>
              </div>
              
              <p className="text-white/80">{company.description}</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-[#1a2b4a] font-bold text-2xl">
                <Building2 className="w-5 h-5 text-[#c4a35a]" />
                {company.jobCount}
              </div>
              <p className="text-xs text-gray-500 mt-1">在招职位</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-[#4a5c7a] font-bold text-2xl">
                <TrendingUp className="w-5 h-5 text-[#c4a35a]" />
                {company.industry === 'tob' ? 'ToB' : company.industry === 'toc' ? 'ToC' : '综合'}
              </div>
              <p className="text-xs text-gray-500 mt-1">业务类型</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600 font-bold text-2xl">
                <FileText className="w-5 h-5 text-[#c4a35a]" />
                {company.reportAvailable ? '有' : '暂无'}
              </div>
              <p className="text-xs text-gray-500 mt-1">调研报告</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="overview">公司概览</TabsTrigger>
              <TabsTrigger value="report">调研报告</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Highlights */}
              <div>
                <h4 className="font-semibold text-[#1a2b4a] mb-3">公司亮点</h4>
                <div className="grid grid-cols-2 gap-3">
                  {company.reportContent.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <span className="w-5 h-5 bg-[#c4a35a]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#c4a35a]" />
                      </span>
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <h4 className="font-semibold text-[#1a2b4a] mb-3">公司简介</h4>
                <p className="text-gray-600 leading-relaxed">
                  {company.reportContent.preview}
                </p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-[#1a2b4a]/5 to-[#4a5c7a]/5 rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-4">
                  想深入了解{company.name}的详细信息？
                </p>
                <Button
                  onClick={() => setActiveTab('report')}
                  variant="outline"
                  className="border-[#1a2b4a] text-[#1a2b4a] hover:bg-[#1a2b4a] hover:text-white"
                >
                  查看完整调研报告
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="report" className="space-y-6">
              {company.reportAvailable ? (
                <>
                  {/* Report Preview */}
                  <div className="relative">
                    <div className={`bg-gray-50 rounded-xl p-6 ${!isRegistered ? 'blur-sm' : ''}`}>
                      <div className="prose prose-gray max-w-none">
                        <div 
                          className="text-gray-700 leading-relaxed whitespace-pre-line"
                          dangerouslySetInnerHTML={{ 
                            __html: company.reportContent.fullContent.replace(/\n/g, '<br/>') 
                          }}
                        />
                      </div>
                    </div>

                    {/* Lock Overlay */}
                    {!isRegistered && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-[#c4a35a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-[#c4a35a]" />
                          </div>
                          <h4 className="text-lg font-semibold text-[#1a2b4a] mb-2">
                            完整报告需注册查看
                          </h4>
                          <p className="text-gray-500 text-sm mb-4">
                            留下您的联系方式，即可解锁完整内容
                          </p>
                          <Button
                            onClick={onRegister}
                            className="bg-gradient-to-r from-[#c4a35a] to-[#d4b36a] text-[#1a2b4a] font-semibold"
                          >
                            立即注册
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Download CTA */}
                  {isRegistered && (
                    <div className="bg-gradient-to-br from-[#c4a35a]/10 to-[#d4b36a]/10 rounded-xl p-6 border border-[#c4a35a]/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-[#1a2b4a] mb-1">
                            下载完整报告
                          </h4>
                          <p className="text-sm text-gray-500">
                            留下邮箱，我们将发送PDF版本到您的邮箱
                          </p>
                        </div>
                        <Button
                          onClick={onDownloadReport}
                          variant="outline"
                          className="border-[#c4a35a] text-[#c4a35a] hover:bg-[#c4a35a] hover:text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          下载报告
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">
                    调研报告准备中
                  </h4>
                  <p className="text-gray-500">
                    我们正在为您准备该公司的详细调研报告，敬请期待
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            对该公司的职位感兴趣？
          </div>
          <Button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-[#1a2b4a] to-[#4a5c7a] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            查看相关职位
          </Button>
        </div>
      </div>
    </div>
  );
}
