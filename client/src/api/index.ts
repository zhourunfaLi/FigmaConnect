import type { Artwork } from "@shared/schema";
import { Work, User, Comment } from "@/types";

// Set API base URL
const API_BASE_URL = '/api';

/**
 * 通过ID获取作品详情
 * @param id 作品ID
 * @returns 作品详情
 */
export async function fetchArtworkById(id: number): Promise<Artwork> {
  try {
    console.log(`API调用：获取作品ID ${id} 的详情`);
    const response = await fetch(`${API_BASE_URL}/artworks/${id}`);

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
    const response = await fetch(`${API_BASE_URL}/artworks/${id}/related?limit=${limit}`);
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

// 获取作品列表
export async function fetchArtworks(params?: {
  category?: string;
  sort?: string;
  limit?: number;
}): Promise<Work[]> {
  try {
    let url = `${API_BASE_URL}/api/artworks`;
    
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch artworks');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }
}

// 获取单个作品详情
export async function fetchArtworkByIdString(id: string): Promise<Work | null> {
  try {
    if (!id) {
      console.warn("未提供作品ID");
      return null;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/artworks/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch artwork');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching artwork:", error);
    return null;
  }
}

// 获取相关作品
export async function fetchRelatedArtworksString(id: string, limit: number = 6): Promise<Work[]> {
  try {
    if (!id) {
      console.warn("未提供作品ID");
      return [];
    }
    
    const response = await fetch(`${API_BASE_URL}/api/artworks/${id}/related?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch related artworks');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching related artworks:", error);
    return [];
  }
}

// 获取用户信息
export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// 获取作品评论
export async function fetchArtworkComments(artworkId: string): Promise<Comment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/artworks/${artworkId}/comments`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// 点赞作品
export async function likeArtwork(artworkId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/artworks/${artworkId}/like`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to like artwork');
    }
    
    return true;
  } catch (error) {
    console.error("Error liking artwork:", error);
    return false;
  }
}

// 收藏作品
export async function favoriteArtwork(artworkId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/artworks/${artworkId}/favorite`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to favorite artwork');
    }
    
    return true;
  } catch (error) {
    console.error("Error favoriting artwork:", error);
    return false;
  }
}

// 发表评论
export async function postComment(artworkId: string, content: string): Promise<Comment | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/artworks/${artworkId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to post comment');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error posting comment:", error);
    return null;
  }
}