import type { Artwork } from "@shared/schema";
import { useState, useEffect } from "react";
import { Share2, Heart } from "lucide-react";

interface CityPageProps {
  artworks?: Artwork[];
}

const cities = [
  { name: "威尼斯", img: "./src/assets/design/cities/city-01.jpg" },
  { name: "梵蒂冈", img: "./src/assets/design/cities/city-02.jpg" },
  { name: "巴黎", img: "./src/assets/design/cities/city-03.jpg" },
  { name: "罗马废墟", img: "./src/assets/design/cities/city-04.jpg" },
  { name: "劳特布莱嫩", img: "./src/assets/design/cities/city-05.jpg" },
  { name: "苏黎世", img: "./src/assets/design/cities/city-06.jpg" },
  { name: "纽约", img: "./src/assets/design/cities/city-07.jpg" }
];

function CityCard({ city, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    const element = document.getElementById(`city-${index}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div 
      id={`city-${index}`}
      className="group flex flex-col items-center gap-[1px] cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-[5px]">
        {(!isVisible || !imageLoaded) && (
          <div className="w-[374px] h-[198px] bg-gray-200 animate-pulse rounded-[5px]" />
        )}

        {isVisible && (
          <img 
            src={city.img}
            alt={city.name}
            className={`w-[374px] h-[198px] object-cover transition-all duration-300 
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              group-hover:scale-105`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          <div className="flex justify-end gap-2">
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Heart className="w-4 h-4 text-white" />
            </button>
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="space-y-1">
            <h3 className="text-white font-medium">{city.name}</h3>
            <p className="text-white/80 text-sm">探索{city.name}的艺术与文化</p>
          </div>
        </div>
      </div>

      <div className="w-[360px] flex justify-between items-center px-2 mt-2 group-hover:opacity-0 transition-opacity duration-300">
        <div className="text-[#111111] text-[14px] font-normal leading-[22px] font-['MS Gothic']">
          {city.name}
        </div>
        <div className="w-[13px] h-[3px] flex justify-center items-center gap-[2px]">
          <div className="w-[3px] h-[3px] bg-[#111111] rounded-full" />
          <div className="w-[3px] h-[3px] bg-[#111111] rounded-full" />
          <div className="w-[3px] h-[3px] bg-[#111111] rounded-full" />
        </div>
      </div>
    </div>
  );
}


export function CityPage() {
  return (
    <div className="w-[390px] h-[844px] relative bg-[#EEEAE2]">
      <div className="left-[8px] top-[20px] absolute flex flex-col gap-[21px]">
        {cities.map((city, index) => (
          <CityCard key={index} city={city} index={index} />
        ))}
      </div>
    </div>
  );
}