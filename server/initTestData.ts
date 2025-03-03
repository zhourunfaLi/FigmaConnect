
import { pool } from './db';

/**
 * 初始化测试数据 - 确保数据库中存在基本测试数据
 */
export async function initTestData() {
  try {
    // 检查数据库中是否已存在作品
    const result = await pool.query('SELECT COUNT(*) FROM artworks');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      console.log('数据库中没有作品数据，正在创建测试数据...');
      
      // 创建一些测试类别
      await pool.query(`
        INSERT INTO categories (id, name, description, display_order)
        VALUES 
          (1, '艺术', '艺术类作品', 1),
          (2, '城市', '城市风景作品', 2)
        ON CONFLICT (id) DO NOTHING;
      `);
      
      // 创建测试作品
      await pool.query(`
        INSERT INTO artworks (id, title, description, image_url, video_url, category_id, is_premium)
        VALUES 
          (1, '向日葵', '梵高的经典作品', 'https://placehold.co/400x600', NULL, 1, false),
          (2, '蒙娜丽莎', '达芬奇的名作', 'https://placehold.co/600x800', NULL, 1, false), 
          (3, '巴黎风景', '巴黎城市风光摄影', 'https://placehold.co/800x600', NULL, 2, false),
          (4, '星空', '梵高的夜景作品', 'https://placehold.co/400x400', NULL, 1, true),
          (8, '星夜', '梵高的代表作品之一', 'https://placehold.co/400x600/000033/FFF?text=Starry+Night', 'https://example.com/videos/starry-night-analysis.mp4', 1, true),
          (14, '向日葵系列', '梵高在阿尔勒时期创作的向日葵系列', 'https://placehold.co/400x600/FFD700/000?text=Sunflowers', 'https://example.com/videos/sunflowers-analysis.mp4', 1, true),
          (20, '睡莲', '莫奈的经典作品', 'https://placehold.co/400x400/7EC0EE/000?text=Water+Lilies', NULL, 1, false)
        ON CONFLICT (id) DO NOTHING;
      `);
      
      console.log('测试数据创建成功');
    } else {
      console.log(`数据库中已存在 ${count} 个作品，跳过测试数据创建`);
    }
  } catch (error) {
    console.error('创建测试数据失败:', error);
  }
}
