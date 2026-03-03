// =====================================================
// Supabase API 客户端
// 用于替代 Strapi API
// =====================================================

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';

// 简单的HTTP请求封装
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
  
  const data = await response.json();
  return data;
}

// ==================== 公司相关 API ====================

const CompanyAPI = {
  // 获取所有公司
  async getAll() {
    return supabaseRequest('companies?select=*&order=created_at.desc');
  },
  
  // 获取单个公司详情
  async getById(id) {
    return supabaseRequest(`companies?id=eq.${id}&select=*`).then(data => data[0]);
  },
  
  // 创建公司（管理员）
  async create(companyData) {
    return supabaseRequest('companies', {
      method: 'POST',
      body: JSON.stringify(companyData)
    });
  },
  
  // 更新公司（管理员）
  async update(id, companyData) {
    return supabaseRequest(`companies?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(companyData)
    });
  },
  
  // 删除公司（管理员）
  async delete(id) {
    return supabaseRequest(`companies?id=eq.${id}`, {
      method: 'DELETE'
    });
  }
};

// ==================== 岗位相关 API ====================

const JobAPI = {
  // 获取所有岗位（含公司信息）
  async getAll(filters = {}) {
    let query = 'jobs_with_company?select=*';
    
    // 添加过滤条件
    if (filters.company_id) {
      query += `&company_id=eq.${filters.company_id}`;
    }
    if (filters.location) {
      query += `&location=eq.${filters.location}`;
    }
    if (filters.job_type) {
      query += `&job_type=eq.${filters.job_type}`;
    }
    if (filters.urgency) {
      query += `&urgency=eq.${filters.urgency}`;
    }
    
    // 排序
    query += '&order=published_at.desc';
    
    return supabaseRequest(query);
  },
  
  // 获取单个岗位详情
  async getById(id) {
    const data = await supabaseRequest(`jobs_with_company?id=eq.${id}&select=*`);
    return data[0];
  },
  
  // 搜索岗位
  async search(keyword) {
    // 使用ilike进行模糊搜索
    const query = `jobs_with_company?or=(title.ilike.*${keyword}*,description.ilike.*${keyword}*,content.ilike.*${keyword}*)&select=*`;
    return supabaseRequest(query);
  },
  
  // 创建岗位（管理员）
  async create(jobData) {
    return supabaseRequest('jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  },
  
  // 更新岗位（管理员）
  async update(id, jobData) {
    return supabaseRequest(`jobs?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(jobData)
    });
  },
  
  // 删除岗位（管理员）
  async delete(id) {
    return supabaseRequest(`jobs?id=eq.${id}`, {
      method: 'DELETE'
    });
  },
  
  // 获取热门岗位统计
  async getHotJobs(limit = 10) {
    return supabaseRequest(`hot_jobs_stats?limit=${limit}`);
  }
};

// ==================== 分析追踪 API ====================

const AnalyticsAPI = {
  // 记录访客
  async trackVisitor(visitorData) {
    return supabaseRequest('visitors', {
      method: 'POST',
      body: JSON.stringify(visitorData)
    }).catch(() => {
      // 如果已存在，更新访问信息
      return supabaseRequest(`visitors?visitor_id=eq.${visitorData.visitor_id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          last_visit: new Date().toISOString(),
          visit_count: visitorData.visit_count
        })
      });
    });
  },
  
  // 记录页面浏览
  async trackPageView(data) {
    return supabaseRequest('page_views', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // 记录岗位浏览
  async trackJobView(data) {
    return supabaseRequest('job_views', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // 记录搜索
  async trackSearch(data) {
    return supabaseRequest('searches', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // 获取今日统计数据（管理员）
  async getTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const [visitors, pageViews, jobViews, topJobs] = await Promise.all([
      // 今日访客数
      supabaseRequest(`visitors?last_visit=gte.${today}T00:00:00&select=count`).then(r => r[0]?.count || 0),
      
      // 今日页面浏览
      supabaseRequest(`page_views?created_at=gte.${today}T00:00:00&select=count`).then(r => r[0]?.count || 0),
      
      // 今日岗位浏览
      supabaseRequest(`job_views?created_at=gte.${today}T00:00:00&select=count`).then(r => r[0]?.count || 0),
      
      // 热门岗位
      supabaseRequest('hot_jobs_stats?limit=5')
    ]);
    
    return { visitors, pageViews, jobViews, topJobs };
  }
};

// ==================== 管理员认证 API ====================

const AdminAPI = {
  // 登录验证
  async login(username, password) {
    // 实际项目中应该使用安全的认证方式
    // 这里简化处理，仅用于演示
    const admins = await supabaseRequest(`admins?username=eq.${username}&select=*`);
    if (admins.length === 0) return null;
    
    // 注意：实际应该使用bcrypt比较密码
    // 这里简化处理
    return admins[0];
  }
};

// 导出API
window.SupabaseAPI = {
  Company: CompanyAPI,
  Job: JobAPI,
  Analytics: AnalyticsAPI,
  Admin: AdminAPI
};
