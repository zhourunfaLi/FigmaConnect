import React, { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";
import { useLocation } from 'wouter';
import { CategoryNav } from '@/components/category-nav';
import GridList from '@/components/grid-list';
import { Link } from 'wouter';

type LayoutType = "waterfall" | "grid";

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  layout: LayoutType;
};

const CATEGORIES: Category[] = [
  { id: "latest", name: "最新", color: "#333333", layout: "waterfall", icon: "🆕" },
  { id: "hottest", name: "最热", color: "#333333", layout: "waterfall", icon: "🔥" },
  { id: "member", name: "会员", color: "#EB9800", layout: "waterfall", icon: "👑" },
  { id: "special", name: "专题", color: "#333333", layout: "grid", icon: "🌟" },
  { id: "city", name: "城市", color: "#333333", layout: "grid", icon: "🏙️" }
];

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
    cityId: isCity ? ["venice", "paris", "tokyo", "newyork", "london", "beijing", "sydney"][cityIndex % 7] : null
  };
});

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const [location, navigate] = useLocation();

  // Filter artworks based on selected category
  const filteredArtworks = useMemo(() => {
    if (selectedCategory.id === "city") {
      return mockArtworks.filter(artwork => artwork.themeId === "city");
    } else if (selectedCategory.id === "member") {
      return mockArtworks.filter(artwork => artwork.isPremium);
    } else if (selectedCategory.id === "latest") {
      return [...mockArtworks].sort((a, b) => b.id - a.id);
    } else if (selectedCategory.id === "hottest") {
      return [...mockArtworks].sort((a, b) => b.likes - a.likes);
    }
    return mockArtworks;
  }, [selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">艺术博物馆</h1>

      <CategoryNav 
        categories={CATEGORIES} 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="mt-8">
        {selectedCategory.layout === "waterfall" ? (
          <WorksList works={filteredArtworks} />
        ) : (
          <GridList items={filteredArtworks} />
        )}
      </div>
    </div>
  );
}