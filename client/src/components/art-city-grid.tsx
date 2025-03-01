import React from "react";
import { useLocation } from "wouter";

// 城市数据
const CITIES = [
  {
    id: 1,
    name: "威尼斯",
    cityId: "venice",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-01.jpg"
  },
  {
    id: 2,
    name: "巴黎",
    cityId: "paris",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-02.jpg"
  },
  {
    id: 3,
    name: "罗马",
    cityId: "rome",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-03.jpg"
  },
  {
    id: 4,
    name: "佛罗伦萨",
    cityId: "florence",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-04.jpg"
  },
  {
    id: 5,
    name: "伦敦",
    cityId: "london",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-05.jpg"
  },
  {
    id: 6,
    name: "纽约",
    cityId: "newyork",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-06.jpg"
  },
  {
    id: 7,
    name: "东京",
    cityId: "tokyo",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-07.jpg"
  },
  {
    id: 8,
    name: "巴塞罗那",
    cityId: "barcelona",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-01.jpg"
  },
  {
    id: 9,
    name: "阿姆斯特丹",
    cityId: "amsterdam",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-02.jpg"
  },
  {
    id: 10,
    name: "柏林",
    cityId: "berlin",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-03.jpg"
  },
  {
    id: 11,
    name: "维也纳",
    cityId: "vienna",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-04.jpg"
  },
  {
    id: 12,
    name: "布拉格",
    cityId: "prague",
    image: "https://f2916c27-c314-447f-ae6c-b3b335ae4b1d-00-82om0xh9g3hd.kirk.replit.dev:5000/src/assets/design/img/city-05.jpg"
  }
];

export default function ArtCityGrid() {
  const [, navigate] = useLocation();

  const handleCityClick = (cityId: number) => {
    navigate(`/category/city/${cityId}`);
  };

  return (
    <div className="container mx-auto px-[8px] py-4">
      <div className="flex flex-col gap-6">
        {CITIES.map((city) => (
          <div 
            key={city.id}
            className="group cursor-pointer"
            onClick={() => navigate(`/category/city/${city.id}`)}
          >
            <div className="font-medium mb-2 text-left">{city.name}</div>
            <div className="overflow-hidden rounded-xl relative">
              <img 
                src={new URL(`../assets/design/img/city-${String(city.id % 7 + 1).padStart(2, '0')}.jpg`, import.meta.url).href}
                alt={city.name}
                className="w-full aspect-[2/1] md:aspect-[3/1] object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover overlay with actions - 与最新页一致的互动效果 */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex justify-end items-start">
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      </svg>
                    </button>
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16 6 12 2 8 6"/>
                        <line x1="12" x2="12" y1="2" y2="15"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Bottom content */}
                <div className="space-y-2">
                  <h3 className="text-white font-medium line-clamp-2">
                    {city.name}
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-2">
                    探索{city.name}的艺术之旅
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}