
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";

// Mock data
const mockThemes = [
  {
    id: "davinci",
    name: "达芬奇主题作品",
    artworks: [
      { id: 1, title: "蒙娜丽莎", description: "最著名的微笑", imageUrl: "https://placehold.co/400x600", likes: 1000, isPremium: false },
      { id: 2, title: "最后的晚餐", description: "宗教艺术杰作", imageUrl: "https://placehold.co/400x500", likes: 850, isPremium: false },
      { id: 3, title: "岩间圣母", description: "精美的构图", imageUrl: "https://placehold.co/400x600", likes: 750, isPremium: false },
      { id: 4, title: "施洗者圣约翰", description: "神秘的微笑", imageUrl: "https://placehold.co/400x600", likes: 650, isPremium: true },
      { id: 5, title: "维特鲁威人", description: "完美比例", imageUrl: "https://placehold.co/400x400", likes: 900, isPremium: false },
      { id: 6, title: "圣母子与圣安妮", description: "温馨的母爱", imageUrl: "https://placehold.co/400x600", likes: 700, isPremium: false }
    ]
  },
  {
    id: "chinese",
    name: "中国十大传世名画",
    artworks: [
      { id: 7, title: "清明上河图", description: "北宋繁华景象", imageUrl: "https://placehold.co/400x800", likes: 1200, isPremium: false },
      { id: 8, title: "千里江山图", description: "青绿山水", imageUrl: "https://placehold.co/400x800", likes: 1100, isPremium: false },
      { id: 9, title: "洛神赋图", description: "诗意绘画", imageUrl: "https://placehold.co/400x600", likes: 950, isPremium: true },
      { id: 10, title: "步辇图", description: "唐代风俗", imageUrl: "https://placehold.co/400x600", likes: 850, isPremium: false },
      { id: 11, title: "富春山居图", description: "水墨山水", imageUrl: "https://placehold.co/400x800", likes: 1000, isPremium: false }
    ]
  },
  {
    id: "british_museum",
    name: "大英博物馆珍品",
    artworks: [
      { id: 12, title: "帕台农神庙雕塑", description: "古希腊艺术", imageUrl: "https://placehold.co/400x400", likes: 800, isPremium: false },
      { id: 13, title: "罗塞塔石碑", description: "古埃及文字", imageUrl: "https://placehold.co/400x600", likes: 950, isPremium: true },
      { id: 14, title: "埃及木乃伊", description: "古埃及文明", imageUrl: "https://placehold.co/400x500", likes: 1100, isPremium: false }
    ]
  },
  {
    id: "vangogh",
    name: "梵高主题作品",
    artworks: [
      { id: 15, title: "星夜", description: "后印象派杰作", imageUrl: "https://placehold.co/400x500", likes: 1500, isPremium: false },
      { id: 16, title: "向日葵", description: "黄色的激情", imageUrl: "https://placehold.co/400x600", likes: 1400, isPremium: false },
      { id: 17, title: "麦田群鸦", description: "最后的作品", imageUrl: "https://placehold.co/400x500", likes: 1200, isPremium: true }
    ]
  },
  {
    id: "impressionism",
    name: "印象派精选",
    artworks: [
      { id: 18, title: "睡莲", description: "莫奈代表作", imageUrl: "https://placehold.co/400x400", likes: 900, isPremium: false },
      { id: 19, title: "阳光下的罂粟花", description: "莫奈花卉", imageUrl: "https://placehold.co/400x500", likes: 850, isPremium: false },
      { id: 20, title: "舞会", description: "雷诺阿名作", imageUrl: "https://placehold.co/400x600", likes: 800, isPremium: true }
    ]
  }
];

const mockArtworks = mockThemes.flatMap(theme => 
  theme.artworks.map(artwork => ({
    ...artwork,
    themeId: theme.id
  }))
);

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
        return (
          <div className="space-y-8 px-4 max-w-screen-xl mx-auto">
            {mockThemes.map(theme => (
              <div key={theme.id} className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">{theme.name}</h2>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <WorksList artworks={theme.artworks} />
              </div>
            ))}
          </div>
        );
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
