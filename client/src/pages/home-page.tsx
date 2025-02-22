import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";

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