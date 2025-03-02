
import type { Artwork } from "@shared/schema";

/**
 * 通过ID获取作品详情
 * @param id 作品ID
 * @returns 作品详情
 */
export async function fetchArtworkById(id: number): Promise<Artwork> {
  try {
    console.log(`API调用：获取作品ID ${id} 的详情`);
    const response = await fetch(`/api/artworks/${id}`);
    
    if (!response.ok) {
      throw new Error(`获取作品失败：${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("获取作品详情失败:", error);
    throw error;
  }
}

/**
 * 获取相关作品推荐
 * @param id 当前作品ID
 * @param limit 限制数量
 * @returns 相关作品数组
 */
export async function fetchRelatedArtworks(id: number, limit: number = 4): Promise<Artwork[]> {
  try {
    const response = await fetch(`/api/artworks/${id}/related?limit=${limit}`);
    if (!response.ok) {
      return []; // 如果API不存在，返回空数组
    }
    return await response.json();
  } catch (error) {
    console.warn("获取相关作品失败，使用模拟数据", error);
    // 返回空数组，让组件使用模拟数据
    return [];
  }
}
// API请求函数
const API_BASE_URL = '/api';

/**
 * 通过ID获取作品详情
 */
export async function fetchArtworkById(id: number) {
  try {
    console.log(`请求作品数据，ID: ${id}`);
    const response = await fetch(`${API_BASE_URL}/artworks/${id}`);
    
    if (!response.ok) {
      throw new Error(`API错误 ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取作品详情失败:', error);
    throw error;
  }
}

/**
 * 获取相关作品
 */
export async function fetchRelatedArtworks(artworkId: number, limit: number = 4) {
  try {
    const response = await fetch(`${API_BASE_URL}/artworks/related/${artworkId}?limit=${limit}`);
    
    if (!response.ok) {
      // 如果API不支持相关作品，返回空数组
      if (response.status === 404) {
        console.warn('相关作品API不可用，返回空数组');
        return [];
      }
      throw new Error(`API错误 ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取相关作品失败:', error);
    // 出错时返回空数组而不是抛出异常
    return [];
  }
}
