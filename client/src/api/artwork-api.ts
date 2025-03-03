

  export const importFrontendArtworks = async (artworksData: any[]): Promise<{ success: boolean; message: string; count: number }> => {
    try {
      const response = await api.post('/api/import-frontend-artworks', { artworks: artworksData });
      return response.data;
    } catch (error) {
      throw new Error('无法导入前端作品数据');
    }
  };
