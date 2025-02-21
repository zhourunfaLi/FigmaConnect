import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorksList } from "@/components/works-list";

const CATEGORIES = [
  { id: "all", name: "全部" },
  { id: "special", name: "专题" },
  { id: "latest", name: "最新" },
];

// 模拟专题数据
const mockThemes = [
  {
    id: "davinci",
    name: "达芬奇作品专题",
    artworks: Array(6).fill(null).map((_, i) => ({
      id: `davinci-${i}`,
      title: `达芬奇作品 ${i + 1}`,
      imageUrl: `https://picsum.photos/400/600?random=${i}`,
      description: "达芬奇的经典作品"
    }))
  },
  {
    id: "chinese",
    name: "中国十大传世名画",
    artworks: Array(10).fill(null).map((_, i) => ({
      id: `chinese-${i}`,
      title: `中国名画 ${i + 1}`,
      imageUrl: `https://picsum.photos/400/600?random=${i + 10}`,
      description: "中国传世经典名画"
    }))
  },
  {
    id: "british",
    name: "大英博物馆艺术精选",
    artworks: Array(8).fill(null).map((_, i) => ({
      id: `british-${i}`,
      title: `大英博物馆藏品 ${i + 1}`,
      imageUrl: `https://picsum.photos/400/600?random=${i + 20}`,
      description: "大英博物馆珍藏艺术品"
    }))
  }
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const mockArtworks = mockThemes.flatMap(theme => theme.artworks);

  function getDisplayContent() {
    switch (selectedCategory) {
      case "all":
        return <WorksList artworks={mockArtworks} />;
      case "latest":
        return <WorksList artworks={[...mockArtworks].sort((a, b) => a.id.localeCompare(b.id))} />;
      case "special":
        return (
          <div className="space-y-12 px-4 max-w-screen-xl mx-auto py-6">
            {mockThemes.map(theme => (
              <div key={theme.id} className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <h2 className="text-2xl font-medium text-gray-900">{theme.name}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {theme.artworks.map(artwork => (
                    <div key={artwork.id} className="group relative">
                      <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg">
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="mt-2">
                        <h3 className="text-sm font-medium text-gray-900">{artwork.title}</h3>
                        <p className="text-sm text-gray-500">{artwork.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <WorksList artworks={mockArtworks} />;
    }
  }

  return (
    <main className="min-h-screen bg-[#EEEAE2]">
      {/* Category Navigation */}
      <div className="sticky top-0 bg-[#EEEAE2] z-10 flex justify-center">
        <ScrollArea className="w-full max-w-screen-md">
          <div className="flex items-center justify-center gap-3 px-4 py-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? "bg-black text-white"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content */}
      <div className="container mx-auto py-8">
        {getDisplayContent()}
      </div>
    </main>
  );
}