import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";
import { useLocation } from 'wouter'
import { CategoryNav } from '@/components/category-nav'
import GridList from '@/components/grid-list'

// Mock data including new city artwork
const mockArtworks = Array.from({ length: 30 }, (_, index) => {
  // 每5个作品中只有1个是城市作品
  const isCity = index % 5 === 0;
  const cityIndex = Math.floor(index / 5); // 确保城市图片按顺序使用
  const artIndex = index - Math.floor(index / 5); // 艺术作品索引

  return {
    id: index + 1,
    title: isCity ? `城市风光 ${cityIndex + 1}` : `艺术作品 ${artIndex + 1}`,
    description: isCity ? "城市建筑与人文景观" : "现代艺术创作",
    imageUrl: isCity 
      ? `/src/assets/design/img/city-${String((cityIndex % 7) + 1).padStart(2, '0')}.jpg`
      : `/src/assets/design/img/art-${String((artIndex % 30) + 1).padStart(2, '0')}.jpg`,
    likes: Math.floor(Math.random() * 2000),
    isPremium: Math.random() > 0.7,
    themeId: isCity ? "city" : "art",
    ...(isCity && { cityId: ["venice", "paris", "rome", "newyork", "tokyo"][cityIndex % 5] })
  };
});

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
  { id: "member", name: "会员", color: "#EB9800", layout: "waterfall" }, // Swapped position
  { id: "special", name: "专题", color: "#333333", layout: "grid" },  // Swapped position
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
        const themes = [
          {
            id: "louvre",
            title: "卢浮宫系列传世作品",
            artworks: mockArtworks.slice(0, 6).map(art => ({...art, themeId: "louvre"}))
          },
          {
            id: "davinci",
            title: "达芬奇真迹系列",
            artworks: mockArtworks.slice(6, 14).map(art => ({...art, themeId: "davinci"}))
          },
          {
            id: "chinese",
            title: "中国十大传世名画",
            artworks: mockArtworks.slice(14, 24).map(art => ({...art, themeId: "chinese"}))
          }
        ];
        return themes;
      case "member":
        return mockArtworks.filter(art => art.isPremium);
      case "city":
        return [
          { id: 1, title: "威尼斯", cityId: "venice" },
          { id: 2, title: "巴黎", cityId: "paris" },
          { id: 3, title: "罗马", cityId: "rome" },
          { id: 4, title: "佛罗伦萨", cityId: "florence" },
          { id: 5, title: "维也纳", cityId: "vienna" },
          { id: 6, title: "布拉格", cityId: "prague" },
          { id: 7, title: "阿姆斯特丹", cityId: "amsterdam" },
          { id: 8, title: "伦敦", cityId: "london" },
          { id: 9, title: "巴塞罗那", cityId: "barcelona" },
          { id: 10, title: "柏林", cityId: "berlin" },
          { id: 11, title: "雅典", cityId: "athens" },
          { id: 12, title: "米兰", cityId: "milan" },
          { id: 13, title: "马德里", cityId: "madrid" },
          { id: 14, title: "苏黎世", cityId: "zurich" },
          { id: 15, title: "慕尼黑", cityId: "munich" }
        ];
      default:
        return mockArtworks;
    }
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#EEEAE2]">
      {/* Category Navigation */}
      <div className="sticky top-0 bg-[#EEEAE2] z-10 flex justify-center">
        <ScrollArea className="w-full max-w-screen-md">
          <div className="flex items-center justify-start gap-3 px-4 py-2 overflow-x-auto no-scrollbar">
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
        {(activeCategory === "special" || activeCategory === "city") ? (
          <GridList 
            artworks={filteredArtworks}
            title={activeCategory === "special" ? "专题作品" : "城市风光"} 
          />
        ) : (
          <WorksList artworks={filteredArtworks} />
        )}
      </div>
    </div>
  );
}