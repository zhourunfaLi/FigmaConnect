import type { Artwork } from "@shared/schema";
import { useState, useEffect } from 'react';
import { Heart, Share2 } from 'lucide-react';

const cities = [
  { name: "威尼斯", img: "./src/assets/design/img/city-01.jpg" },
  { name: "梵蒂冈", img: "./src/assets/design/img/city-02.jpg" },
  { name: "巴黎", img: "./src/assets/design/img/city-03.jpg" },
  { name: "罗马废墟", img: "./src/assets/design/img/city-04.jpg" },
  { name: "劳特布莱嫩", img: "./src/assets/design/img/city-05.jpg" },
  { name: "苏黎世", img: "./src/assets/design/img/city-06.jpg" },
  { name: "纽约", img: "./src/assets/design/img/city-07.jpg" }
];

function CityCard({ city, index }: { city: typeof cities[0], index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group relative">
      <div className="relative overflow-hidden rounded-[5px]">
        <img 
          src={city.img}
          alt={city.name}
          className={`w-[374px] h-[198px] object-cover transition-all duration-300 
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
        />

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

      <div className="w-[360px] flex justify-between items-center px-2 mt-2">
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