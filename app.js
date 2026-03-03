const { useState, useEffect, createElement: h } = React;

// =====================================================
// 本地数据（备用，当API不可用时使用）
// =====================================================
const LOCAL_JOBS = [
  {
    id: '1',
    title: '元宝-LLM大模型推理工程师',
    company: { name: '腾讯元宝', logo: '/logo-yuanbao.png', type: 'internet', industry: 'toc' },
    location: '深圳',
    salary: '50-80k·16薪',
    tags: ['P9', '大模型', '推理优化'],
    hcCount: 2,
    inProcessCount: 0,
    urgency: 'high',
    jd: '【岗位职责】\n1. 负责元宝大模型推理性能优化\n2. 设计和实现高效的模型推理架构\n\n【任职要求】\n1. 计算机相关专业本科及以上学历\n2. 3年以上深度学习推理优化经验',
    publishedAt: '2024-02-22'
  },
  {
    id: '2',
    title: '元宝AI产品经理-功能策划方向',
    company: { name: '腾讯元宝', logo: '/logo-yuanbao.png', type: 'internet', industry: 'toc' },
    location: '深圳',
    salary: '40-60k·16薪',
    tags: ['P9', '产品经理', 'AI产品'],
    hcCount: 3,
    inProcessCount: 0,
    urgency: 'high',
    jd: '【岗位职责】\n1. 负责元宝AI产品功能策划\n2. 深入理解用户需求\n\n【任职要求】\n1. 本科及以上学历，3年以上产品经验',
    publishedAt: '2024-02-22'
  },
  {
    id: '3',
    title: '大模型策略产品经理（搜索）',
    company: { name: '腾讯元宝', logo: '/logo-yuanbao.png', type: 'internet', industry: 'toc' },
    location: '深圳',
    salary: '40-60k·16薪',
    tags: ['P9', '搜索', '策略'],
    hcCount: 2,
    inProcessCount: 0,
    urgency: 'high',
    jd: '【岗位职责】\n1. 负责大模型搜索策略产品\n2. 设计语义搜索、智能问答等功能',
    publishedAt: '2024-02-22'
  },
  {
    id: '4',
    title: '大模型评测产品经理',
    company: { name: '腾讯元宝', logo: '/logo-yuanbao.png', type: 'internet', industry: 'toc' },
    location: '北京',
    salary: '40-60k·16薪',
    tags: ['P9', '评测', 'AI'],
    hcCount: 1,
    inProcessCount: 0,
    urgency: 'medium',
    jd: '【岗位职责】\n1. 负责大模型评测体系建设\n2. 设计评测数据集和评测方法',
    publishedAt: '2024-02-22'
  },
  {
    id: '5',
    title: '大模型策略产品经理（社交对话）',
    company: { name: '腾讯元宝', logo: '/logo-yuanbao.png', type: 'internet', industry: 'toc' },
    location: '北京',
    salary: '40-60k·16薪',
    tags: ['P9', '社交', '对话'],
    hcCount: 2,
    inProcessCount: 0,
    urgency: 'high',
    jd: '【岗位职责】\n1. 负责大模型社交对话产品\n2. 设计角色扮演、情感对话等功能',
    publishedAt: '2024-02-22'
  },
  {
    id: '6',
    title: '出海BD',
    company: { name: '钉钉', logo: '/logo-dingding.png', type: 'internet', industry: 'tob' },
    location: '杭州',
    salary: '30-50k·16薪',
    tags: ['P8', '销售', '出海'],
    hcCount: 2,
    inProcessCount: 0,
    urgency: 'high',
    jd: '【岗位职责】\n1. 负责钉钉出海业务的大客户拓展\n2. 深入了解中国企业出海需求',
    publishedAt: '2024-02-22'
  }
];

// =====================================================
// Supabase 配置（可选，配置后可连接真实后端）
// =====================================================
const SUPABASE_URL = window.SUPABASE_CONFIG?.url || 'https://your-project.supabase.co';
const SUPABASE_KEY = window.SUPABASE_CONFIG?.key || 'your-anon-key';

// Supabase API 请求封装
async function supabaseRequest(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Supabase API error:', error);
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

// ==================== 分析追踪工具 ====================
const Analytics = {
  // 生成/获取访客ID
  getVisitorId() {
    let id = localStorage.getItem('aibole_visitor_id');
    if (!id) {
      id = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('aibole_visitor_id', id);
      localStorage.setItem('aibole_first_visit', new Date().toISOString());
    }
    return id;
  },

  // 检查是否新访客
  isNewVisitor() {
    return !localStorage.getItem('aibole_has_visited');
  },

  // 标记为回访用户
  markReturningVisitor() {
    localStorage.setItem('aibole_has_visited', 'true');
    const count = parseInt(localStorage.getItem('aibole_visit_count') || '0') + 1;
    localStorage.setItem('aibole_visit_count', count.toString());
    return count;
  },

  // 获取访问次数
  getVisitCount() {
    return parseInt(localStorage.getItem('aibole_visit_count') || '1');
  },

  // 追踪页面浏览
  trackPageView(pageName) {
    const isNew = this.isNewVisitor();
    const visitCount = this.getVisitCount();
    
    // 百度统计
    if (window._hmt) {
      _hmt.push(['_trackPageview', pageName]);
      _hmt.push(['_setCustomVar', 1, 'visitor_type', isNew ? 'new' : 'returning', 1]);
      _hmt.push(['_setCustomVar', 2, 'visit_count', visitCount.toString(), 1]);
    }
    
    // Microsoft Clarity
    if (window.clarity) {
      clarity('set', 'visitor_type', isNew ? 'new' : 'returning');
      clarity('set', 'visit_count', visitCount);
    }

    console.log('[Analytics] PageView:', pageName, { isNew, visitCount });
  },

  // 追踪岗位点击
  trackJobClick(jobId, jobTitle, company) {
    const data = { jobId, jobTitle, company };
    
    // 百度统计事件
    if (window._hmt) {
      _hmt.push(['_trackEvent', 'job', 'click', jobTitle, jobId]);
    }
    
    // Clarity自定义事件
    if (window.clarity) {
      clarity('event', 'job_click', data);
    }

    // 存储浏览历史
    this.addJobToHistory(jobId, jobTitle, company);
    
    console.log('[Analytics] JobClick:', data);
  },

  // 追踪岗位浏览时长
  trackJobViewDuration(jobId, jobTitle, duration) {
    // 只记录超过2秒的浏览
    if (duration < 2000) return;
    
    const data = { 
      jobId, 
      jobTitle, 
      duration_seconds: Math.round(duration / 1000) 
    };
    
    // 百度统计
    if (window._hmt) {
      _hmt.push(['_trackEvent', 'job', 'view_duration', jobTitle, Math.round(duration / 1000)]);
    }
    
    // Clarity
    if (window.clarity) {
      clarity('event', 'job_view_duration', data);
    }
    
    console.log('[Analytics] JobViewDuration:', data);
  },

  // 追踪搜索
  trackSearch(keyword) {
    if (window._hmt) {
      _hmt.push(['_trackEvent', 'search', 'submit', keyword]);
    }
    if (window.clarity) {
      clarity('event', 'search', { keyword });
    }
  },

  // 追踪按钮点击
  trackButtonClick(buttonName, extraData = {}) {
    if (window._hmt) {
      _hmt.push(['_trackEvent', 'button', 'click', buttonName]);
    }
    if (window.clarity) {
      clarity('event', 'button_click', { button: buttonName, ...extraData });
    }
  },

  // 添加岗位到浏览历史
  addJobToHistory(jobId, jobTitle, company) {
    let history = JSON.parse(localStorage.getItem('aibole_job_history') || '[]');
    history.unshift({
      jobId,
      jobTitle,
      company,
      timestamp: new Date().toISOString()
    });
    // 保留最近20条
    history = history.slice(0, 20);
    localStorage.setItem('aibole_job_history', JSON.stringify(history));
  },

  // 获取浏览历史
  getJobHistory() {
    return JSON.parse(localStorage.getItem('aibole_job_history') || '[]');
  },

  // 初始化
  init() {
    this.markReturningVisitor();
    this.trackPageView(window.location.pathname + window.location.hash);
    
    // 监听页面可见性变化（计算停留时间）
    this.setupVisibilityTracking();
  },

  // 页面可见性追踪
  setupVisibilityTracking() {
    let pageEnterTime = Date.now();
    
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const duration = Date.now() - pageEnterTime;
        // 记录页面停留时间
        if (window._hmt) {
          _hmt.push(['_trackEvent', 'page', 'dwell_time', '', Math.round(duration / 1000)]);
        }
      } else {
        pageEnterTime = Date.now();
      }
    });
  }
};

// 图标SVG
const icons = {
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2"/><path d="M6 8h12"/><path d="M6 16h12"/>',
  mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  trending: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  menu: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'
};

const Icon = ({ name, size = 24, className = '' }) => 
  h('svg', { 
    width: size, 
    height: size, 
    viewBox: '0 0 24 24', 
    fill: 'none', 
    stroke: 'currentColor', 
    strokeWidth: 2,
    className,
    dangerouslySetInnerHTML: { __html: icons[name] || '' }
  });

// 默认公司数据
const defaultCompanies = [
  {
    id: '1',
    name: '钉钉',
    logo: 'https://img.alicdn.com/imgextra/i4/O1CN01ZJps5B1z0XCV2J2hX_!!6000000006647-2-tps-200-200.png',
    type: 'internet',
    industry: 'tob',
    description: '阿里巴巴集团专为中国企业打造的免费沟通和协同的多端平台',
    jobCount: 0,
    reportAvailable: true,
    reportContent: {
      preview: '钉钉（DingTalk）是阿里巴巴集团专为中国企业打造的免费沟通和协同的多端平台。',
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
    reportContent: {
      preview: '腾讯元宝是腾讯基于自研混元大模型开发的AI助手，提供智能对话、内容创作、知识问答等服务。',
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
    reportContent: {
      preview: '瓴羊是阿里巴巴全资子公司，主营数据要素服务，提供Dataphin、Quick BI等数据产品。',
      highlights: ['阿里数据中台嫡系', '数据智能赛道领先', 'DaaS服务开创者', '服务5万+企业']
    }
  }
];

// 从Supabase获取数据
async function fetchJobsFromSupabase() {
  try {
    // 使用视图获取岗位+公司信息
    const jobs = await supabaseRequest('jobs_with_company?select=*&order=published_at.desc');
    console.log('Supabase jobs:', jobs);
    return jobs;
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return [];
  }
}

async function fetchCompaniesFromSupabase() {
  try {
    const companies = await supabaseRequest('companies?select=*');
    console.log('Supabase companies:', companies);
    return companies;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

// 转换Supabase岗位数据
function transformSupabaseJob(item) {
  console.log('Transforming Supabase item:', item);
  
  // Supabase数据已经是展平的结构
  const title = item.title || '';
  const description = item.description || '';
  const descParts = description.split(' ');
  const location = item.location || descParts[0] || '深圳';
  const level = item.tags?.[0] || '';
  
  const companyName = item.company_name || '腾讯元宝';
  const matchedCompany = defaultCompanies.find(c => c.name === companyName) || defaultCompanies[1];
  
  return {
    id: String(item.id),
    title: title,
    company: { 
      ...matchedCompany, 
      id: String(item.company_id || matchedCompany.id), 
      name: companyName 
    },
    location: location,
    salary: item.salary || '面议',
    type: item.job_type || 'product',
    tags: item.tags || (level ? [level, 'AI产品'] : ['AI产品']),
    hcCount: item.hc_count || 1,
    inProcessCount: item.in_process_count || 0,
    resumeCount: item.resume_count || 0,
    urgency: item.urgency || 'medium',
    jd: item.content || description,  // 使用content字段作为完整JD
    requirements: item.requirements || [],
    publishedAt: item.published_at || new Date().toISOString().split('T')[0],
  };
}

// 导航栏
function Navbar({ onContactClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return h('nav', { className: 'gradient-bg text-white sticky top-0 z-50' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'flex items-center justify-between h-16' },
        h('div', { className: 'flex items-center gap-3' },
          h('div', { className: 'w-10 h-10 gradient-gold rounded-lg flex items-center justify-center' },
            h(Icon, { name: 'briefcase' })
          ),
          h('div', null,
            h('h1', { className: 'text-xl font-bold' }, 'AI伯乐网'),
            h('p', { className: 'text-xs text-gray-300' }, '智能猎头招聘平台')
          )
        ),
        h('div', { className: 'hidden md:flex items-center gap-6' },
          h('a', { href: '#jobs', className: 'hover:text-yellow-300 transition' }, '热招职位'),
          h('a', { href: '#companies', className: 'hover:text-yellow-300 transition' }, '合作企业'),
          h('a', { href: '#research', className: 'hover:text-yellow-300 transition' }, '调研报告'),
          h('button', { 
            onClick: onContactClick,
            className: 'bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-4 py-2 rounded-lg font-medium transition'
          }, '联系我们')
        ),
        h('button', { 
          className: 'md:hidden p-2',
          onClick: () => setIsMenuOpen(!isMenuOpen)
        }, h(Icon, { name: isMenuOpen ? 'close' : 'menu' }))
      ),
      isMenuOpen && h('div', { className: 'md:hidden pb-4' },
        h('a', { href: '#jobs', className: 'block py-2 hover:text-yellow-300' }, '热招职位'),
        h('a', { href: '#companies', className: 'block py-2 hover:text-yellow-300' }, '合作企业'),
        h('a', { href: '#research', className: 'block py-2 hover:text-yellow-300' }, '调研报告'),
        h('button', { onClick: onContactClick, className: 'w-full text-left py-2 text-yellow-300' }, '联系我们')
      )
    )
  );
}

// Hero区域
function Hero({ onSearch }) {
  const [searchValue, setSearchValue] = useState('');
  
  return h('section', { className: 'gradient-bg text-white py-20' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'text-center max-w-3xl mx-auto' },
        h('h2', { className: 'text-4xl md:text-5xl font-bold mb-6' }, 'AI驱动的智能猎头平台'),
        h('p', { className: 'text-xl text-gray-300 mb-8' }, '专注AI赛道 · 精准匹配 · 高效交付'),
        h('div', { className: 'flex gap-2 max-w-xl mx-auto' },
          h('div', { className: 'flex-1 relative' },
            h('input', {
              type: 'text',
              placeholder: '搜索职位、公司、关键词...',
              value: searchValue,
              onChange: (e) => setSearchValue(e.target.value),
              className: 'w-full px-4 py-3 pl-10 rounded-lg text-gray-900'
            }),
            h('div', { className: 'absolute left-3 top-3.5 text-gray-400' },
              h(Icon, { name: 'search', size: 20 })
            )
          ),
          h('button', {
            onClick: () => onSearch && onSearch(searchValue),
            className: 'bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-6 py-3 rounded-lg font-medium'
          }, '搜索')
        )
      )
    )
  );
}

// 职位卡片 - 带浏览时长追踪
function JobCard({ job, onClick }) {
  const urgencyClass = job.urgency === 'high' ? 'bg-red-100 text-red-700' : 
                      job.urgency === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700';
  const urgencyText = job.urgency === 'high' ? '紧急' : job.urgency === 'medium' ? '急招' : '正常';
  
  const cardRef = React.useRef(null);
  const viewStartTime = React.useRef(null);
  
  // 使用Intersection Observer追踪浏览时长
  React.useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // 卡片50%可见时开始计时
          viewStartTime.current = Date.now();
          console.log(`[ViewTrack] 开始浏览: ${job.title}`);
        } else if (viewStartTime.current) {
          // 卡片离开视口时结束计时
          const duration = Date.now() - viewStartTime.current;
          Analytics.trackJobViewDuration(job.id, job.title, duration);
          viewStartTime.current = null;
        }
      });
    }, { threshold: [0, 0.5, 1] });
    
    observer.observe(card);
    
    return () => {
      // 组件卸载时，如果正在计时，发送数据
      if (viewStartTime.current) {
        const duration = Date.now() - viewStartTime.current;
        Analytics.trackJobViewDuration(job.id, job.title, duration);
      }
      observer.disconnect();
    };
  }, [job.id, job.title]);
  
  return h('div', { 
    ref: cardRef,
    className: 'bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer',
    onClick: () => onClick && onClick(job)
  },
    h('div', { className: 'flex items-start justify-between' },
      h('div', { className: 'flex-1' },
        h('div', { className: 'flex items-center gap-3 mb-2' },
          h('h3', { className: 'text-lg font-semibold text-gray-900' }, job.title),
          h('span', { className: `px-2 py-1 text-xs rounded ${urgencyClass}` }, urgencyText)
        ),
        h('div', { className: 'flex items-center gap-4 text-sm text-gray-500 mb-3' },
          h('span', { className: 'flex items-center gap-1' }, h(Icon, { name: 'building', size: 16 }), job.company.name),
          h('span', { className: 'flex items-center gap-1' }, h(Icon, { name: 'mapPin', size: 16 }), job.location),
          h('span', { className: 'text-yellow-600 font-semibold' }, job.salary)
        ),
        h('div', { className: 'flex items-center gap-4 text-sm' },
          h('span', { className: 'flex items-center gap-1 text-gray-600' }, h(Icon, { name: 'trending', size: 16 }), `HC: ${job.hcCount}`),
          h('span', { className: 'flex items-center gap-1 text-gray-600' }, h(Icon, { name: 'users', size: 16 }), `流程中: ${job.inProcessCount}`),
          h('span', { className: 'text-gray-400' }, `发布于 ${job.publishedAt}`)
        )
      ),
      h(Icon, { name: 'chevron' })
    )
  );
}

// 精选职位
function FeaturedJobs({ jobs, onJobClick }) {
  return h('section', { id: 'jobs', className: 'py-16 bg-gray-50' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'flex items-center justify-between mb-8' },
        h('div', null,
          h('h2', { className: 'text-3xl font-bold text-gray-900' }, '精选热招职位'),
          h('p', { className: 'text-gray-500 mt-1' }, `共 ${jobs.length} 个在招岗位`)
        ),
        h('a', { href: '#', className: 'text-blue-600 hover:text-blue-700 flex items-center gap-1' }, 
          '查看全部', h(Icon, { name: 'chevron', size: 16 }))
      ),
      h('div', { className: 'grid gap-4' },
        jobs.slice(0, 6).map(job => h(JobCard, { key: job.id, job, onClick: onJobClick }))
      )
    )
  );
}

// 公司卡片
function CompanyCard({ company, onClick }) {
  const typeText = company.type === 'internet' ? '互联网' : company.type === 'startup' ? '创业' : '国央企';
  
  return h('div', { 
    className: 'bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer',
    onClick: () => onClick && onClick(company)
  },
    h('div', { className: 'flex items-center gap-4 mb-4' },
      company.logo && h('img', { src: company.logo, alt: company.name, className: 'w-12 h-12 object-contain rounded-lg bg-gray-100' }),
      h('div', null,
        h('h3', { className: 'text-lg font-semibold text-gray-900' }, company.name),
        h('span', { className: 'text-xs px-2 py-1 bg-gray-100 rounded' }, typeText)
      )
    ),
    h('p', { className: 'text-gray-600 text-sm mb-4 line-clamp-2' }, company.description),
    h('div', { className: 'flex items-center justify-between text-sm' },
      h('span', { className: 'text-gray-500' }, `在招岗位: ${company.jobCount}`),
      company.reportAvailable && h('span', { className: 'text-yellow-600' }, '有调研报告')
    )
  );
}

// 公司展示
function Companies({ companies, onCompanyClick }) {
  return h('section', { id: 'companies', className: 'py-16 bg-white' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'flex items-center justify-between mb-8' },
        h('div', null,
          h('h2', { className: 'text-3xl font-bold text-gray-900' }, '合作企业'),
          h('p', { className: 'text-gray-500 mt-1' }, '深度调研 · 精准推荐')
        ),
        h('a', { href: '#', className: 'text-blue-600 hover:text-blue-700 flex items-center gap-1' },
          '查看全部', h(Icon, { name: 'chevron', size: 16 }))
      ),
      h('div', { className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' },
        companies.map(company => h(CompanyCard, { key: company.id, company, onClick: onCompanyClick }))
      )
    )
  );
}

// 调研报告
function Research() {
  return h('section', { id: 'research', className: 'py-16 gradient-bg text-white' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'text-center mb-12' },
        h('h2', { className: 'text-3xl font-bold mb-4' }, '企业深度调研报告'),
        h('p', { className: 'text-gray-300' }, '专业分析 · 独家洞察 · 助力决策')
      ),
      h('div', { className: 'grid md:grid-cols-3 gap-6' },
        defaultCompanies.map(company => 
          h('div', { key: company.id, className: 'bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/20 transition' },
            h('div', { className: 'flex items-center gap-3 mb-4' },
              company.logo && h('img', { src: company.logo, alt: company.name, className: 'w-10 h-10 object-contain rounded bg-white p-1' }),
              h('h3', { className: 'text-xl font-semibold' }, company.name)
            ),
            h('p', { className: 'text-gray-300 text-sm mb-4' }, company.reportContent.preview),
            h('div', { className: 'space-y-2 mb-4' },
              company.reportContent.highlights.map((highlight, i) => 
                h('div', { key: i, className: 'flex items-center gap-2 text-sm' },
                  h('span', { className: 'w-1.5 h-1.5 bg-yellow-400 rounded-full' }),
                  highlight
                )
              )
            ),
            h('button', { className: 'w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 rounded-lg font-medium transition' }, 
              '查看报告')
          )
        )
      )
    )
  );
}

// 页脚
function Footer() {
  return h('footer', { className: 'bg-gray-900 text-gray-400 py-12' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'grid md:grid-cols-4 gap-8 mb-8' },
        h('div', null,
          h('div', { className: 'flex items-center gap-2 mb-4' },
            h('div', { className: 'w-8 h-8 gradient-gold rounded flex items-center justify-center' }, h(Icon, { name: 'briefcase', size: 16 })),
            h('span', { className: 'text-white font-bold' }, 'AI伯乐网')
          ),
          h('p', { className: 'text-sm' }, '专注AI赛道的智能猎头平台')
        ),
        h('div', null,
          h('h4', { className: 'text-white font-semibold mb-4' }, '快速链接'),
          h('ul', { className: 'space-y-2 text-sm' },
            h('li', null, h('a', { href: '#jobs', className: 'hover:text-white' }, '热招职位')),
            h('li', null, h('a', { href: '#companies', className: 'hover:text-white' }, '合作企业')),
            h('li', null, h('a', { href: '#research', className: 'hover:text-white' }, '调研报告'))
          )
        ),
        h('div', null,
          h('h4', { className: 'text-white font-semibold mb-4' }, '联系我们'),
          h('ul', { className: 'space-y-2 text-sm' },
            h('li', { className: 'flex items-center gap-2' }, h(Icon, { name: 'phone', size: 16 }), '400-XXX-XXXX'),
            h('li', { className: 'flex items-center gap-2' }, h(Icon, { name: 'mail', size: 16 }), 'contact@aibole.com'),
            h('li', { className: 'flex items-center gap-2' }, h(Icon, { name: 'message', size: 16 }), '微信: aibole_hr')
          )
        ),
        h('div', null,
          h('h4', { className: 'text-white font-semibold mb-4' }, '订阅职位资讯'),
          h('div', { className: 'flex gap-2' },
            h('input', { type: 'email', placeholder: '输入邮箱', className: 'flex-1 px-3 py-2 bg-gray-800 rounded text-sm' }),
            h('button', { className: 'px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 rounded text-sm font-medium' }, '订阅')
          )
        )
      ),
      h('div', { className: 'border-t border-gray-800 pt-8 text-center text-sm' }, '© 2024 AI伯乐网. All rights reserved.')
    )
  );
}

// 职位详情弹窗
function JobModal({ job, onClose }) {
  if (!job) return null;
  
  return h('div', { 
    className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4',
    onClick: onClose
  },
    h('div', { 
      className: 'bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto',
      onClick: (e) => e.stopPropagation()
    },
      h('div', { className: 'p-6' },
        h('div', { className: 'flex items-start justify-between mb-4' },
          h('div', null,
            h('h2', { className: 'text-2xl font-bold text-gray-900' }, job.title),
            h('p', { className: 'text-gray-500 mt-1' }, job.company.name)
          ),
          h('button', { onClick: onClose, className: 'p-2 hover:bg-gray-100 rounded' }, h(Icon, { name: 'close' }))
        ),
        h('div', { className: 'flex items-center gap-4 text-sm text-gray-500 mb-6' },
          h('span', { className: 'flex items-center gap-1' }, h(Icon, { name: 'mapPin', size: 16 }), job.location),
          h('span', { className: 'text-yellow-600 font-semibold' }, job.salary)
        ),
        h('div', { className: 'mb-6' },
          h('h3', { className: 'font-semibold mb-2' }, '职位描述'),
          h('p', { className: 'text-gray-600 whitespace-pre-line' }, job.jd)
        ),
        h('button', { className: 'w-full py-3 gradient-gold text-white rounded-lg font-medium hover:opacity-90 transition' }, 
          '立即投递')
      )
    )
  );
}

// 主应用
function App() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState(defaultCompanies);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    // 初始化分析追踪
    Analytics.init();
    
    async function loadData() {
      console.log('Starting to load data...');
      setIsLoading(true);
      
      try {
        // 尝试从Supabase获取数据
        const jobsData = await fetchJobsFromSupabase();
        console.log('Fetched jobs from Supabase:', jobsData);
        
        if (jobsData && jobsData.length > 0) {
          const transformedJobs = jobsData.map(transformSupabaseJob);
          setJobs(transformedJobs);
          
          // 更新公司岗位数统计
          const updatedCompanies = defaultCompanies.map(company => ({
            ...company,
            jobCount: transformedJobs.filter(j => j.company.name === company.name).length
          }));
          setCompanies(updatedCompanies);
          console.log('使用Supabase数据');
        } else {
          throw new Error('No data from Supabase');
        }
      } catch (error) {
        console.log('Supabase加载失败，使用本地数据:', error);
        // 使用本地数据
        setJobs(LOCAL_JOBS);
        
        // 更新公司岗位数统计
        const updatedCompanies = defaultCompanies.map(company => ({
          ...company,
          jobCount: LOCAL_JOBS.filter(j => j.company.name === company.name).length
        }));
        setCompanies(updatedCompanies);
        console.log('使用本地数据，共', LOCAL_JOBS.length, '个岗位');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  const handleJobClick = (job) => {
    // 追踪岗位点击
    Analytics.trackJobClick(job.id, job.title, job.company.name);
    setSelectedJob(job);
  };
  
  const handleSearch = (keyword) => {
    Analytics.trackSearch(keyword);
    alert(`搜索: ${keyword}`);
  };
  
  const handleContactClick = () => {
    Analytics.trackButtonClick('contact_us');
    alert('联系我们: 400-XXX-XXXX | contact@aibole.com');
  };

  if (isLoading) {
    return h('div', { className: 'min-h-screen flex items-center justify-center' },
      h('div', { className: 'text-center' },
        h('div', { className: 'w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' }),
        h('p', { className: 'text-gray-600' }, '加载中...')
      )
    );
  }

  return h('div', { className: 'min-h-screen bg-gray-50' },
    h(Navbar, { onContactClick: handleContactClick }),
    h(Hero, { onSearch: handleSearch }),
    h(FeaturedJobs, { jobs, onJobClick: handleJobClick }),
    h(Companies, { companies, onCompanyClick: handleContactClick }),
    h(Research),
    h(Footer),
    selectedJob && h(JobModal, { job: selectedJob, onClose: () => setSelectedJob(null) })
  );
}

// 渲染
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));
