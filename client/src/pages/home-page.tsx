import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";
import { useLocation } from 'wouter'
import { CategoryNav } from '@/components/category-nav'

// Mock data including new city artwork
const mockArtworks = [
  {
    id: 1,
    title: "威尼斯圣马可广场",
    description: "威尼斯最著名的地标",
    imageUrl: "/src/assets/design/img/city-01.jpg",
    likes: 1000,
    isPremium: false,
    themeId: "city",
    cityId: "venice"
  },
  {
    id: 2,
    title: "梵蒂冈圣彼得大教堂",
    description: "天主教的中心",
    imageUrl: "/src/assets/design/img/city-02.jpg",
    likes: 800,
    isPremium: true,
    themeId: "city",
    cityId: "vatican"
  },
  {
    id: 3,
    title: "巴黎铁塔",
    description: "浪漫之都的象征",
    imageUrl: "/src/assets/design/img/city-03.jpg",
    likes: 1200,
    isPremium: true,
    themeId: "city",
    cityId: "paris"
  },
  {
    id: 4,
    title: "罗马斗兽场",
    description: "古罗马文明的见证",
    imageUrl: "/src/assets/design/img/city-04.jpg",
    likes: 950,
    isPremium: false,
    themeId: "city",
    cityId: "rome"
  },
  {
    id: 5,
    title: "劳特布鲁嫩峡谷",
    description: "瑞士阿尔卑斯山的明珠",
    imageUrl: "/src/assets/design/img/city-05.jpg",
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
    imageUrl: "/src/assets/design/img/city-06.jpg", // Replace with actual image path
    likes: 1500,
    isPremium: false,
    themeId: "city",
    cityId: "newyork"
  },
  {
    id: 7,
    title: "东京涩谷十字路口",
    description: "世界著名的十字路口",
    imageUrl: "/src/assets/design/img/city-07.jpg", // Replace with actual image path
    likes: 1100,
    isPremiupremium: true,
    themeId: "city",
    cityId: "tokyo"
  },
  {
    id: 30,
    title: "阿姆斯特丹运河",
    imageUrl: "/images/city-09.jpg",
    likes: 89,
    premium: true,
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