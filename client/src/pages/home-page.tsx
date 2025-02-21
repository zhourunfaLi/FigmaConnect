import { useQuery } from "@tanstack/react-query";
import { type Artwork } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";
import { useState } from "react";

const CATEGORIES = [
  { id: "latest", name: "最新", color: "#666666" },
  { id: "hottest", name: "最热", color: "#666666" },
  { id: "earliest", name: "最早", color: "#666666" },
  { id: "premium", name: "会员", color: "#666666" },
] as const;

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("latest");

  // Fetch artworks data with sorting
  const { data: artworks } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks", activeCategory],
    queryFn: async () => {
      const response = await fetch(`/api/artworks?sortBy=${activeCategory}`);
      const data = await response.json();

      // Filter premium content if premium category is selected
      if (activeCategory === "premium") {
        return data.filter((artwork: Artwork) => artwork.isPremium);
      }

      return data;
    }
  });

  return (
    <div className="min-h-screen bg-[#EEEAE2]">
      {/* Category Navigation */}
      <div className="sticky top-0 bg-[#EEEAE2] z-10">
        <ScrollArea className="w-full max-w-screen">
          <div className="flex justify-center items-center gap-2 px-2 py-1">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`text-sm sm:text-base font-normal transition-colors px-1.5 whitespace-nowrap ${
                  activeCategory === category.id ? "font-medium" : ""
                }`}
                style={{ 
                  color: activeCategory === category.id ? "#111111" : category.color 
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Artwork Grid */}
      <div className="pt-4">
        {artworks && <WorksList artworks={artworks} />}
      </div>
    </div>
  );
}