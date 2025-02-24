import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";
import { useLocation } from 'wouter'
import { CategoryNav } from '@/components/category-nav'

// Mock data including artworks and city photos
const mockArtworks = [
  // 艺术作品
  {
    id: 1,
    title: "静谧时光",
    description: "油画艺术展现的宁静午后",
    imageUrl: "/images/works-01.png",
    likes: 1200,
    isPremium: true,
    themeId: "art",
    artType: "painting"
  },
  {
    id: 2,
    title: "色彩交响",
    description: "现代艺术的色彩表达",
    imageUrl: "@/assets/design/img/works-02.png",
    likes: 980,
    isPremium: false,
    themeId: "art",
    artType: "modern"
  },
  {
    id: 3,
    title: "光影之舞",
    description: "光与影的艺术演绎",
    imageUrl: "@/assets/design/img/works-03.png",
    likes: 850,
    isPremium: true,
    themeId: "art",
    artType: "photography"
  },
  // 城市风光
  {
    id: 4,
    title: "威尼斯印象",
    description: "水城威尼斯的魅力时刻",
    imageUrl: "/images/city-01.jpg",
    likes: 1000,
    isPremium: false,
    themeId: "city",
    cityId: "venice"
  },
  {
    id: 2,
    title: "梵蒂冈圣彼得大教堂",
    description: "天主教的中心",
    imageUrl: "@/assets/design/img/city-02.jpg",
    likes: 800,
    isPremium: true,
    themeId: "city",
    cityId: "vatican"
  },
  {
    id: 3,
    title: "巴黎铁塔",
    description: "浪漫之都的象征",
    imageUrl: "@/assets/design/img/city-03.jpg",
    likes: 1200,
    isPremium: true,
    themeId: "city",
    cityId: "paris"
  },
  {
    id: 4,
    title: "罗马斗兽场",
    description: "古罗马文明的见证",
    imageUrl: "@/assets/design/img/city-04.jpg",
    likes: 950,
    isPremium: false,
    themeId: "city",
    cityId: "rome"
  },
  {
    id: 5,
    title: "劳特布鲁嫩峡谷",
    description: "瑞士阿尔卑斯山的明珠",
    imageUrl: "@/assets/design/img/city-05.jpg",
    likes: 750,
    isPremium: true,
    themeId: "city",
    cityId: "lauterbrunnen"
  },
  // Add more city images here...  (Assume more images exist in /src/assets/design/img/)
  {
    id: 6,
    title: "纽约时代广场",
    description: "繁华都市的中心",
    imageUrl: "@/assets/design/img/city-06.jpg", // Replace with actual image path
    likes: 1500,
    isPremium: false,
    themeId: "city",
    cityId: "newyork"
  },
  {
    id: 7,
    title: "东京涩谷十字路口",
    description: "世界著名的十字路口",
    imageUrl: "@/assets/design/img/city-07.jpg", // Replace with actual image path
    likes: 1100,
    isPremium: true,
    themeId: "art",
    artType: "sculpture"
  },
  {
    id: 5,
    title: "水墨东方",
    description: "传统东方艺术的现代诠释",
    imageUrl: "@/assets/design/img/works-04.png",
    likes: 920,
    isPremium: true,
    themeId: "art",
    artType: "traditional"
  },
  {
    id: 6,
    title: "抽象空间",
    description: "抽象艺术的空间构造",
    imageUrl: "@/assets/design/img/works-05.png",
    likes: 760,
    isPremium: false,
    themeId: "art",
    artType: "abstract"
  },
  // 更多城市风光
  {
    id: 7,
    title: "巴黎印象",
    description: "铁塔下的浪漫时光",
    imageUrl: "@/assets/design/img/city-02.jpg",
    likes: 1100,
    isPremium: true,
    themeId: "city",
    cityId: "paris"
  },
  {
    id: 8,
    title: "东京夜景",
    description: "繁华都市的璀璨夜色",
    imageUrl: "@/assets/design/img/city-03.jpg",
    likes: 950,
    isPremium: false,
    themeId: "city",
    cityId: "tokyo"
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