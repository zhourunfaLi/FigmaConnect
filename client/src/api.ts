
import { apiRequest } from "./lib/queryClient";

export async function fetchArtwork(id: string) {
  const response = await apiRequest("GET", `/api/artworks/${id}`, undefined);
  return await response.json();
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
