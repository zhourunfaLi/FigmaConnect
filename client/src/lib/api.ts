
// 确保API基础URL设置正确
const API_BASE_URL = '';  // 空字符串表示使用相对路径，这在Replit环境中通常有效

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API请求失败');
  }
  
  return response.json();
}
