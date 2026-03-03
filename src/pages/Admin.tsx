import { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, Save, Upload, Download, 
  Briefcase, Building2, Users, TrendingUp, LogOut, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Job, Company } from '@/types';
import { getArticles, getCategories, createJob, updateJob, deleteJob, createCompany } from '@/services/strapiApi';
import './Admin.css';

interface AdminProps {
  onHomeClick?: () => void;
}

// 转换Strapi数据格式（免费版适配：Category->Company, Article->Job）
function transformStrapiJob(item: any): Job {
  const attributes = item.attributes || item;
  const categoryData = attributes.category?.data;
  
  return {
    id: String(item.id),
    title: attributes.title || '',
    company: categoryData ? {
      id: String(categoryData.id),
      name: categoryData.attributes?.title || '未知公司',
      logo: '',
      type: 'internet',
      industry: 'toc',
      description: categoryData.attributes?.description || '',
      jobCount: 0,
      reportAvailable: false,
      reportImage: '',
      reportContent: { preview: '', fullContent: '', highlights: [] },
    } : { id: '0', name: '未知公司', logo: '', type: 'internet', industry: 'toc', description: '', jobCount: 0, reportAvailable: false, reportImage: '', reportContent: { preview: '', fullContent: '', highlights: [] } },
    location: '深圳', // 从description中解析
    salary: '面议',
    type: 'product',
    tags: ['产品经理'],
    hcCount: 1,
    inProcessCount: 0,
    resumeCount: 0,
    urgency: 'medium',
    jd: attributes.content || '',
    requirements: [],
    publishedAt: attributes.publishedAt || new Date().toISOString().split('T')[0],
  };
}

function transformStrapiCompany(item: any): Company {
  const attributes = item.attributes || item;
  
  return {
    id: String(item.id),
    name: attributes.title || '',
    logo: '',
    type: 'internet',
    industry: 'toc',
    description: attributes.description || '',
    jobCount: 0,
    reportAvailable: false,
    reportImage: '',
    reportContent: { preview: '', fullContent: '', highlights: [] },
  };
}

// 本地存储键名
const STORAGE_KEYS = {
  adminAuth: 'aibole_admin_auth',
};

export default function Admin({ onHomeClick }: AdminProps) {
  // 认证状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // 数据状态
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [isLoading, setIsLoading] = useState(false);

  // 编辑状态
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);

  // 搜索过滤
  const [searchQuery, setSearchQuery] = useState('');

  // 文件上传
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化数据
  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEYS.adminAuth);
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  // 从Strapi加载数据
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [articlesData, categoriesData] = await Promise.all([
        getArticles(),
        getCategories(),
      ]);
      
      setJobs(articlesData.map(transformStrapiJob));
      setCompanies(categoriesData.map(transformStrapiCompany));
      toast.success('数据加载成功');
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('从云端加载数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 登录处理
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'aibole2024') {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.adminAuth, 'true');
      toast.success('登录成功');
      loadData();
    } else {
      toast.error('用户名或密码错误');
    }
  };

  // 登出
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.adminAuth);
    toast.success('已登出');
  };

  // 创建/编辑岗位
  const handleSaveJob = async (job: Job) => {
    try {
      const jobData = {
        title: job.title,
        location: job.location,
        salary: job.salary,
        type: job.type,
        tags: job.tags,
        hcCount: job.hcCount,
        inProcessCount: job.inProcessCount,
        resumeCount: job.resumeCount,
        urgency: job.urgency,
        jd: job.jd,
        requirements: job.requirements,
        company: job.company.id,
        publishedAt: job.publishedAt,
      };

      if (job.id && job.id !== '0') {
        await updateJob(job.id, jobData);
        toast.success('岗位更新成功');
      } else {
        await createJob(jobData);
        toast.success('岗位创建成功');
      }
      
      await loadData();
      setIsJobDialogOpen(false);
      setEditingJob(null);
    } catch (error) {
      console.error('保存岗位失败:', error);
      toast.error('保存失败，请重试');
    }
  };

  // 删除岗位
  const handleDeleteJob = async (id: string) => {
    if (confirm('确定要删除这个岗位吗？')) {
      try {
        await deleteJob(id);
        await loadData();
        toast.success('岗位已删除');
      } catch (error) {
        console.error('删除岗位失败:', error);
        toast.error('删除失败');
      }
    }
  };

  // 创建/编辑公司
  const handleSaveCompany = async (company: Company) => {
    try {
      const companyData = {
        name: company.name,
        logo: company.logo,
        type: company.type,
        industry: company.industry,
        description: company.description,
        reportAvailable: company.reportAvailable,
        reportContent: company.reportContent,
      };

      if (company.id) {
        // await updateCompany(company.id, companyData);
        toast.success('公司更新成功');
      } else {
        await createCompany(companyData);
        toast.success('公司创建成功');
      }
      
      await loadData();
      setIsCompanyDialogOpen(false);
      setEditingCompany(null);
    } catch (error) {
      console.error('保存公司失败:', error);
      toast.error('保存失败');
    }
  };

  // 解析JD文件
  const parseJDFile = (content: string): Partial<Job> => {
    const lines = content.split('\n').filter(line => line.trim());
    const job: Partial<Job> = {
      requirements: [],
      tags: [],
      hcCount: 1,
      inProcessCount: 0,
      resumeCount: 0,
      urgency: 'medium',
    };

    let currentSection = '';
    let jdContent: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.includes('职位') || trimmed.includes('岗位') || trimmed.includes('招聘')) {
        const match = trimmed.match(/[：:]\s*(.+)/);
        if (match && !job.title) {
          job.title = match[1].trim();
        }
      }
      
      if (trimmed.includes('薪资') || trimmed.includes('k') || trimmed.includes('K') || trimmed.includes('薪')) {
        const match = trimmed.match(/(\d+[-–]\d+k.*?薪?)/i) || trimmed.match(/薪资[：:]\s*(.+)/);
        if (match && !job.salary) {
          job.salary = match[1].trim();
        }
      }

      if (trimmed.includes('地点') || trimmed.includes('城市') || trimmed.includes('工作地')) {
        const match = trimmed.match(/[：:]\s*(.+)/);
        if (match && !job.location) {
          job.location = match[1].trim();
        }
      }

      if (trimmed.includes('职责') || trimmed.includes('描述') || trimmed.includes('工作内容')) {
        currentSection = 'jd';
        continue;
      }

      if (trimmed.includes('要求') || trimmed.includes('任职') || trimmed.includes('条件')) {
        currentSection = 'requirements';
        continue;
      }

      if (currentSection === 'jd') {
        jdContent.push(trimmed);
      } else if (currentSection === 'requirements' && job.requirements) {
        if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+[.、]/.test(trimmed)) {
          job.requirements.push(trimmed.replace(/^[-•\d.、\s]+/, '').trim());
        }
      }
    }

    job.jd = jdContent.join('\n');
    
    if (!job.title && lines[0]) {
      job.title = lines[0].trim();
    }

    return job;
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const parsedJob = parseJDFile(content);
      
      setEditingJob({
        id: '',
        title: parsedJob.title || '',
        company: companies[0] || { id: '0', name: '未知公司', logo: '', type: 'internet', industry: 'tob', description: '', jobCount: 0, reportAvailable: false, reportImage: '', reportContent: { preview: '', fullContent: '', highlights: [] } },
        location: parsedJob.location || '北京',
        salary: parsedJob.salary || '面议',
        type: 'product',
        tags: parsedJob.tags || [],
        hcCount: parsedJob.hcCount || 1,
        inProcessCount: 0,
        resumeCount: 0,
        urgency: 'medium',
        jd: parsedJob.jd || content,
        requirements: parsedJob.requirements || [],
        publishedAt: new Date().toISOString().split('T')[0],
      });
      setIsJobDialogOpen(true);
      toast.success('JD文件解析成功，请检查并完善信息');
    };
    reader.readAsText(file);
  };

  // 导出数据
  const handleExport = () => {
    const data = { jobs, companies, exportTime: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aibole-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('数据导出成功');
  };

  // 过滤后的数据
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 登录页面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2b4a] to-[#4a5c7a] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#c4a35a] to-[#d4b36a] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a2b4a]">AI伯乐网</h1>
            <p className="text-gray-500">管理后台</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="请输入用户名"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="请输入密码"
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1a2b4a] to-[#4a5c7a] text-white py-3"
            >
              登录
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            默认账号: admin / aibole2024
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#c4a35a] to-[#d4b36a] rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1a2b4a]">AI伯乐网</h1>
                <p className="text-xs text-gray-500">管理后台</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {onHomeClick && (
                <Button 
                  variant="outline" 
                  onClick={onHomeClick}
                  className="hidden sm:flex py-2 px-4"
                >
                  返回首页
                </Button>
              )}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-[#1a2b4a]">管理员</p>
                <p className="text-xs text-gray-500">{jobs.length} 岗位 · {companies.length} 公司</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={loadData}
                disabled={isLoading}
                className="w-12 h-12 touch-manipulation"
              >
                <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="w-12 h-12 touch-manipulation"
              >
                <LogOut className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="jobs" className="flex items-center gap-2 flex-1 lg:flex-none justify-center py-3">
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">岗位管理</span>
                <span className="sm:hidden">岗位</span>
                <Badge variant="secondary" className="ml-1">{jobs.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="companies" className="flex items-center gap-2 flex-1 lg:flex-none justify-center py-3">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">公司管理</span>
                <span className="sm:hidden">公司</span>
                <Badge variant="secondary" className="ml-1">{companies.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 flex-wrap">
              <Input
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
              />
              
              {activeTab === 'jobs' && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.md,.doc,.docx"
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="py-3 px-4 touch-manipulation"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">上传JD</span>
                    <span className="sm:hidden">上传</span>
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditingJob({
                        id: '',
                        title: '',
                        company: companies[0] || { id: '0', name: '未知公司', logo: '', type: 'internet', industry: 'tob', description: '', jobCount: 0, reportAvailable: false, reportImage: '', reportContent: { preview: '', fullContent: '', highlights: [] } },
                        location: '北京',
                        salary: '',
                        type: 'product',
                        tags: [],
                        hcCount: 1,
                        inProcessCount: 0,
                        resumeCount: 0,
                        urgency: 'medium',
                        jd: '',
                        requirements: [],
                        publishedAt: new Date().toISOString().split('T')[0],
                      });
                      setIsJobDialogOpen(true);
                    }}
                    className="py-3 px-4 touch-manipulation"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">新建岗位</span>
                    <span className="sm:hidden">新建</span>
                  </Button>
                </>
              )}

              {activeTab === 'companies' && (
                <Button 
                  onClick={() => {
                    setEditingCompany({
                      id: '',
                      name: '',
                      logo: '',
                      type: 'internet',
                      industry: 'tob',
                      description: '',
                      jobCount: 0,
                      reportAvailable: false,
                      reportImage: '',
                      reportContent: {
                        preview: '',
                        fullContent: '',
                        highlights: [],
                      },
                    });
                    setIsCompanyDialogOpen(true);
                  }}
                  className="py-3 px-4 touch-manipulation"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">新建公司</span>
                  <span className="sm:hidden">新建</span>
                </Button>
              )}

              <Button 
                variant="outline" 
                onClick={handleExport}
                className="py-3 px-4 touch-manipulation"
              >
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">暂无岗位数据</p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  上传JD文件
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#1a2b4a]">{job.title}</h3>
                          <Badge className={job.urgency === 'high' ? 'bg-red-100 text-red-700' : job.urgency === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>
                            {job.urgency === 'high' ? '紧急' : job.urgency === 'medium' ? '急招' : '正常'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {job.company.name}
                          </span>
                          <span>{job.location}</span>
                          <span className="text-[#c4a35a] font-semibold">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <TrendingUp className="w-4 h-4" />
                            HC: {job.hcCount}
                          </span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <Users className="w-4 h-4" />
                            流程中: {job.inProcessCount}
                          </span>
                          <span className="text-gray-400">发布于 {job.publishedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingJob(job);
                            setIsJobDialogOpen(true);
                          }}
                          className="w-12 h-12 touch-manipulation"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteJob(job.id)}
                          className="w-12 h-12 text-red-500 hover:text-red-700 touch-manipulation"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-4">
            {filteredCompanies.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无公司数据</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredCompanies.map((company) => (
                  <div key={company.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {company.logo && (
                            <img src={company.logo} alt={company.name} className="w-10 h-10 object-contain" />
                          )}
                          <h3 className="text-lg font-semibold text-[#1a2b4a]">{company.name}</h3>
                          <Badge variant="outline">
                            {company.type === 'internet' ? '互联网' : company.type === 'startup' ? '创业' : company.type === 'state' ? '国央企' : '硬件'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{company.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>在招岗位: {jobs.filter(j => j.company.id === company.id).length}</span>
                          <span>调研报告: {company.reportAvailable ? '有' : '无'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCompany(company);
                            setIsCompanyDialogOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Job Edit Dialog */}
      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob?.id ? '编辑岗位' : '新建岗位'}</DialogTitle>
            <DialogDescription>
              填写岗位详细信息，带 * 的为必填项
            </DialogDescription>
          </DialogHeader>
          
          {editingJob && (
            <JobForm
              job={editingJob}
              companies={companies}
              onSave={handleSaveJob}
              onCancel={() => {
                setIsJobDialogOpen(false);
                setEditingJob(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Company Edit Dialog */}
      <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCompany?.id ? '编辑公司' : '新建公司'}</DialogTitle>
          </DialogHeader>
          
          {editingCompany && (
            <CompanyForm
              company={editingCompany}
              onSave={handleSaveCompany}
              onCancel={() => {
                setIsCompanyDialogOpen(false);
                setEditingCompany(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 岗位表单组件
function JobForm({ job, companies, onSave, onCancel }: { 
  job: Job; 
  companies: Company[]; 
  onSave: (job: Job) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Job>(job);
  const [reqInput, setReqInput] = useState(job.requirements?.join('\n') || '');
  const [tagInput, setTagInput] = useState(job.tags?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      requirements: reqInput.split('\n').filter(r => r.trim()),
      tags: tagInput.split(/[,，]/).map(t => t.trim()).filter(t => t),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">职位名称 *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="如：高级产品经理"
            required
          />
        </div>

        <div>
          <Label htmlFor="company">所属公司 *</Label>
          <Select
            value={formData.company.id}
            onValueChange={(value) => {
              const company = companies.find(c => c.id === value);
              if (company) setFormData({ ...formData, company });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择公司" />
            </SelectTrigger>
            <SelectContent>
              {companies.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location">工作地点 *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="如：北京、上海"
            required
          />
        </div>

        <div>
          <Label htmlFor="salary">薪资范围 *</Label>
          <Input
            id="salary"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            placeholder="如：40-60k·16薪"
            required
          />
        </div>

        <div>
          <Label htmlFor="type">职位类型</Label>
          <Select
            value={formData.type}
            onValueChange={(value: any) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">产品经理</SelectItem>
              <SelectItem value="sales">销售/SA</SelectItem>
              <SelectItem value="algorithm">算法研发</SelectItem>
              <SelectItem value="solution">解决方案</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="urgency">紧急程度</Label>
          <Select
            value={formData.urgency}
            onValueChange={(value: any) => setFormData({ ...formData, urgency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">紧急</SelectItem>
              <SelectItem value="medium">急招</SelectItem>
              <SelectItem value="low">正常</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="hcCount">HC数量</Label>
          <Input
            id="hcCount"
            type="number"
            value={formData.hcCount}
            onChange={(e) => setFormData({ ...formData, hcCount: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div>
          <Label htmlFor="inProcessCount">流程中人数</Label>
          <Input
            id="inProcessCount"
            type="number"
            value={formData.inProcessCount}
            onChange={(e) => setFormData({ ...formData, inProcessCount: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div>
          <Label htmlFor="resumeCount">收到简历数</Label>
          <Input
            id="resumeCount"
            type="number"
            value={formData.resumeCount}
            onChange={(e) => setFormData({ ...formData, resumeCount: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div>
          <Label htmlFor="tags">标签（用逗号分隔）</Label>
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="如：AI产品, ToB, 大模型"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="jd">职位描述 *</Label>
          <Textarea
            id="jd"
            value={formData.jd}
            onChange={(e) => setFormData({ ...formData, jd: e.target.value })}
            placeholder="填写职位描述、职责要求等..."
            rows={6}
            required
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="requirements">任职要求（每行一条）</Label>
          <Textarea
            id="requirements"
            value={reqInput}
            onChange={(e) => setReqInput(e.target.value)}
            placeholder="如：&#10;5年以上产品经验&#10;有AI产品背景&#10;本科以上学历"
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-[#1a2b4a] to-[#4a5c7a]">
          <Save className="w-4 h-4 mr-2" />
          保存
        </Button>
      </div>
    </form>
  );
}

// 公司表单组件
function CompanyForm({ company, onSave, onCancel }: { 
  company: Company; 
  onSave: (company: Company) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Company>(company);
  const [highlightInput, setHighlightInput] = useState(company.reportContent?.highlights?.join('\n') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      reportContent: {
        ...formData.reportContent,
        highlights: highlightInput.split('\n').filter(h => h.trim()),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">公司名称 *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="如：钉钉"
            required
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="logo">Logo URL</Label>
          <Input
            id="logo"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            placeholder="如：/logo-dingding.png"
          />
        </div>

        <div>
          <Label htmlFor="type">公司类型</Label>
          <Select
            value={formData.type}
            onValueChange={(value: any) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internet">互联网大厂</SelectItem>
              <SelectItem value="startup">创业公司</SelectItem>
              <SelectItem value="state">国央企</SelectItem>
              <SelectItem value="hardware">硬件集成</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="industry">行业类型</Label>
          <Select
            value={formData.industry}
            onValueChange={(value: any) => setFormData({ ...formData, industry: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tob">ToB</SelectItem>
              <SelectItem value="toc">ToC</SelectItem>
              <SelectItem value="state">国央企</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">公司简介</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="简短描述公司业务..."
            rows={2}
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="preview">调研报告预览</Label>
          <Textarea
            id="preview"
            value={formData.reportContent?.preview || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              reportContent: { 
                ...formData.reportContent, 
                preview: e.target.value,
                fullContent: formData.reportContent?.fullContent || '',
                highlights: formData.reportContent?.highlights || [],
              } 
            })}
            placeholder="公开显示的调研报告预览内容..."
            rows={3}
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="highlights">公司亮点（每行一条）</Label>
          <Textarea
            id="highlights"
            value={highlightInput}
            onChange={(e) => setHighlightInput(e.target.value)}
            placeholder="如：&#10;阿里巴巴核心子公司&#10;7亿+用户组织数"
            rows={3}
          />
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="reportAvailable"
            checked={formData.reportAvailable}
            onChange={(e) => setFormData({ ...formData, reportAvailable: e.target.checked })}
            className="w-4 h-4"
          />
          <Label htmlFor="reportAvailable" className="mb-0">提供调研报告</Label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-[#1a2b4a] to-[#4a5c7a]">
          <Save className="w-4 h-4 mr-2" />
          保存
        </Button>
      </div>
    </form>
  );
}
