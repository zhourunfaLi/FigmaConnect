import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";
import { useLocation } from 'wouter'
import { CategoryNav } from '@/components/category-nav'

// Mock data including new city artwork
const mockArtworks = [
  // 艺术作品组
  {
    id: 1,
    title: "抽象光影",
    description: "现代艺术的光影交织",
    imageUrl: "/src/assets/design/img/art-01.jpg",
    likes: 1200,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 2,
    title: "自然韵律",
    description: "大自然的艺术演绎",
    imageUrl: "/src/assets/design/img/art-02.jpg",
    likes: 800,
    isPremium: false,
    themeId: "art"
  },
  {
    id: 3,
    title: "色彩交响",
    description: "抽象艺术的视觉盛宴",
    imageUrl: "/src/assets/design/img/art-03.jpg",
    likes: 600,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 4,
    title: "时空之门",
    description: "现代艺术装置作品",
    imageUrl: "/src/assets/design/img/art-04.jpg",
    likes: 950,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 5,
    title: "海洋之心",
    description: "海洋主题抽象画作",
    imageUrl: "/src/assets/design/img/art-05.jpg",
    likes: 850,
    isPremium: false,
    themeId: "art"
  },
  {
    id: 6,
    title: "光影旋律",
    description: "光与影的艺术对话",
    imageUrl: "/src/assets/design/img/art-06.jpg",
    likes: 750,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 7,
    title: "生命脉动",
    description: "生命力量的艺术表达",
    imageUrl: "/src/assets/design/img/art-07.jpg",
    likes: 920,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 8,
    title: "都市幻想",
    description: "城市艺术的想象",
    imageUrl: "/src/assets/design/img/art-08.jpg",
    likes: 880,
    isPremium: false,
    themeId: "art"
  },
  {
    id: 9,
    title: "山水意境",
    description: "东方艺术的精髓",
    imageUrl: "/src/assets/design/img/art-09.jpg",
    likes: 990,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 10,
    title: "现代几何",
    description: "几何艺术的探索",
    imageUrl: "/src/assets/design/img/art-10.jpg",
    likes: 760,
    isPremium: false,
    themeId: "art"
  },
  {
    id: 11,
    title: "音乐律动",
    description: "音乐的视觉呈现",
    imageUrl: "/src/assets/design/img/art-11.jpg",
    likes: 840,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 12,
    title: "科技未来",
    description: "未来主义艺术",
    imageUrl: "/src/assets/design/img/art-12.jpg",
    likes: 930,
    isPremium: false,
    themeId: "art"
  },
  {
    id: 13,
    title: "星空梦境",
    description: "宇宙的艺术诠释",
    imageUrl: "/src/assets/design/img/art-13.jpg",
    likes: 870,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 14,
    title: "水墨禅意",
    description: "传统与现代的融合",
    imageUrl: "/src/assets/design/img/art-14.jpg",
    likes: 910,
    isPremium: false,
    themeId: "art"
  },
  {
    id: 15,
    title: "城市记忆",
    description: "都市生活的艺术印记",
    imageUrl: "/src/assets/design/img/art-15.jpg",
    likes: 830,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 16,
    title: "自然之声",
    description: "大自然的艺术共鸣",
    imageUrl: "/src/assets/design/img/art-16.jpg",
    likes: 890,
    isPremium: false,
    themeId: "art"
  },
  {
    id: 17,
    title: "光影舞动",
    description: "光与影的艺术对话",
    imageUrl: "/src/assets/design/img/art-17.jpg",
    likes: 940,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 18,
    title: "抽象思维",
    description: "思维的视觉化呈现",
    imageUrl: "/src/assets/design/img/art-18.jpg",
    likes: 820,
    isPremium: false,
    themeId: "art"
  },
  {
    id: 19,
    title: "未来之门",
    description: "科技与艺术的碰撞",
    imageUrl: "/src/assets/design/img/art-19.jpg",
    likes: 960,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 20,
    title: "时空交错",
    description: "时间与空间的艺术演绎",
    imageUrl: "/src/assets/design/img/art-20.jpg",
    likes: 900,
    isPremium: false,
    themeId: "art"
  },
  // 城市作品组
  {
    id: 21,on: "现代都市的艺术解读",
    imageUrl: "/src/assets/design/img/art-08.jpg",
    likes: 880,
    isPremium: false,
    themeId: "art"
  },
  {
    id: 9,
    title: "自然之声",
    description: "大自然的声音艺术",
    imageUrl: "/src/assets/design/img/art-09.jpg",
    likes: 760,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 10,
    title: "时光碎片",
    description: "时间流逝的艺术印记",
    imageUrl: "/src/assets/design/img/art-10.jpg",
    likes: 890,
    isPremium: false,
    themeId: "art"
  },
  {
    id: 11,
    title: "威尼斯圣马可广场",
    description: "威尼斯最著名的地标",
    imageUrl: "/src/assets/design/img/city-01.jpg",
    likes: 1000,
    isPremium: false,
    themeId: "city",
    cityId: "venice"
  },
  {
    id: 12,
    title: "巴黎铁塔",
    description: "浪漫之都的象征",
    imageUrl: "/src/assets/design/img/city-02.jpg",
    likes: 1500,
    isPremium: false,
    themeId: "city",
    cityId: "paris"
  },
  {
    id: 13,
    title: "东京天际线",
    description: "现代都市的缩影",
    imageUrl: "/src/assets/design/img/city-03.jpg",
    likes: 1300,
    isPremium: true,
    themeId: "city",
    cityId: "tokyo"
  },
  {
    id: 14,
    title: "伦敦眼",
    description: "泰晤士河畔的明珠",
    imageUrl: "/src/assets/design/img/city-04.jpg",
    likes: 1100,
    isPremium: false,
    themeId: "city",
    cityId: "london"
  },
  {
    id: 15,
    title: "纽约中央公园",
    description: "城市中的绿洲",
    imageUrl: "/src/assets/design/img/city-05.jpg",
    likes: 1400,
    isPremium: true,
    themeId: "city",
    cityId: "newyork"
  },
  {
    id: 16,
    title: "罗马斗兽场",
    description: "永恒之城的见证",
    imageUrl: "/src/assets/design/img/city-06.jpg",
    likes: 1250,
    isPremium: false,
    themeId: "city",
    cityId: "rome"
  },
  {
    id: 17,
    title: "悉尼歌剧院",
    description: "南半球的艺术殿堂",
    imageUrl: "/src/assets/design/img/city-07.jpg",
    likes: 1150,
    isPremium: true,
    themeId: "city",
    cityId: "sydney"
  },
  {
    id: 18,
    title: "上海外滩",
    description: "东方明珠的风采",
    imageUrl: "/src/assets/design/img/city-08.jpg",
    likes: 1350,
    isPremium: false,
    themeId: "city",
    cityId: "shanghai"
  },
  {
    id: 19,
    title: "莫斯科红场",
    description: "俄罗斯的心脏",
    imageUrl: "/src/assets/design/img/city-09.jpg",
    likes: 1050,
    isPremium: true,
    themeId: "city",
    cityId: "moscow"
  },
  {
    id: 20,
    title: "迪拜塔",
    description: "沙漠中的奇迹",
    imageUrl: "/src/assets/design/img/city-10.jpg",
    likes: 1450,
    isPremium: false,
    themeId: "city",
    cityId: "dubai"
  }
];

type LayoutType = 'waterfall' | 'grid';

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  layout: LayoutType;
};

const CATEGORIES: Category[] = [
  { id: "latest", name: "最新", color: "#333333", layout: "waterfall" },
  { id: "hottest", name: "最热", color: "#333333", layout: "waterfall" },
  { id: "special", name: "专题", color: "#333333", layout: "grid" },
  { id: "member", name: "会员", color: "#EB9800", layout: "waterfall" },
  { id: "city", name: "城市", color: "#333333", layout: "grid" }
];

export default function HomePage() {
  const [location] = useLocation()
  const [activeCategory, setActiveCategory] = useState<Category["id"]>("latest");

  const filteredArtworks = useMemo(() => {
    let artworks = [...mockArtworks];

    // 先根据类别筛选
    switch (activeCategory) {
      case "special":
        artworks = artworks.filter(art => art.themeId);
        break;
      case "member":
        artworks = artworks.filter(art => art.isPremium);
        break;
      case "city":
        artworks = artworks.filter(art => art.cityId);
        break;
    }

    // 然后排序
    return artworks.sort((a, b) => {
      // 优先显示艺术作品
      if (a.themeId === "art" && b.themeId !== "art") return -1;
      if (a.themeId !== "art" && b.themeId === "art") return 1;
      // 根据类别排序
      if (activeCategory === "latest") return b.id - a.id;
      if (activeCategory === "hottest") return (b.likes || 0) - (a.likes || 0);
      // 默认按ID排序
      return a.id - b.id;
    });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#EEEAE2]">
      {/* Category Navigation */}
      <div className="sticky top-0 bg-[#EEEAE2] z-10 flex justify-center">
        <ScrollArea className="w-full max-w-screen-md">
          <div className="flex items-center justify-center gap-3 px-4 py-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={{ color: category.color }}
                className={`text-sm sm:text-base font-normal transition-colors px-4 py-1.5 whitespace-nowrap rounded-full ${
                  activeCategory === category.id ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Artwork Grid */}
      <div className="pt-4">
        <WorksList artworks={filteredArtworks} />
      </div>
    </div>
  );
}