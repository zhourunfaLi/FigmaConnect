
/**
 * 网络请求工具函数
 */

// 基础API URL
const API_BASE = '/api';

// 基础请求函数
export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('/') 
    ? `${API_BASE}${endpoint}` 
    : `${API_BASE}/${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 包含cookies
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  // 检查HTTP状态
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `请求失败: ${response.status}`);
  }

  // 对于204 No Content，不需要解析JSON
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// GET请求
export function get<T = any>(endpoint: string) {
  return fetchApi<T>(endpoint);
}

// POST请求
export function post<T = any>(endpoint: string, data: any) {
  return fetchApi<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT请求
export function put<T = any>(endpoint: string, data: any) {
  return fetchApi<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE请求
export function del<T = any>(endpoint: string) {
  return fetchApi<T>(endpoint, {
    method: 'DELETE',
  });
}
