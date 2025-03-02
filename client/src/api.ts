import { apiRequest } from "./lib/queryClient";

export async function fetchArtwork(id: number): Promise<any> {
  if (!id || isNaN(Number(id))) {
    console.error(`无效的作品ID: ${id}`);
    throw new Error('无效的作品ID');
  }

  // 确保ID是数字类型
  const numericId = Number(id);
  console.log(`尝试获取作品，ID: ${numericId}`);

  try {
    const response = await fetch(`/api/artworks/${numericId}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('获取作品失败:', errorData);
      throw new Error(errorData.error || '获取作品失败');
    }

    const artwork = await response.json();
    console.log('成功获取作品数据:', artwork);
    return artwork;
  } catch (error) {
    console.error(`获取作品ID ${numericId} 时出错:`, error);
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