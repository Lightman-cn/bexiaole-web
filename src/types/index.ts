// 公司类型
export type CompanyType = 'internet' | 'startup' | 'state' | 'hardware';

// 行业类型
export type IndustryType = 'tob' | 'toc' | 'state';

// 职位类型
export type JobType = 'product' | 'sales' | 'algorithm' | 'solution';

// 公司信息
export interface Company {
  id: string;
  name: string;
  logo: string;
  type: CompanyType;
  industry: IndustryType;
  description: string;
  jobCount: number;
  reportAvailable: boolean;
  reportImage: string;
  reportContent: ReportContent;
}

// 调研报告内容
export interface ReportContent {
  preview: string;
  fullContent: string;
  highlights: string[];
}

// 职位信息
export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  salary: string;
  type: JobType;
  tags: string[];
  hcCount: number;
  inProcessCount: number;
  resumeCount: number;
  urgency: 'high' | 'medium' | 'low';
  jd: string;
  requirements: string[];
  publishedAt: string;
}

// 分类信息
export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  type: 'industry' | 'jobType' | 'companyType';
}

// 用户注册信息
export interface UserRegistration {
  wechat?: string;
  phone?: string;
  email?: string;
  name?: string;
}

// 统计数据
export interface Stats {
  jobCount: number;
  companyCount: number;
  resumeCount: number;
  satisfactionRate: number;
}
