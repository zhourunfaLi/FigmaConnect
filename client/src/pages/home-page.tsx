import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { CategoryList } from "@/components/category-list";
import { WorksList } from "@/components/works-list";

const mockArtworks = [
  {
    id: 1,
    title: "静谧时光",
    description: "油画艺术展现的宁静午后",
    imageUrl: "/images/works-01.png",
    likes: 1200,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 2,
    title: "城市记忆",
    description: "巴黎城市景观油画",
    imageUrl: "/images/works-02.png",
    likes: 800,
    isPremium: false,
    themeId: "city",
    cityId: "paris"
  },
  {
    id: 3,
    title: "自然之美",
    description: "瑞士阿尔卑斯山风光",
    imageUrl: "/images/works-03.png",
    likes: 1500,
    isPremium: true,
    themeId: "art"
  },
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
    id: 5,
    title: "罗马假日",
    description: "永恒之城的艺术气息",
    imageUrl: "/images/city-02.jpg",
    likes: 900,
    isPremium: false,
    themeId: "city",
    cityId: "rome"
  },
  {
    id: 6,
    title: "现代艺术",
    description: "抽象派艺术作品",
    imageUrl: "/images/works-04.png",
    likes: 700,
    isPremium: true,
    themeId: "art"
  },
  {
    id: 7,
    title: "劳特布莱嫩",
    description: "瑞士小镇的宁静时光",
    imageUrl: "/images/city-05.jpg",
    likes: 850,
    isPremium: false,
    themeId: "city",
    cityId: "lauterbrunnen"
  },
  {
    id: 8,
    title: "阿姆斯特丹印象",
    description: "荷兰水城的独特魅力",
    imageUrl: "/images/city-03.jpg",
    likes: 920,
    isPremium: false,
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
  { id: "latest", name: "最新", color: "#333333", icon: "sparkles", layout: "waterfall" },
  { id: "hottest", name: "最热", color: "#333333", icon: "flame", layout: "waterfall" },
  { id: "special", name: "专题", color: "#333333", icon: "star", layout: "grid" },
  { id: "member", name: "会员", color: "#EB9800", icon: "crown", layout: "waterfall" },
  { id: "city", name: "城市", color: "#333333", icon: "buildings", layout: "grid" }
];

export default function HomePage() {
  const [location] = useLocation();
  const [activeCategory, setActiveCategory] = useState<Category["id"]>("latest");

  const filteredArtworks = useMemo(() => {
    switch (activeCategory) {
      case "latest":
        return [...mockArtworks].sort((a, b) => b.id - a.id);
      case "hottest":
        return [...mockArtworks].sort((a, b) => b.likes - a.likes);
      case "special":
        return mockArtworks.filter(artwork => artwork.themeId === "art");
      case "member":
        return mockArtworks.filter(artwork => artwork.isPremium);
      case "city":
        return mockArtworks.filter(artwork => artwork.themeId === "city");
      default:
        return mockArtworks;
    }
  }, [activeCategory]);

  const activeLayout = CATEGORIES.find(cat => cat.id === activeCategory)?.layout || "waterfall";

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryList
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <WorksList artworks={filteredArtworks} layout={activeLayout} />
    </div>
  );
}