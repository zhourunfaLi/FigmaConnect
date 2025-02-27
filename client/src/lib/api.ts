// 检测服务器可能使用的多个端口
export const getApiUrl = () => {
  const host = window.location.host;
  // 如果URL中已经包含端口号，则使用那个端口
  if (host.includes(':')) {
    return "/api";
  }

  // 否则，根据当前protocol和host构建API_URL
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // 默认尝试不带端口的路径
  return "/api";
};

export const API_URL = getApiUrl();

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