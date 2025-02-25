import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";
import { useLocation } from 'wouter'
import { CategoryNav } from '@/components/category-nav'

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
  { id: "special", name: "专题", color: "#333333", layout: "grid" },
  { id: "member", name: "会员", color: "#EB9800", layout: "waterfall" },
  { id: "city", name: "城市", color: "#333333", layout: "grid" }
];

// Placeholder ThemeList component - needs further implementation
const ThemeList = ({ themes }: { themes: any[] }) => (
  <div>
    {/*  Implementation for displaying themes and artwork lists would go here */}
    {themes.map(theme => (
      <div key={theme.id}>
        <h2>{theme.title}</h2>
        <WorksList artworks={theme.artworks || []} /> {/* Assuming themes have an artworks array */}
      </div>
    ))}
  </div>
);


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
        // Mock data for special category.  Needs replacement with actual data fetching.
        return { themes: [
          { id: 1, title: "卢浮宫系列传世作品", artworks: mockArtworks.slice(0, 5) },
          { id: 2, title: "达芬奇真迹系列", artworks: mockArtworks.slice(5, 13) }
        ]};
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
        {activeCategory === "special" && typeof filteredArtworks === "object" && "themes" in filteredArtworks ? (
          <ThemeList themes={filteredArtworks.themes} />
        ) : (
          <WorksList artworks={filteredArtworks as any[]} className="mt-4" />
        )}
      </div>
    </div>
  );
}