import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";
import { useLocation } from 'wouter'
import { CategoryNav } from '@/components/category-nav'

// Mock data including new city artwork
const mockArtworks = [
  // 艺术作品
  {
    id: 1,
    title: "抽象艺术作品",
    description: "现代艺术的探索",
    imageUrl: "/images/works-01.png", 
    likes: 1000,
    isPremium: true,
    themeId: "works"
  },
  {
    id: 2, 
    title: "彩色构图",
    description: "色彩的交响",
    imageUrl: "/images/works-02.png",
    likes: 800,
    isPremium: false,
    themeId: "works"
  },
  // 城市照片
  {
    id: 3,
    title: "威尼斯圣马可广场",
    description: "欧洲最美丽的客厅",
    imageUrl: "/images/city-01.jpg",
    likes: 1200,
    isPremium: true,
    themeId: "city",
    cityId: "venice"
  },
  {
    id: 4,
    title: "抽象艺术系列一号",
    description: "现代抽象艺术",
    imageUrl: "/images/works-03.png",
    likes: 1000,
    isPremium: false,
    themeId: "artwork"
  },
  {
    id: 5,
    title: "几何构图系列",
    description: "现代几何艺术",
    imageUrl: "/images/works-04.png",
    likes: 850,
    isPremium: true,
    themeId: "artwork"
  },
  {
    id: 6,
    title: "色彩研究",
    description: "色彩艺术探索",
    imageUrl: "/images/works-05.png",
    likes: 920,
    isPremium: false,
    themeId: "artwork"
  },
  {
    id: 7,
    title: "空间构成",
    description: "空间艺术设计",
    imageUrl: "/images/works-06.png",
    likes: 880,
    isPremium: true,
    themeId: "artwork"
  },
  {
    id: 8,
    title: "光影交错",
    description: "光影艺术创作",
    imageUrl: "/images/works-07.png",
    likes: 760,
    isPremium: false,
    themeId: "artwork"
  },
  {
    id: 9,
    title: "动态平衡",
    description: "平衡艺术研究",
    imageUrl: "/images/works-08.png",
    likes: 890,
    isPremium: true,
    themeId: "artwork"
  },
  {
    id: 10,
    title: "梵蒂冈圣彼得大教堂",
    description: "天主教的中心",
    imageUrl: "/images/city-02.jpg",
    likes: 800,
    isPremium: true,
    themeId: "city",
    cityId: "vatican"
  },
  {
    id: 11,
    title: "巴黎铁塔",
    description: "浪漫之都的象征",
    imageUrl: "/images/city-03.jpg",
    likes: 1200,
    isPremium: true,
    themeId: "city",
    cityId: "paris"
  },
  {
    id: 12,
    title: "罗马斗兽场",
    description: "古罗马文明的见证",
    imageUrl: "/images/city-04.jpg",
    likes: 950,
    isPremium: false,
    themeId: "city",
    cityId: "rome"
  },
  {
    id: 13,
    title: "劳特布鲁嫩峡谷",
    description: "瑞士阿尔卑斯山的明珠",
    imageUrl: "/images/city-05.jpg",
    likes: 750,
    isPremium: true,
    themeId: "city",
    cityId: "lauterbrunnen"
  },
  // Add more city images here...  (Assume more images exist in /src/assets/design/img/)
  {
    id: 14,
    title: "纽约时代广场",
    description: "繁华都市的中心",
    imageUrl: "/images/city-06.jpg", 
    likes: 1500,
    isPremium: false,
    themeId: "city",
    cityId: "newyork"
  },
  {
    id: 15,
    title: "东京涩谷十字路口",
    description: "世界著名的十字路口",
    imageUrl: "/images/city-07.jpg", 
    likes: 1100,
    isPremium: true,
    themeId: "city",
    cityId: "tokyo"
  },
  {
    id: 16,
    title: "阿姆斯特丹运河",
    imageUrl: "/images/city-09.jpg",
    likes: 89,
    isPremium: true,
    themeId: "city",
    cityId: "amsterdam"
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
  { id: "artwork", name: "艺术", color: "#333333", layout: "waterfall" },
  { id: "city", name: "城市", color: "#333333", layout: "grid" },
  { id: "member", name: "会员", color: "#EB9800", layout: "waterfall" }
];

export default function HomePage() {
  const [location] = useLocation()
  const [activeCategory, setActiveCategory] = useState<Category["id"]>("latest");

  const filteredArtworks = useMemo(() => {
    switch (activeCategory) {
      case "latest":
        return [...mockArtworks].sort((a, b) => b.id - a.id);
      case "hottest":
        return [...mockArtworks].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case "earliest":
        return [...mockArtworks].sort((a, b) => a.id - b.id);
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