export async function getArtworks() {
  // 确保API返回的字段与数据库schema一致，所有字段使用蛇形命名法
  return apiRequest<Artwork[]>("/api/artworks");
}