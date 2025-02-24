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
  // 城市作品
  {
    id: 7,
    title: "威尼斯圣马可广场",
    description: "威尼斯最著名的地标",
    imageUrl: "/src/assets/design/img/city-01.jpg",
    likes: 1000,
    isPremium: false,
    themeId: "city",
    cityId: "venice"
  },
  {
    id: 8,
    title: "巴黎铁塔",
    description: "浪漫之都的象征",
    imageUrl: "/src/assets/design/img/city-02.jpg",
    likes: 1200,
    isPremium: true,
    themeId: "city",
    cityId: "paris"
  },
  {
    id: 9,
    title: "纽约时代广场",
    description: "繁华都市的中心",
    imageUrl: "/src/assets/design/img/city-06.jpg",
    likes: 1500,
    isPremium: false,
    themeId: "city",
    cityId: "newyork"
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
      case "hottest":
        return artworks.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case "earliest":
        return artworks.sort((a, b) => a.id - b.id);
      case "special":
        return mockArtworks.filter(art => art.themeId);
      case "member":
        return mockArtworks.filter(art => art.isPremium);
      case "city":
        return mockArtworks.filter(art => art.cityId);
      default:
        return mockArtworks;
    }
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