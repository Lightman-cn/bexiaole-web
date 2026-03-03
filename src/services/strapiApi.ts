// Strapi API 服务（免费版适配）
// 使用 Category 代替 Company，Article 代替 Job

const API_BASE_URL = 'https://timely-memory-b60d73aa2c.strapiapp.com/api';
const API_TOKEN = 'b96eb1991e2b056416b616d51aa45e94ca84c23d7c9e2860f6ed2b8c5ca60868ef68a6023860745d6fe6d62c532b86dda3350977ed70f44fe751fab94cd74c13cce9ee1e708cf3e47a8f626823fb819e0e0bc24e7881d86d518e19992e6ddac8ae319e21d858d850bdb5607f8e8cd58ddbf4037fad75a6308b53e39759cdd2e6';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`,
};

// 获取Category列表（代替Company）
export async function getCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories?populate=*`, { headers });
    if (!response.ok) throw new Error('获取Category列表失败');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('获取Category列表失败:', error);
    return [];
  }
}

// 获取Article列表（代替Job）
export async function getArticles() {
  try {
    const response = await fetch(`${API_BASE_URL}/articles?populate=category&sort[0]=publishedAt:desc`, { headers });
    if (!response.ok) throw new Error('获取Article列表失败');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('获取Article列表失败:', error);
    return [];
  }
}

// 创建Category
export async function createCategory(categoryData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: categoryData }),
    });
    if (!response.ok) throw new Error('创建Category失败');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('创建Category失败:', error);
    throw error;
  }
}

// 创建Article
export async function createArticle(articleData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: articleData }),
    });
    if (!response.ok) throw new Error('创建Article失败');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('创建Article失败:', error);
    throw error;
  }
}

// 更新Article
export async function updateArticle(id: string, articleData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ data: articleData }),
    });
    if (!response.ok) throw new Error('更新Article失败');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('更新Article失败:', error);
    throw error;
  }
}

// 删除Article
export async function deleteArticle(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('删除Article失败');
    return true;
  } catch (error) {
    console.error('删除Article失败:', error);
    throw error;
  }
}

// 为了保持向后兼容，保留旧函数名
export const getCompanies = getCategories;
export const getJobs = getArticles;
export const createJob = createArticle;
export const updateJob = updateArticle;
export const deleteJob = deleteArticle;
export const createCompany = createCategory;
