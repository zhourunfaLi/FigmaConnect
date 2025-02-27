export async function apiRequest(
  path: string, 
  method: string = 'GET', 
  data?: any
): Promise<any> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  // 确保路径以/开头
  const apiPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(apiPath, options);

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getArtworks() {
  // 确保API返回的字段与数据库schema一致，所有字段使用蛇形命名法
  return apiRequest<Artwork[]>("/api/artworks");
}