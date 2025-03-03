
import { pool } from "./db";

async function initTestData() {
  try {
    console.log("开始初始化测试数据...");
    
    // 创建分类数据
    await pool.query(`
      INSERT INTO categories (id, name, description, display_order)
      VALUES 
        (1, '油画', '油画作品集合', 1),
        (2, '水彩', '水彩画作品集合', 2),
        (3, '素描', '素描作品集合', 3),
        (4, '现代艺术', '现代艺术作品集合', 4),
        (5, '古典艺术', '古典艺术作品集合', 5)
      ON CONFLICT (id) DO NOTHING;
    `);
    
    // 创建测试作品
    await pool.query(`
      INSERT INTO artworks (id, title, description, image_url, video_url, category_id, is_premium, hide_title, display_order, column_position, aspect_ratio)
      VALUES 
        (1, '向日葵', '梵高的经典作品。这幅作品创作于1888年8月，是梵高著名的向日葵系列之一。梵高在法国阿尔勒的黄房子里创作了一系列向日葵绘画，这些作品展现了艺术家对色彩的大胆运用和强烈的表现力。', 'https://placehold.co/400x600/FFD700/000?text=Sunflowers', 'https://example.com/videos/sunflowers.mp4', 1, false, false, 1, 1, '2:3'),
        
        (2, '星空', '梵高的代表作。创作于1889年6月，是梵高在法国圣雷米精神病院期间所作。画中漩涡状的夜空和明亮的星星展现了艺术家独特的视角和内心世界。', 'https://placehold.co/400x400/000080/FFF?text=Starry+Night', 'https://example.com/videos/starry-night.mp4', 1, true, false, 2, 2, '1:1'),
        
        (3, '蒙娜丽莎', '达芬奇最著名的作品。创作于1503年至1519年间，这幅肖像画展现了达芬奇在解剖学、光学和地质学方面的深厚知识，其神秘的微笑吸引了数百年来无数观众的关注。', 'https://placehold.co/400x600/8B4513/FFF?text=Mona+Lisa', 'https://example.com/videos/mona-lisa.mp4', 5, false, false, 3, 1, '2:3'),
        
        (4, '戴珍珠耳环的少女', '维米尔的杰作。创作于1665年，这幅作品被誉为"荷兰的蒙娜丽莎"，少女转头看向观众的瞬间被永恒定格，珍珠耳环的光泽展现了维米尔精湛的光影处理技巧。', 'https://placehold.co/400x500/E6E6FA/000?text=Girl+With+Pearl+Earring', null, 5, true, false, 4, 3, '4:5'),
        
        (5, '格尔尼卡', '毕加索的反战杰作。创作于1937年，表现了西班牙内战中格尔尼卡镇被轰炸的惨状。黑白灰的色调和扭曲的形象展现了战争的恐怖和人类的痛苦。', 'https://placehold.co/600x400/333/FFF?text=Guernica', 'https://example.com/videos/guernica.mp4', 4, false, true, 5, 4, '3:2'),
        
        (6, '持镜的维纳斯', '提香的名作。创作于1555年，描绘了希腊神话中的爱神维纳斯与一面镜子。作品色彩华丽，肌肤表现细腻，展现了威尼斯画派的特点。', 'https://placehold.co/400x700/FFB6C1/000?text=Venus+with+Mirror', null, 5, true, false, 6, 1, '4:7'),
        
        (7, '睡莲', '莫奈的代表作之一。创作于1899年，是莫奈晚年在吉维尼花园创作的睡莲系列的一部分。作品捕捉了不同时间、不同光线下睡莲池塘的变化，展现了印象派对光影瞬息万变的追求。', 'https://placehold.co/500x400/7EC0EE/000?text=Water+Lilies', 'https://example.com/videos/water-lilies.mp4', 1, false, false, 7, 2, '5:4'),
        
        (8, '吻', '克林姆特的代表作。创作于1908年，是克林姆特黄金时期的作品。金色的装饰元素和华丽的图案展现了维也纳分离派的艺术风格。', 'https://placehold.co/400x600/FFD700/000?text=The+Kiss', 'https://example.com/videos/the-kiss.mp4', 4, true, false, 8, 3, '2:3'),
        
        (9, '呐喊', '蒙克的著名作品。创作于1893年，表现了人类内心的焦虑和绝望。扭曲的人物形象和鲜明的色彩对比反映了艺术家内心的情感世界。', 'https://placehold.co/400x500/FF4500/FFF?text=The+Scream', null, 4, false, true, 9, 4, '4:5'),
        
        (10, '最后的晚餐', '达芬奇的宗教题材杰作。创作于1495年至1498年间，描绘了耶稣与十二门徒共进最后晚餐的场景。作品在构图、透视和心理表现方面都达到了极高的水平。', 'https://placehold.co/700x400/FFF/000?text=The+Last+Supper', 'https://example.com/videos/last-supper.mp4', 5, true, false, 10, 1, '7:4'),
        
        (11, '雨中的巴黎街道', '卡耶博特的城市风景画。创作于1877年，描绘了改造后的巴黎街景和当时的城市生活。精确的透视和光影处理展现了艺术家对现代城市生活的关注。', 'https://placehold.co/500x400/708090/FFF?text=Paris+Street+Rainy+Day', null, 2, false, false, 11, 2, '5:4'),
        
        (12, '日出·印象', '莫奈的早期代表作。创作于1872年，描绘了勒阿弗尔港口的日出景象。这幅作品名字中的"印象"也成为了印象派艺术运动的命名来源。', 'https://placehold.co/600x400/B0C4DE/000?text=Impression+Sunrise', 'https://example.com/videos/impression-sunrise.mp4', 1, false, false, 12, 3, '3:2'),
        
        (13, '夜巡', '伦勃朗的集体肖像画杰作。创作于1642年，描绘了阿姆斯特丹市民守卫队。作品运用明暗对比的技法塑造了戏剧性的效果。', 'https://placehold.co/700x500/2F4F4F/FFF?text=The+Night+Watch', null, 5, true, false, 13, 4, '7:5'),
        
        (14, '向日葵系列', '梵高在阿尔勒时期创作的向日葵系列。这些作品是梵高艺术生涯中最著名的静物画，鲜艳的黄色花朵展现了艺术家对生命的热爱和对色彩的敏感。', 'https://placehold.co/400x600/FFD700/000?text=Sunflowers+Series', 'https://example.com/videos/sunflowers-series.mp4', 1, true, false, 14, 1, '2:3'),
        
        (15, '阿诺芬尼夫妇像', '扬·凡·艾克的双人肖像画。创作于1434年，是北方文艺复兴时期的代表作。作品细节丰富，象征意义深远，背景中的凸面镜更是展示了艺术家的技巧。', 'https://placehold.co/400x500/2E8B57/FFF?text=Arnolfini+Portrait', 'https://example.com/videos/arnolfini.mp4', 5, false, false, 15, 2, '4:5'),
        
        (16, '大碗岛的星期天下午', '修拉的点彩派代表作。创作于1884年至1886年间，描绘了巴黎人在塞纳河畔度假的景象。作品采用了科学的色彩理论和严谨的构图。', 'https://placehold.co/700x500/87CEEB/000?text=Sunday+Afternoon', null, 4, false, true, 16, 3, '7:5'),
        
        (17, '红色、蓝色、黄色的构成', '蒙德里安的抽象几何作品。创作于1930年，代表了蒙德里安"新造型主义"的成熟风格。作品仅使用三原色和黑白灰，通过水平和垂直线条分割画面。', 'https://placehold.co/500x500/FFF/000?text=Composition+with+Red+Blue+Yellow', 'https://example.com/videos/mondrian.mp4', 4, false, false, 17, 4, '1:1'),
        
        (18, '自由引导人民', '德拉克罗瓦的历史画。创作于1830年，描绘了法国七月革命的场景。画中手持三色旗的自由女神形象成为了自由和革命的象征。', 'https://placehold.co/600x500/CD5C5C/FFF?text=Liberty+Leading+the+People', null, 5, true, false, 18, 1, '6:5'),
        
        (19, '海上的印象', '透纳的风景画。创作于1844年，展现了艺术家对光和大气效果的卓越表现力。透纳的作品被认为是印象派的重要先驱。', 'https://placehold.co/500x400/F0F8FF/000?text=Impression+of+Sea', 'https://example.com/videos/turner-sea.mp4', 2, false, false, 19, 2, '5:4'),
        
        (20, '西斯廷教堂天顶画', '米开朗基罗的壁画杰作。创作于1508年至1512年间，描绘了《创世纪》中的多个场景。其中亚当创造的场景是西方艺术中最为人熟知的图像之一。', 'https://placehold.co/700x400/E6E6FA/000?text=Sistine+Chapel+Ceiling', 'https://example.com/videos/sistine-chapel.mp4', 5, true, false, 20, 3, '7:4')
      ON CONFLICT (id) DO NOTHING;
    `);
    
    // 创建测试用户
    await pool.query(`
      INSERT INTO users (id, username, password, is_premium)
      VALUES 
        (1, 'admin', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', true), -- 密码: secret42
        (2, 'alice', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', true),
        (3, 'bob', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', false)
      ON CONFLICT (id) DO NOTHING;
    `);

    // 创建测试评论
    await pool.query(`
      INSERT INTO comments (content, user_id, artwork_id, created_at)
      VALUES 
        ('这幅向日葵作品色彩非常明亮，让人感受到梵高对生命的热爱!', 2, 1, NOW() - INTERVAL '2 days'),
        ('梵高的用色大胆而富有表现力，这幅作品是他最好的静物画之一。', 3, 1, NOW() - INTERVAL '1 day'),
        ('星空的漩涡元素让我想起了宇宙中的星系，梵高的想象力令人惊叹。', 2, 2, NOW() - INTERVAL '3 days'),
        ('蒙娜丽莎的微笑始终是个谜，达芬奇真是天才。', 3, 3, NOW() - INTERVAL '5 days'),
        ('维米尔对光线的处理真是绝妙，那颗珍珠似乎在发光。', 2, 4, NOW() - INTERVAL '1 day'),
        ('毕加索用扭曲的形象表达战争的残酷，格尔尼卡永远是反战的象征。', 3, 5, NOW() - INTERVAL '4 days'),
        ('没想到这么经典的作品竟然是在战争期间创作的，更显珍贵。', 2, 14, NOW() - INTERVAL '3 days'),
        ('向日葵系列展现了梵高对生命的热情和对色彩的敏感。', 3, 14, NOW() - INTERVAL '2 days'),
        ('这是我见过解说最详细的艺术展示，对理解作品有很大帮助！', 2, 14, NOW() - INTERVAL '1 day')
      ON CONFLICT DO NOTHING;
    `);
    
    console.log("测试数据初始化成功");
  } catch (error) {
    console.error("初始化测试数据失败:", error);
    throw error;
  }
}

// 导出初始化函数以便可以在应用启动时调用
export default initTestData;
