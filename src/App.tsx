import { useState, useEffect, Suspense, lazy } from 'react';
import { toast } from 'sonner';
import type { Job, Company } from './types';
import './App.css';

// 懒加载 sections 组件
const Navbar = lazy(() => import('./sections/Navbar'));
const Hero = lazy(() => import('./sections/Hero'));
const JobCategories = lazy(() => import('./sections/JobCategories'));
const FeaturedJobs = lazy(() => import('./sections/FeaturedJobs'));
const Companies = lazy(() => import('./sections/Companies'));
const Research = lazy(() => import('./sections/Research'));
const BolingFeature = lazy(() => import('./sections/BolingFeature'));
const Stats = lazy(() => import('./sections/Stats'));
const Footer = lazy(() => import('./sections/Footer'));

// 懒加载 modal 组件
const JobDetailModal = lazy(() => import('./components/JobDetailModal'));
const CompanyDetailModal = lazy(() => import('./components/CompanyDetailModal'));
const RegisterModal = lazy(() => import('./components/RegisterModal'));

// 懒加载 Admin 页面
const Admin = lazy(() => import('./pages/Admin'));

// 懒加载服务
const { getJobs, getCompanies } = lazy(() => import('./services/strapiApi'));

// 本地存储键名（用于缓存）
const STORAGE_KEYS = {
  jobs: 'aibole_jobs',
  companies: 'aibole_companies',
  user: 'aibole_user',
};

// 默认公司数据
const defaultCompanies: Company[] = [
  {
    id: '1',
    name: '钉钉',
    logo: '/logo-dingding.png',
    type: 'internet',
    industry: 'tob',
    description: '阿里巴巴集团专为中国企业打造的免费沟通和协同的多端平台',
    jobCount: 0,
    reportAvailable: true,
    reportImage: '/report-dingding.jpg',
    reportContent: {
      preview: '钉钉（DingTalk）是阿里巴巴集团专为中国企业打造的免费沟通和协同的多端平台，提供即时通讯、协同办公、在线会议等服务。',
      fullContent: '',
      highlights: ['阿里巴巴核心子公司', '7亿+用户组织数', '企业数字化领导者', 'AI转型前沿阵地']
    }
  },
  {
    id: '2',
    name: '腾讯元宝',
    logo: '/logo-yuanbao.png',
    type: 'internet',
    industry: 'toc',
    description: '腾讯基于自研混元大模型开发的AI助手',
    jobCount: 0,
    reportAvailable: true,
    reportImage: '/report-yuanbao.jpg',
    reportContent: {
      preview: '腾讯元宝是腾讯基于自研混元大模型开发的AI助手，提供智能对话、内容创作、知识问答等服务。',
      fullContent: '',
      highlights: ['腾讯AI战略核心产品', '混元大模型技术支撑', 'C端AI赛道头部玩家', 'MAU突破2800万']
    }
  },
  {
    id: '3',
    name: '瓴羊',
    logo: '/logo-lingyang.png',
    type: 'internet',
    industry: 'tob',
    description: '阿里巴巴全资子公司，主营数据要素服务',
    jobCount: 0,
    reportAvailable: true,
    reportImage: '/report-lingyang.jpg',
    reportContent: {
      preview: '瓴羊是阿里巴巴全资子公司，主营数据要素服务，提供Dataphin、Quick BI等数据产品。',
      fullContent: '',
      highlights: ['阿里数据中台嫡系', '数据智能赛道领先', 'DaaS服务开创者', '服务5万+企业']
    }
  },
];

// 转换Strapi数据格式（免费版适配：Category->Company, Article->Job）
function transformStrapiJob(item: any): Job {
  const attributes = item.attributes || item;
  const categoryData = attributes.category?.data;
  
  const descParts = (attributes.description || '').split(' ');
  const location = descParts[0] || '深圳';
  const level = descParts[1] || '';
  
  const companyName = categoryData?.attributes?.title || '腾讯元宝';
  const matchedCompany = defaultCompanies.find(c => c.name === companyName) || defaultCompanies[1];
  
  return {
    id: String(item.id),
    title: attributes.title || '',
    company: {
      ...matchedCompany,
      id: String(categoryData?.id || matchedCompany.id),
      name: companyName,
    },
    location: location,
    salary: '面议',
    type: 'product',
    tags: level ? [level, 'AI产品'] : ['AI产品'],
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
  const companyName = attributes.title || '';
  const matchedCompany = defaultCompanies.find(c => c.name === companyName);
  
  return {
    id: String(item.id),
    name: companyName,
    logo: matchedCompany?.logo || '',
    type: matchedCompany?.type || 'internet',
    industry: matchedCompany?.industry || 'toc',
    description: attributes.description || matchedCompany?.description || '',
    jobCount: 0,
    reportAvailable: matchedCompany?.reportAvailable || false,
    reportImage: matchedCompany?.reportImage || '',
    reportContent: matchedCompany?.reportContent || { preview: '', fullContent: '', highlights: [] },
  };
}

// 加载骨架屏组件
function SectionSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-lg mx-4 mt-4"></div>
    </div>
  );
}

// 首页组件
function HomePage({ onAdminClick }: { onAdminClick: () => void }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerMode, setRegisterMode] = useState<'register' | 'download'>('register');
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name?: string; phone?: string; wechat?: string; email?: string } | null>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>(defaultCompanies);
  const [isLoading, setIsLoading] = useState(true);

  // 动态导入 API 服务
  const [apiModule, setApiModule] = useState<{ getJobs: () => Promise<any[]>; getCompanies: () => Promise<any[]> } | null>(null);

  useEffect(() => {
    import('./services/strapiApi').then(module => {
      setApiModule(module);
    });
  }, []);

  useEffect(() => {
    if (!apiModule) return;
    
    async function loadData() {
      setIsLoading(true);
      try {
        const [jobsData, companiesData] = await Promise.all([
          apiModule.getJobs(),
          apiModule.getCompanies(),
        ]);

        if (jobsData.length > 0) {
          setJobs(jobsData.map(transformStrapiJob));
        }
        
        if (companiesData.length > 0) {
          setCompanies(companiesData.map(transformStrapiCompany));
        } else {
          setCompanies(defaultCompanies);
        }

        localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(jobsData.length > 0 ? jobsData.map(transformStrapiJob) : []));
        localStorage.setItem(STORAGE_KEYS.companies, JSON.stringify(companiesData.length > 0 ? companiesData.map(transformStrapiCompany) : defaultCompanies));
      } catch (error) {
        console.error('加载数据失败:', error);
        toast.error('从云端加载数据失败，使用本地缓存');
        
        const savedJobs = localStorage.getItem(STORAGE_KEYS.jobs);
        const savedCompanies = localStorage.getItem(STORAGE_KEYS.companies);
        
        if (savedJobs) {
          setJobs(JSON.parse(savedJobs));
        }
        if (savedCompanies) {
          setCompanies(JSON.parse(savedCompanies));
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [apiModule]);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
      setIsRegistered(true);
    }
  }, []);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleSearch = (keyword: string) => {
    toast.info(`搜索: ${keyword}`, { description: '搜索功能将在完整版中开放' });
  };

  const handleCategoryClick = (categoryId: string) => {
    toast.info(`分类: ${categoryId}`, { description: '分类筛选功能将在完整版中开放' });
  };

  const handleViewAllJobs = () => {
    toast.info('查看全部职位', { description: '职位列表页将在完整版中开放' });
  };

  const handleViewAllCompanies = () => {
    toast.info('查看全部公司', { description: '公司列表页将在完整版中开放' });
  };

  const handleRegisterClick = () => {
    setRegisterMode('register');
    setIsRegisterModalOpen(true);
  };

  const handleDownloadReport = () => {
    if (!isRegistered) {
      setRegisterMode('download');
      setIsRegisterModalOpen(true);
    } else {
      toast.success('报告下载链接已发送到您的邮箱', {
        description: `报告将发送到: ${userInfo?.email || '您的邮箱'}`,
      });
    }
  };

  const handleRegister = (data: { name?: string; phone?: string; wechat?: string; email?: string }) => {
    setUserInfo(data);
    setIsRegistered(true);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data));
    
    if (registerMode === 'register') {
      toast.success('注册成功！', { description: '您现在可以查看完整调研报告了' });
    } else {
      toast.success('提交成功！', { description: `报告将发送到: ${data.email}` });
    }
  };

  const handleApplyJob = () => {
    if (!isRegistered) {
      setRegisterMode('register');
      setIsRegisterModalOpen(true);
    } else {
      toast.success('简历投递成功！', { description: '我们会尽快与您联系' });
    }
  };

  const handleContactClick = () => {
    toast.info('联系我们', { description: '电话: 400-XXX-XXXX | 邮箱: contact@aibole.com' });
  };

  const handleSubscribe = (email: string) => {
    toast.success('订阅成功！', { description: `职位资讯将发送到: ${email}` });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c4a35a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="fixed top-20 right-4 z-50">
        <button 
          onClick={onAdminClick}
          className="bg-[#1a2b4a] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#4a5c7a] transition-colors shadow-lg"
        >
          管理后台
        </button>
      </div>

      <Suspense fallback={<SectionSkeleton />}>
        <Navbar onContactClick={handleContactClick} />
      </Suspense>

      <main>
        <Suspense fallback={<SectionSkeleton />}>
          <Hero onSearch={handleSearch} />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <JobCategories onCategoryClick={handleCategoryClick} />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedJobs jobs={jobs} onJobClick={handleJobClick} onViewAll={handleViewAllJobs} />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <Companies companies={companies} onCompanyClick={handleCompanyClick} onViewAll={handleViewAllCompanies} />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <Research onRegisterClick={handleRegisterClick} />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <BolingFeature onApplyClick={handleContactClick} />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <Stats jobs={jobs} companies={companies} />
        </Suspense>
      </main>

      <Suspense fallback={<SectionSkeleton />}>
        <Footer onSubscribe={handleSubscribe} />
      </Suspense>

      <Suspense fallback={null}>
        <JobDetailModal job={selectedJob} isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} onApply={handleApplyJob} />
      </Suspense>
      
      <Suspense fallback={null}>
        <CompanyDetailModal company={selectedCompany} isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} onRegister={handleRegisterClick} isRegistered={isRegistered} onDownloadReport={handleDownloadReport} />
      </Suspense>
      
      <Suspense fallback={null}>
        <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onRegister={handleRegister} mode={registerMode} />
      </Suspense>
    </div>
  );
}

// 主应用组件
function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#admin') {
      setShowAdmin(true);
    }
  }, []);

  const handleAdminClick = () => {
    setShowAdmin(true);
    window.location.hash = 'admin';
  };

  const handleHomeClick = () => {
    setShowAdmin(false);
    window.location.hash = '';
  };

  if (showAdmin) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#c4a35a] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Admin onHomeClick={handleHomeClick} />
      </Suspense>
    );
  }

  return <HomePage onAdminClick={handleAdminClick} />;
}

export default App;