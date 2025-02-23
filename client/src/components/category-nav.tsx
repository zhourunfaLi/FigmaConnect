
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useLocation } from "wouter";

const CATEGORIES = [
  { id: "latest", name: "最新", color: "#333333" },
  { id: "hottest", name: "最热", color: "#333333" },
  { id: "special", name: "专题", color: "#333333" },
  { id: "member", name: "会员", color: "#EB9800" },
  { id: "city", name: "城市", color: "#333333" }
];

export function CategoryNav() {
  const [, location] = useLocation();
  const [activeCategory, setActiveCategory] = useState(() => {
    if (location === "/city") return "city";
    const urlParams = new URLSearchParams(location.split('?')[1]);
    return urlParams.get('category') || "latest";
  });
  const [, setLocation] = useLocation();

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === "city") {
      setLocation("/city");
    } else {
      setLocation(`/?category=${categoryId}`);
    }
  };

  return (
    <div className="sticky top-0 bg-[#EEEAE2] z-10 flex justify-center">
      <ScrollArea className="w-full max-w-screen-md">
        <div className="flex items-center justify-center gap-3 px-4 py-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
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
  );
}
