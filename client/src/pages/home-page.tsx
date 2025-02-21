import { useQuery } from "@tanstack/react-query";
import { type Artwork } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorksList from "@/components/works-list";
import { useState } from "react";

// Category configuration
type Category = {
  id: string;
  name: string;
  color: string;
};

const CATEGORIES: Category[] = [
  { id: "latest", name: "最新", color: "#111111", icon: "🌟" },
  { id: "hottest", name: "最热", color: "#FF4D4D", icon: "🔥" },
  { id: "earliest", name: "最早", color: "#4A90E2", icon: "⏰" },
  { id: "special", name: "专题", color: "#7ED321", icon: "📌" },
  { id: "member", name: "会员", color: "#EB9800", icon: "👑" },
  { id: "city", name: "城市", color: "#9013FE", icon: "🏙️" }
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category["id"]>("latest");

  // Fetch artworks data
  const { data: artworks } = useQuery<Artwork[]>({ 
    queryKey: ["/api/artworks"]
  });

  return (
    <div className="min-h-screen bg-[#EEEAE2]">
      {/* WeChat Navigation Bar */}
      <div className="w-full h-[90px] bg-white flex items-center justify-center border-b border-black/10">
        <img 
          src="./src/assets/design/weixin NAV.png" 
          alt="WeChat Navigation" 
          className="w-full h-full object-contain" 
        />
      </div>

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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full h-[73px] bg-white border-t border-black/10">
        <div className="flex justify-around items-center h-full px-16">
          <button className="p-2">
            <svg width="28" height="28" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.70833 19.6711C7.70833 17.5779 7.70833 16.5313 8.13146 15.6113C8.55458 14.6913 9.34923 14.0102 10.9385 12.648L12.4802 11.3265C15.3528 8.8643 16.7891 7.63318 18.5 7.63318C20.2109 7.63318 21.6472 8.8643 24.5198 11.3265L26.0615 12.648C27.6508 14.0102 28.4454 14.6913 28.8685 15.6113C29.2917 16.5313 29.2917 17.5779 29.2917 19.6711V26.2084C29.2917 29.1154 29.2917 30.5689 28.3886 31.4719C27.4855 32.375 26.032 32.375 23.125 32.375H13.875C10.968 32.375 9.5145 32.375 8.61142 31.4719C7.70833 30.5689 7.70833 29.1154 7.70833 26.2084V19.6711Z" stroke="#1C1C1C" strokeWidth="2"/>
              <path d="M22.3542 32.375V24.125C22.3542 23.5727 21.9064 23.125 21.3542 23.125H15.6458C15.0935 23.125 14.6458 23.5727 14.6458 24.125V32.375" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="p-2">
            <svg width="28" height="28" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18.5" cy="11.5" r="6.5" stroke="#1C1C1C" strokeWidth="2"/>
              <path d="M2.93276 25.8306C3.86711 23.1161 6.5634 21.5833 9.43426 21.5833H15.5658C18.4366 21.5833 21.1329 23.116 22.0673 25.8306C22.6255 27.4525 23.1258 29.3914 23.2578 31.3757C23.2945 31.9267 22.844 32.375 22.2917 32.375H2.70834C2.15606 32.375 1.70557 31.9267 1.74223 31.3757C1.87424 29.3914 2.3745 27.4525 2.93276 25.8306Z" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}