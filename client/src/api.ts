import { apiRequest } from "./lib/queryClient";

export async function fetchArtwork(id: number): Promise<any> {
  if (!id || isNaN(id) || id <= 0) {
    console.error(`无效的作品ID: ${id}`);
    return null;
  }

  try {
    console.log(`尝试获取作品，ID: ${id}，类型: ${typeof id}`);
    // 确保ID是整数
    const artworkId = Math.floor(Number(id));
    const response = await fetch(`/api/artworks/${artworkId}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`作品不存在，ID: ${artworkId}`);
        return null;
      }
      throw new Error(`API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`成功获取到作品数据:`, data);
    return data;
  } catch (error) {
    console.error('作品获取过程中发生错误:', error);
    throw error;
  }
}

export async function fetchArtworks(category?: string) {
  const endpoint = category && category !== "latest" 
    ? `/api/artworks?category=${category}` 
    : `/api/artworks`;
  const response = await apiRequest("GET", endpoint, undefined);
  return await response.json();
}

export async function likeArtwork(id: string) {
  const response = await apiRequest("POST", `/api/artworks/${id}/like`, undefined);
  return await response.json();
}

// 获取作品详情
export async function getArtwork(id: number): Promise<Artwork | null> {
  if (!id || isNaN(id) || id <= 0) {
    console.error(`无效的作品ID: ${id}`);
    return null;
  }

  try {
    console.log(`尝试获取作品，ID: ${id}`);
    const response = await fetch(`/api/artworks/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`作品不存在，ID: ${id}`);
        return null;
      }
      throw new Error(`API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`成功获取作品数据:`, data);
    return data;
  } catch (error) {
    console.error('获取作品失败:', error);
    throw error;
  }
}