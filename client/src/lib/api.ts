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