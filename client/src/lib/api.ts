export async function apiRequest<T = any>(
  url: string, 
  method: string = 'GET', 
  data?: any
): Promise<T> {
  // 确保url是有效的字符串路径
  if (!url || typeof url !== 'string') {
    throw new Error(`Invalid API URL: ${url}`);
  }

  const options: RequestInit = {
    method, // 确保method是有效HTTP方法
    credentials: 'include', // 默认包含凭证
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    } catch {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  return response.json();
}

export async function getArtworks() {
  // 确保API返回的字段与数据库schema一致，所有字段使用蛇形命名法
  return apiRequest<Artwork[]>("/api/artworks");
}