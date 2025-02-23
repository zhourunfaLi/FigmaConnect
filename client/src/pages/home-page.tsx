import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";
import { CategoryNav } from "@/components/category-nav";

// Mock data
const mockArtworks = [
  {
    id: 1,
    title: "蒙娜丽莎",
    description: "达芬奇最著名的作品",
    imageUrl: "https://placehold.co/400x600",
    likes: 1000,
    isPremium: false,
    themeId: "davinci",
    cityId: "paris"
  },
  {
    id: 2,
    title: "向日葵",
    description: "梵高的经典作品",
    imageUrl: "https://placehold.co/400x400",
    likes: 800,
    isPremium: true,
    themeId: "vangogh",
    cityId: "amsterdam"
  },
  {
    id: 3,
    title: "星空",
    description: "梵高的代表作",
    imageUrl: "https://placehold.co/400x500",
    likes: 1200,
    isPremium: true,
    themeId: "vangogh",
    cityId: "amsterdam"
  }
];

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

const CATEGORIES: Category[] = [
  { id: "latest", name: "最新", color: "#333333" },
  { id: "hottest", name: "最热", color: "#333333" },
  { id: "special", name: "专题", color: "#333333" },
  { id: "member", name: "会员", color: "#EB9800" },
  { id: "city", name: "城市", color: "#333333" }
];

export default function HomePage() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const categoryFromUrl = urlParams.get('category') || 'latest';
  const [activeCategory, setActiveCategory] = useState<Category["id"]>(categoryFromUrl);

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
      <a
        href="/city"
        className="absolute top-4 left-4 inline-block px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
        前往城市页面
      </a>
      <CategoryNav />

      {/* Artwork Grid */}
      <div className="pt-4">
        <WorksList artworks={filteredArtworks} />
      </div>
    </div>
  );
}