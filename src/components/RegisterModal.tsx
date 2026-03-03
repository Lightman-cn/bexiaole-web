import { useState } from 'react';
import { X, User, Phone, Mail, MessageCircle, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: { name?: string; phone?: string; wechat?: string; email?: string }) => void;
  mode: 'register' | 'download';
}

export default function RegisterModal({ isOpen, onClose, onRegister, mode }: RegisterModalProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wechat: '',
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (activeTab === 'basic') {
      if (!formData.phone && !formData.wechat) {
        alert('请至少填写手机号或微信号');
        return;
      }
    } else {
      if (!formData.email) {
        alert('请填写邮箱地址');
        return;
      }
    }

    onRegister(formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', wechat: '', email: '' });
      onClose();
    }, 2000);
  };

  const isBasicValid = formData.phone || formData.wechat;
  const isEmailValid = formData.email && formData.email.includes('@');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#1a2b4a] to-[#4a5c7a] p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 bg-[#c4a35a] rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#1a2b4a]" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'register' ? '注册查看完整内容' : '下载调研报告'}
          </h2>
          <p className="text-white/80 text-sm">
            {mode === 'register' 
              ? '留下您的联系方式，解锁全部公司调研报告' 
              : '留下您的邮箱，我们将发送报告到您的邮箱'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a2b4a] mb-2">
                {mode === 'register' ? '注册成功！' : '提交成功！'}
              </h3>
              <p className="text-gray-500">
                {mode === 'register' 
                  ? '您现在可以查看完整内容了' 
                  : '报告将很快发送到您的邮箱'}
              </p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="email">邮箱{mode === 'download' ? '（必填）' : ''}</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700">
                    <User className="w-4 h-4 inline mr-1" />
                    姓名（选填）
                  </Label>
                  <Input
                    id="name"
                    placeholder="请输入您的姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700">
                    <Phone className="w-4 h-4 inline mr-1" />
                    手机号{mode === 'register' ? '（至少填一项）' : ''}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入您的手机号"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="wechat" className="text-gray-700">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    微信号{mode === 'register' ? '（至少填一项）' : ''}
                  </Label>
                  <Input
                    id="wechat"
                    placeholder="请输入您的微信号"
                    value={formData.wechat}
                    onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!isBasicValid}
                  className="w-full py-3 bg-gradient-to-r from-[#c4a35a] to-[#d4b36a] text-[#1a2b4a] font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {mode === 'register' ? '立即注册' : '下一步'}
                </Button>

                {mode === 'register' && (
                  <p className="text-center text-sm text-gray-400">
                    或
                  </p>
                )}

                {mode === 'register' && (
                  <Button
                    onClick={() => setActiveTab('email')}
                    variant="outline"
                    className="w-full py-3 border-[#1a2b4a] text-[#1a2b4a] rounded-xl"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    使用邮箱注册
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700">
                    <Mail className="w-4 h-4 inline mr-1" />
                    邮箱地址
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入您的邮箱地址"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {mode === 'download' 
                      ? '报告将发送到此邮箱' 
                      : '用于接收职位推荐和报告'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="name-email" className="text-gray-700">
                    <User className="w-4 h-4 inline mr-1" />
                    姓名（选填）
                  </Label>
                  <Input
                    id="name-email"
                    placeholder="请输入您的姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!isEmailValid}
                  className="w-full py-3 bg-gradient-to-r from-[#c4a35a] to-[#d4b36a] text-[#1a2b4a] font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {mode === 'register' ? '使用邮箱注册' : '发送报告到邮箱'}
                </Button>

                <Button
                  onClick={() => setActiveTab('basic')}
                  variant="ghost"
                  className="w-full text-gray-500"
                >
                  返回上一步
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Footer */}
        {!isSubmitted && (
          <div className="border-t border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400">
              我们承诺保护您的隐私信息，仅用于职位推荐服务
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
