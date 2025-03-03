
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
          (4, '星空', '梵高的夜景作品', 'https://placehold.co/400x400/000080/FFF?text=Starry+Night', 'https://example.com/videos/starry-night.mp4', 1, true),
          (5, '戴珍珠耳环的少女', '维米尔的杰作', 'https://placehold.co/400x400/8B4513/FFF?text=Girl+With+Pearl+Earring', NULL, 1, false),
          (6, '吻', '克林姆特的代表作', 'https://placehold.co/400x600/FFD700/000?text=The+Kiss', NULL, 1, false),
          (7, '创世纪', '米开朗基罗的天顶画', 'https://placehold.co/600x400/87CEEB/000?text=Creation+of+Adam', NULL, 1, false),
          (8, '星夜', '梵高的代表作品之一', 'https://placehold.co/400x600/000033/FFF?text=Starry+Night', 'https://example.com/videos/starry-night-analysis.mp4', 1, true),
          (9, '格尔尼卡', '毕加索的反战作品', 'https://placehold.co/800x400/333333/FFF?text=Guernica', NULL, 1, false),
          (10, '持金链人像', '伦勃朗的肖像画', 'https://placehold.co/400x500/8B4513/FFF?text=Man+with+Gold+Chain', NULL, 1, false),
          (11, '呐喊', '蒙克的表现主义作品', 'https://placehold.co/400x600/FF4500/FFF?text=The+Scream', NULL, 1, true),
          (12, '睡莲', '莫奈的印象派作品', 'https://placehold.co/500x400/7EC0EE/000?text=Water+Lilies', NULL, 1, false),
          (13, '最后的晚餐', '达芬奇的宗教题材作品', 'https://placehold.co/800x400/CD853F/FFF?text=Last+Supper', 'https://example.com/videos/last-supper-analysis.mp4', 1, true),
          (14, '向日葵系列', '梵高在阿尔勒时期创作的向日葵系列', 'https://placehold.co/400x600/FFD700/000?text=Sunflowers', 'https://example.com/videos/sunflowers-analysis.mp4', 1, true),
          (15, '大宫女', '委拉斯开兹的宫廷绘画', 'https://placehold.co/600x600/8B4513/FFF?text=Las+Meninas', NULL, 1, false),
          (16, '自由引导人民', '德拉克洛瓦的浪漫主义杰作', 'https://placehold.co/600x400/B22222/FFF?text=Liberty+Leading', NULL, 1, true),
          (17, '维纳斯的诞生', '波提切利的神话题材作品', 'https://placehold.co/600x400/87CEEB/000?text=Birth+of+Venus', NULL, 1, false),
          (18, '岩间圣母', '达芬奇的早期作品', 'https://placehold.co/400x500/8B4513/FFF?text=Madonna+of+Rocks', NULL, 1, false),
          (19, '雅典学院', '拉斐尔的壁画杰作', 'https://placehold.co/800x500/CD853F/FFF?text=School+of+Athens', 'https://example.com/videos/school-athens.mp4', 1, true),
          (20, '奥林匹亚', '马奈的写实主义作品', 'https://placehold.co/600x400/F5DEB3/000?text=Olympia', NULL, 1, false),
          (21, '罗马广场', '罗马古迹风光', 'https://placehold.co/600x400/DEB887/000?text=Roman+Forum', NULL, 2, false),
          (22, '巴黎埃菲尔铁塔', '巴黎地标建筑', 'https://placehold.co/400x600/87CEEB/000?text=Eiffel+Tower', NULL, 2, false),
          (23, '威尼斯水城', '威尼斯运河风光', 'https://placehold.co/600x400/00BFFF/FFF?text=Venice+Canal', 'https://example.com/videos/venice-tour.mp4', 2, true),
          (24, '伦敦塔桥', '伦敦著名桥梁', 'https://placehold.co/600x400/708090/FFF?text=Tower+Bridge', NULL, 2, false),
          (25, '巴塞罗那圣家堂', '高迪的建筑杰作', 'https://placehold.co/400x600/CD853F/FFF?text=Sagrada+Familia', NULL, 2, true)
        ON CONFLICT (id) DO NOTHING;
      `);
      
      console.log('测试数据创建成功');
    } else {
      console.log(`数据库中已存在 ${count} 个作品，检查是否需要补充缺失数据...`);
      
      // 检查特定ID的作品是否存在（如ID=8和ID=14），如果不存在则添加
      const missingIds = [4, 8, 14, 15];
      for (const id of missingIds) {
        const checkResult = await pool.query('SELECT COUNT(*) FROM artworks WHERE id = $1', [id]);
        const exists = parseInt(checkResult.rows[0].count) > 0;
        
        if (!exists) {
          console.log(`添加缺失的作品ID=${id}...`);
          
          // 根据ID添加特定作品
          if (id === 4) {
            await pool.query(`
              INSERT INTO artworks (id, title, description, image_url, video_url, category_id, is_premium)
              VALUES (4, '星空', '梵高的夜景作品', 'https://placehold.co/400x400/000080/FFF?text=Starry+Night', 'https://example.com/videos/starry-night.mp4', 1, true)
              ON CONFLICT (id) DO NOTHING;
            `);
          } else if (id === 8) {
            await pool.query(`
              INSERT INTO artworks (id, title, description, image_url, video_url, category_id, is_premium)
              VALUES (8, '星夜', '梵高的代表作品之一', 'https://placehold.co/400x600/000033/FFF?text=Starry+Night', 'https://example.com/videos/starry-night-analysis.mp4', 1, true)
              ON CONFLICT (id) DO NOTHING;
            `);
          } else if (id === 14) {
            await pool.query(`
              INSERT INTO artworks (id, title, description, image_url, video_url, category_id, is_premium)
              VALUES (14, '向日葵系列', '梵高在阿尔勒时期创作的向日葵系列', 'https://placehold.co/400x600/FFD700/000?text=Sunflowers', 'https://example.com/videos/sunflowers-analysis.mp4', 1, true)
              ON CONFLICT (id) DO NOTHING;
            `);
          } else if (id === 15) {
            await pool.query(`
              INSERT INTO artworks (id, title, description, image_url, video_url, category_id, is_premium)
              VALUES (15, '大宫女', '委拉斯开兹的宫廷绘画', 'https://placehold.co/600x600/8B4513/FFF?text=Las+Meninas', NULL, 1, false)
              ON CONFLICT (id) DO NOTHING;
            `);
          }
        }
      }
    }
    
    console.log('数据初始化成功');
  } catch (error) {
    console.error('创建测试数据失败:', error);
  }
}
