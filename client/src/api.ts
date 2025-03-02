
import { apiRequest } from "./lib/queryClient";
import { Artwork, Comment } from "@shared/schema";

export async function fetchArtworks(categoryId?: number): Promise<Artwork[]> {
  const queryParams = categoryId ? `?categoryId=${categoryId}` : '';
  const response = await apiRequest("GET", `/api/artworks${queryParams}`);
  return await response.json();
}

export async function fetchArtwork(id: number | string): Promise<Artwork> {
  const response = await apiRequest("GET", `/api/artworks/${id}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "获取艺术品失败");
  }
  return await response.json();
}

export async function fetchComments(artworkId: number): Promise<Comment[]> {
  const response = await apiRequest("GET", `/api/artworks/${artworkId}/comments`);
  return await response.json();
}

export async function postComment(artworkId: number, content: string): Promise<Comment> {
  const response = await apiRequest("POST", `/api/artworks/${artworkId}/comments`, { content });
  return await response.json();
}

export async function fetchCategories() {
  const response = await apiRequest("GET", "/api/categories");
  return await response.json();
}
