// 检测服务器可能使用的多个端口
export const getApiUrl = () => {
  // 默认使用相对路径，这样会自动使用当前域名和端口
  return "/api";
};

export const API_URL = getApiUrl();

// 通用fetch函数，用于所有API请求
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include' // 包含cookies以支持认证
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  
  return response.json();
}

// 获取用户信息
export async function fetchUserInfo() {
  console.log("正在获取用户信息...");
  try {
    const response = await fetch("/api/user", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      if (response.status === 401) {
        console.log("用户未登录", response);
        return null;
      }
      throw new Error(`获取用户信息失败: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.log("用户未登录", error);
    return null;
  }
}