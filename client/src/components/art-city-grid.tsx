
import React from "react";
import { useLocation } from "wouter";
import { Heart, Share2, MoreHorizontal } from "lucide-react";

// 城市数据
const CITIES = [
  {
    id: 1,
    name: "威尼斯",
    cityId: "venice",
  },
  {
    id: 2,
    name: "巴黎",
    cityId: "paris",
  },
  {
    id: 3,
    name: "罗马",
    cityId: "rome",
  },
  {
    id: 4,
    name: "佛罗伦萨",
    cityId: "florence",
  },
  {
    id: 5,
    name: "伦敦",
    cityId: "london",
  },
  {
    id: 6,
    name: "纽约",
    cityId: "newyork",
  },
  {
    id: 7,
    name: "东京",
    cityId: "tokyo",
  },
  {
    id: 8,
    name: "巴塞罗那",
    cityId: "barcelona",
  },
  {
    id: 9,
    name: "阿姆斯特丹",
    cityId: "amsterdam",
  },
  {
    id: 10,
    name: "柏林",
    cityId: "berlin",
  },
  {
    id: 11,
    name: "维也纳",
    cityId: "vienna",
  },
  {
    id: 12,
    name: "布拉格",
    cityId: "prague",
  }
];

export default function ArtCityGrid() {
  const [, navigate] = useLocation();

  const handleCityClick = (cityId: number) => {
    navigate(`/artwork/${cityId}`);
  };

  return (
    <div className="flex flex-col gap-4 px-[8px]">
      {CITIES.map((city) => (
        <div 
          key={city.id}
          className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group"
          onClick={() => handleCityClick(city.id)}
        >
          <div className="relative">
            <img 
              src={new URL(`../assets/design/img/city-${String(city.id % 7 + 1).padStart(2, '0')}.jpg`, import.meta.url).href}
              alt={city.name}
              className="w-full aspect-[2/1] md:aspect-[3/1] object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* City name overlay with gradient background */}
            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white font-semibold text-left">{city.name}</h3>
            </div>

            {/* Action buttons - matching the latest page style */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="rounded-full bg-white/80 p-2 hover:bg-white transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="rounded-full bg-white/80 p-2 hover:bg-white transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="rounded-full bg-white/80 p-2 hover:bg-white transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
