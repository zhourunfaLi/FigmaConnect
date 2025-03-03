
import { pool } from "./db";

async function initTestData() {
  try {
    console.log("开始初始化测试数据...");
    
    // 清理现有数据
    await cleanExistingData();
    
    // 创建分类数据
    await initCategories();
    
    // 创建测试作品
    await initArtworks();
    
    // 创建测试用户
    await initUsers();

    // 创建测试评论
    await initComments();
    
    console.log("测试数据初始化成功");
  } catch (error) {
    console.error("初始化测试数据失败:", error);
    throw error;
  }
}

async function cleanExistingData() {
  try {
    console.log("清理现有数据...");
    // 按照依赖关系顺序删除数据
    await pool.query("DELETE FROM comments");
    await pool.query("DELETE FROM artworks");
    await pool.query("DELETE FROM categories");
    await pool.query("DELETE FROM users WHERE username != 'admin'"); // 保留admin用户
    console.log("现有数据清理完成");
  } catch (error) {
    console.error("清理数据失败:", error);
    throw error;
  }
}

async function initCategories() {
  await pool.query(`
    INSERT INTO categories (id, name, description, display_order)
    VALUES 
      (1, '油画', '油画作品集合', 1),
      (2, '水彩', '水彩画作品集合', 2),
      (3, '素描', '素描作品集合', 3),
      (4, '现代艺术', '现代艺术作品集合', 4),
      (5, '古典艺术', '古典艺术作品集合', 5),
      (6, '印象派', '印象派艺术作品', 6),
      (7, '抽象艺术', '抽象艺术作品集合', 7),
      (8, '雕塑', '雕塑艺术作品', 8)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      display_order = EXCLUDED.display_order;
  `);
  console.log("分类数据初始化成功");
}

async function initArtworks() {
  await pool.query(`
    INSERT INTO artworks (id, title, description, image_url, video_url, category_id, is_premium, hide_title, display_order, column_position, aspect_ratio)
    VALUES 
      (1, '向日葵', '梵高的经典作品。这幅作品创作于1888年8月，是梵高著名的向日葵系列之一。梵高在法国阿尔勒的黄房子里创作了一系列向日葵绘画，这些作品展现了艺术家对色彩的大胆运用和强烈的表现力。', 'https://placehold.co/400x600/FFD700/000?text=Sunflowers', 'https://example.com/videos/sunflowers.mp4', 1, false, false, 1, 1, '2:3'),
      
      (2, '星空', '梵高的代表作。创作于1889年6月，是梵高在法国圣雷米精神病院期间所作。画中漩涡状的夜空和明亮的星星展现了艺术家独特的视角和内心世界。', 'https://placehold.co/400x400/000080/FFF?text=Starry+Night', 'https://example.com/videos/starry-night.mp4', 1, true, false, 2, 2, '1:1'),
      
      (3, '蒙娜丽莎', '达芬奇最著名的作品。创作于1503年至1519年间，这幅肖像画展现了达芬奇在解剖学、光学和地质学方面的深厚知识，其神秘的微笑吸引了数百年来无数观众的关注。', 'https://placehold.co/400x600/8B4513/FFF?text=Mona+Lisa', 'https://example.com/videos/mona-lisa.mp4', 5, false, false, 3, 1, '2:3'),
      
      (4, '戴珍珠耳环的少女', '维米尔的杰作。创作于1665年，这幅作品被誉为"荷兰的蒙娜丽莎"，少女转头看向观众的瞬间被永恒定格，珍珠耳环的光泽展现了维米尔精湛的光影处理技巧。', 'https://placehold.co/400x500/E6E6FA/000?text=Girl+With+Pearl+Earring', null, 5, true, false, 4, 3, '4:5'),
      
      (5, '格尔尼卡', '毕加索的反战杰作。创作于1937年，表现了西班牙内战中格尔尼卡镇被轰炸的惨状。黑白灰的色调和扭曲的形象展现了战争的恐怖和人类的痛苦。', 'https://placehold.co/600x400/333/FFF?text=Guernica', 'https://example.com/videos/guernica.mp4', 4, false, true, 5, 4, '3:2'),
      
      (6, '持镜的维纳斯', '提香的名作。创作于1555年，描绘了希腊神话中的爱神维纳斯与一面镜子。作品色彩华丽，肌肤表现细腻，展现了威尼斯画派的特点。', 'https://placehold.co/400x700/FFB6C1/000?text=Venus+with+Mirror', null, 5, true, false, 6, 1, '4:7'),
      
      (7, '睡莲', '莫奈的代表作之一。创作于1899年，是莫奈晚年在吉维尼花园创作的睡莲系列的一部分。作品捕捉了不同时间、不同光线下睡莲池塘的变化，展现了印象派对光影瞬息万变的追求。', 'https://placehold.co/500x400/7EC0EE/000?text=Water+Lilies', 'https://example.com/videos/water-lilies.mp4', 6, false, false, 7, 2, '5:4'),
      
      (8, '吻', '克林姆特的代表作。创作于1908年，是克林姆特黄金时期的作品。金色的装饰元素和华丽的图案展现了维也纳分离派的艺术风格。', 'https://placehold.co/400x600/FFD700/000?text=The+Kiss', 'https://example.com/videos/the-kiss.mp4', 4, true, false, 8, 3, '2:3'),
      
      (9, '呐喊', '蒙克的著名作品。创作于1893年，表现了人类内心的焦虑和绝望。扭曲的人物形象和鲜明的色彩对比反映了艺术家内心的情感世界。', 'https://placehold.co/400x500/FF4500/FFF?text=The+Scream', null, 4, false, true, 9, 4, '4:5'),
      
      (10, '最后的晚餐', '达芬奇的宗教题材杰作。创作于1495年至1498年间，描绘了耶稣与十二门徒共进最后晚餐的场景。作品在构图、透视和心理表现方面都达到了极高的水平。', 'https://placehold.co/700x400/FFF/000?text=The+Last+Supper', 'https://example.com/videos/last-supper.mp4', 5, true, false, 10, 1, '7:4'),
      
      (11, '雨中的巴黎街道', '卡耶博特的城市风景画。创作于1877年，描绘了改造后的巴黎街景和当时的城市生活。精确的透视和光影处理展现了艺术家对现代城市生活的关注。', 'https://placehold.co/500x400/708090/FFF?text=Paris+Street+Rainy+Day', null, 2, false, false, 11, 2, '5:4'),
      
      (12, '日出·印象', '莫奈的早期代表作。创作于1872年，描绘了勒阿弗尔港口的日出景象。这幅作品名字中的"印象"也成为了印象派艺术运动的命名来源。', 'https://placehold.co/600x400/B0C4DE/000?text=Impression+Sunrise', 'https://example.com/videos/impression-sunrise.mp4', 6, false, false, 12, 3, '3:2'),
      
      (13, '夜巡', '伦勃朗的集体肖像画杰作。创作于1642年，描绘了阿姆斯特丹市民守卫队。作品运用明暗对比的技法塑造了戏剧性的效果，也被视为荷兰黄金时代的象征之一。', 'https://placehold.co/700x500/2F4F4F/FFF?text=The+Night+Watch', null, 5, true, false, 13, 4, '7:5'),
      
      (14, '蒙娜丽莎的微笑', '达芬奇最著名作品《蒙娜丽莎》的特写版本，重点展示了那神秘的微笑。创作于1503年至1519年间，艺术家运用了独特的"烟雾"技法(sfumato)使得微笑显得若隐若现，成为艺术史上最具争议和魅力的表情之一。', 'https://placehold.co/400x400/8B4513/FFF?text=Mona+Lisa+Smile', 'https://example.com/videos/mona-lisa-detail.mp4', 5, true, false, 14, 1, '1:1'),
      
      (15, '思想者', '罗丹的著名雕塑作品。创作于1880年，原本是为罗丹的巨作"地狱之门"设计的一部分，后来成为独立的雕塑。这个深陷沉思的男性形象代表了人类的智慧和哲学思考。', 'https://placehold.co/400x600/A9A9A9/FFF?text=The+Thinker', 'https://example.com/videos/the-thinker.mp4', 8, false, false, 15, 2, '2:3'),
      
      (16, '大碗岛的星期天下午', '修拉的点彩派代表作。创作于1884年至1886年间，描绘了巴黎人在塞纳河畔度假的景象。作品采用了科学的色彩理论和严谨的构图，是新印象主义的重要里程碑。', 'https://placehold.co/700x500/87CEEB/000?text=Sunday+Afternoon', null, 6, false, true, 16, 3, '7:5'),
      
      (17, '红色、蓝色、黄色的构成', '蒙德里安的抽象几何作品。创作于1930年，代表了蒙德里安"新造型主义"的成熟风格。作品仅使用三原色和黑白灰，通过水平和垂直线条分割画面，影响了现代设计和建筑。', 'https://placehold.co/500x500/FFF/000?text=Composition+with+Red+Blue+Yellow', 'https://example.com/videos/mondrian.mp4', 7, false, false, 17, 4, '1:1'),
      
      (18, '自由引导人民', '德拉克罗瓦的历史画。创作于1830年，描绘了法国七月革命的场景。画中手持三色旗的自由女神形象成为了自由和革命的象征，对浪漫主义艺术产生了深远的影响。', 'https://placehold.co/600x500/CD5C5C/FFF?text=Liberty+Leading+the+People', null, 5, true, false, 18, 1, '6:5'),
      
      (19, '海上的印象', '透纳的风景画。创作于1844年，展现了艺术家对光和大气效果的卓越表现力。透纳的作品被认为是印象派的重要先驱，他将自然景观转化为充满戏剧性的光与色彩的交响。', 'https://placehold.co/500x400/F0F8FF/000?text=Impression+of+Sea', 'https://example.com/videos/turner-sea.mp4', 2, false, false, 19, 2, '5:4'),
      
      (20, '西斯廷教堂天顶画', '米开朗基罗的壁画杰作。创作于1508年至1512年间，描绘了《创世纪》中的多个场景。其中亚当创造的场景是西方艺术中最为人熟知的图像之一，天顶画整体被视为文艺复兴时期的巅峰之作。', 'https://placehold.co/700x400/E6E6FA/000?text=Sistine+Chapel+Ceiling', 'https://example.com/videos/sistine-chapel.mp4', 5, true, false, 20, 3, '7:4'),
      
      (21, '皮埃罗·德拉·弗朗切斯卡肖像', '拉斐尔的肖像画杰作。创作于1504年，描绘了意大利商人皮埃罗·德拉·弗朗切斯卡。拉斐尔的肖像画技法精湛，能够准确捕捉人物的性格和内在精神状态。', 'https://placehold.co/400x600/DEB887/000?text=Portrait+by+Raphael', null, 5, false, false, 21, 4, '2:3'),
      
      (22, '向日葵系列', '梵高在阿尔勒时期创作的向日葵系列作品的整体呈现。在1888-1889年间，梵高创作了多幅向日葵作品，以不同的构图和色调展现这一主题。这些作品是梵高艺术生涯中最著名的静物画，鲜艳的黄色花朵展现了艺术家对生命的热爱和对色彩的敏感。', 'https://placehold.co/400x600/FFD700/000?text=Sunflowers+Series', 'https://example.com/videos/sunflowers-series.mp4', 1, true, false, 22, 1, '2:3'),
      
      (23, '天气系列', '莫奈的系列作品。在1890年代，莫奈开始创作同一风景在不同天气和光线条件下的系列画作，如卢昂大教堂系列、干草堆系列等。这些作品突显了印象派对光与色彩瞬息变化的关注，也展示了莫奈对同一主题进行深入探索的艺术方法。', 'https://placehold.co/500x400/ADD8E6/000?text=Weather+Series', 'https://example.com/videos/monet-series.mp4', 6, false, true, 23, 2, '5:4'),
      
      (24, '阿诺芬尼夫妇像', '扬·凡·艾克的双人肖像画。创作于1434年，是北方文艺复兴时期的代表作。作品细节丰富，象征意义深远，背景中的凸面镜更是展示了艺术家的技巧，被视为早期油画的技术典范。', 'https://placehold.co/400x500/2E8B57/FFF?text=Arnolfini+Portrait', 'https://example.com/videos/arnolfini.mp4', 5, false, false, 24, 3, '4:5'),
      
      (25, '大浴女', '塞尚的代表作。创作于1898年至1905年间，是塞尚晚年探索形体结构和空间关系的重要作品。塞尚的创新技法和构成理念为立体主义等现代艺术流派奠定了基础，被称为"现代艺术之父"。', 'https://placehold.co/600x400/E0FFFF/000?text=The+Large+Bathers', null, 4, true, false, 25, 4, '3:2'),
      
      (26, '夜莺之歌', '惠斯勒的代表作。创作于1871年，是惠斯勒"夜曲"系列的一部分，体现了艺术家将音乐理念应用于绘画的创新。作品以柔和的色调和朦胧的气氛著称，代表了唯美主义艺术的典型风格。', 'https://placehold.co/500x600/4682B4/FFF?text=Nocturne', 'https://example.com/videos/whistler.mp4', 2, false, false, 26, 1, '5:6'),
      
      (27, '哈尔斯肖像画集', '弗朗斯·哈尔斯的肖像画集。17世纪荷兰黄金时代的杰出肖像画家，以捕捉瞬间表情和大胆的笔触著称。他的肖像画生动活泼，展现了各个社会阶层人物的性格和活力，技法上的创新对后世印象派产生了影响。', 'https://placehold.co/400x500/8FBC8F/000?text=Hals+Portraits', null, 5, true, false, 27, 2, '4:5'),
      
      (28, '死亡岛', '波克林的象征主义作品。创作于1880年代，描绘了一个神秘的岛屿和一艘载着棺材的小船。作品充满象征意义和超现实气氛，探讨了生死和永恒的主题，影响了后来的象征主义和超现实主义艺术。', 'https://placehold.co/600x400/696969/FFF?text=Isle+of+the+Dead', 'https://example.com/videos/bocklin.mp4', 4, false, true, 28, 3, '3:2'),
      
      (29, '贝斯通磨坊', '康斯太勃尔的风景画。创作于1821年，描绘了英国乡村的田园风光。康斯太勃尔以描绘英国乡村自然景观闻名，特别注重云层和光影的变化，其作品强调自然的真实性和情感共鸣。', 'https://placehold.co/500x400/556B2F/FFF?text=The+Hay+Wain', null, 2, false, false, 29, 4, '5:4'),
      
      (30, '大卫', '米开朗基罗的雕塑杰作。创作于1501年至1504年间，描绘了圣经人物大卫准备与巨人歌利亚战斗的一刻。这座大理石雕像高达5.17米，被视为文艺复兴时期对人体美与力量的完美表现，也成为了佛罗伦萨城市的象征。', 'https://placehold.co/400x800/DCDCDC/000?text=David+Sculpture', 'https://example.com/videos/david-360.mp4', 8, true, false, 30, 1, '1:2')
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      image_url = EXCLUDED.image_url,
      video_url = EXCLUDED.video_url,
      category_id = EXCLUDED.category_id,
      is_premium = EXCLUDED.is_premium,
      hide_title = EXCLUDED.hide_title,
      display_order = EXCLUDED.display_order,
      column_position = EXCLUDED.column_position,
      aspect_ratio = EXCLUDED.aspect_ratio;
  `);
  
  // 添加《蒙娜丽莎》的详细信息数据
  await pool.query(`
    UPDATE artworks 
    SET description = '《蒙娜丽莎》（Mona Lisa）是意大利文艺复兴时期画家列奥纳多·达·芬奇创作的油画，现收藏于法国卢浮宫博物馆。该画作主要表现了女性的典雅和恬静的典型形象，塑造了资本主义上升时期一位城市有产阶级的妇女形象。《蒙娜丽莎》代表了文艺复兴时期的美学方向；该作品折射出来的女性的深邃与高尚的思想品质，反映了文艺复兴时期人们对于女性美的审美理念和审美追求。
    每年到卢浮宫鉴赏《蒙娜丽莎》作品的人数，大约有600万左右。[2]1952年，德国发行首枚《蒙娜丽莎》邮票。[3]
    当地时间2024年1月28日，两名女性在法国巴黎卢浮宫博物馆向《蒙娜丽莎》泼洒灌装汤料，以表达对法国农业政策的不满，画作因在钢化玻璃罩内展出而未受损坏。'
    WHERE id = 3;
  `);
  
  console.log("作品数据初始化成功");
}

async function initUsers() {
  await pool.query(`
    INSERT INTO users (id, username, password, is_premium)
    VALUES 
      (1, 'admin', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', true), -- 密码: secret42
      (2, 'test', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', true), -- 密码: secret42
      (3, 'alice', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', true),
      (4, 'bob', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', false),
      (5, 'zhang_fan', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', true),
      (6, 'art_lover', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', false),
      (7, 'museum_guide', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', true),
      (8, 'history_buff', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', false)
    ON CONFLICT (id) DO UPDATE SET
      is_premium = EXCLUDED.is_premium;
  `);
  console.log("用户数据初始化成功");
}

async function initComments() {
  await pool.query(`
    INSERT INTO comments (content, user_id, artwork_id, created_at)
    VALUES 
      -- 向日葵的评论
      ('这幅向日葵作品色彩非常明亮，让人感受到梵高对生命的热爱!', 2, 1, NOW() - INTERVAL '2 days'),
      ('梵高的用色大胆而富有表现力，这幅作品是他最好的静物画之一。', 3, 1, NOW() - INTERVAL '1 day'),
      ('据说梵高创作这系列作品时，是为了装饰他等待高更到访的房间。', 4, 1, NOW() - INTERVAL '3 days'),
      ('向日葵象征着对阳光的追求，就像梵高自己对艺术的执着。', 5, 1, NOW() - INTERVAL '4 days'),
      
      -- 星空的评论
      ('星空的漩涡元素让我想起了宇宙中的星系，梵高的想象力令人惊叹。', 2, 2, NOW() - INTERVAL '3 days'),
      ('梵高创作这幅作品时正在精神病院中，从窗户看到的夜景启发了他。', 4, 2, NOW() - INTERVAL '2 days'),
      ('蓝色和黄色的对比使整个画面充满动感，仿佛星空真的在流动。', 6, 2, NOW() - INTERVAL '5 days'),
      ('这幅作品体现了梵高内心的感受，比客观现实更加重要。', 7, 2, NOW() - INTERVAL '1 day'),
      
      -- 蒙娜丽莎的评论
      ('蒙娜丽莎的微笑始终是个谜，达芬奇真是天才。', 3, 3, NOW() - INTERVAL '5 days'),
      ('有人说蒙娜丽莎其实是达芬奇自己的自画像，你们觉得可能吗？', 5, 3, NOW() - INTERVAL '4 days'),
      ('画中的背景风景也很值得研究，展示了达芬奇的地质学知识。', 6, 3, NOW() - INTERVAL '3 days'),
      ('最近去卢浮宫参观，人太多了，几乎看不清这幅画。', 7, 3, NOW() - INTERVAL '2 days'),
      ('达芬奇用烟雾技法(sfumato)处理轮廓，使得表情若隐若现，这是画作神秘感的来源之一。', 2, 3, NOW() - INTERVAL '1 day'),
      
      -- 戴珍珠耳环的少女的评论
      ('维米尔对光线的处理真是绝妙，那颗珍珠似乎在发光。', 2, 4, NOW() - INTERVAL '1 day'),
      ('这幅画也被称为"荷兰的蒙娜丽莎"，同样富有神秘感。', 3, 4, NOW() - INTERVAL '3 days'),
      ('少女回眸的一瞬被定格，眼神中有种说不出的情感。', 5, 4, NOW() - INTERVAL '2 days'),
      ('土耳其包头巾给整幅画增添了异域风情。', 7, 4, NOW() - INTERVAL '4 days'),
      
      -- 格尔尼卡的评论
      ('毕加索用扭曲的形象表达战争的残酷，格尔尼卡永远是反战的象征。', 3, 5, NOW() - INTERVAL '4 days'),
      ('画面中的牛、马、灯和哭泣的母亲都富有象征意义。', 4, 5, NOW() - INTERVAL '3 days'),
      ('毕加索拒绝解释这幅画的含义，让观众自己去理解和感受。', 6, 5, NOW() - INTERVAL '2 days'),
      ('黑白灰的配色增强了画面的悲剧感和新闻报道般的真实感。', 7, 5, NOW() - INTERVAL '1 day'),
      
      -- 向日葵系列的评论
      ('没想到这么经典的作品竟然是在战争期间创作的，更显珍贵。', 2, 22, NOW() - INTERVAL '3 days'),
      ('向日葵系列展现了梵高对生命的热情和对色彩的敏感。', 3, 22, NOW() - INTERVAL '2 days'),
      ('这是我见过解说最详细的艺术展示，对理解作品有很大帮助！', 2, 22, NOW() - INTERVAL '1 day'),
      ('梵高的向日葵系列共有几幅作品？每幅都有不同的构图和情感。', 5, 22, NOW() - INTERVAL '5 days'),
      ('阿姆斯特丹梵高博物馆和伦敦国家美术馆都收藏了这一系列的作品。', 6, 22, NOW() - INTERVAL '4 days'),
      
      -- 蒙娜丽莎的微笑的评论
      ('达芬奇用了特殊的技法使微笑若隐若现，这才是画作的魅力所在。', 3, 14, NOW() - INTERVAL '6 days'),
      ('据说从不同角度观看，微笑会有不同的感觉，真是神奇。', 4, 14, NOW() - INTERVAL '5 days'),
      ('这个特写版本让我们更能关注到表情的细节，非常有价值。', 5, 14, NOW() - INTERVAL '4 days'),
      ('达芬奇对人体解剖的研究也体现在对面部肌肉的精准把握上。', 6, 14, NOW() - INTERVAL '3 days'),
      ('微笑之谜可能永远不会被完全解开，这也是艺术的魅力。', 7, 14, NOW() - INTERVAL '2 days')
    ON CONFLICT DO NOTHING;
  `);
  
  console.log("评论数据初始化成功");
}

// 导出初始化函数以便可以在应用启动时调用
export default initTestData;
