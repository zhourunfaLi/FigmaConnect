import type { Artwork } from "@shared/schema";

interface CityPageProps {
  artworks?: Artwork[];
}

export function CityPage() {
  const cities = [
    { name: '威尼斯', img: '/src/assets/design/img/city-01.jpg' },
    { name: '梵蒂冈', img: '/src/assets/design/img/city-02.jpg' },
    { name: '巴黎', img: '/src/assets/design/img/city-03.jpg' },
    { name: '罗马废墟', img: '/src/assets/design/img/city-04.jpg' },
    { name: '劳特布莱嫩', img: '/src/assets/design/img/city-05.jpg' },
    { name: '苏黎世', img: '/src/assets/design/img/city-06.jpg' },
    { name: '纽约', img: '/src/assets/design/img/city-07.jpg' }
  ];

  return (
    <div className="w-[390px] h-[844px] relative bg-[#EEEAE2]">
      <div className="left-[8px] top-[20px] absolute flex flex-col gap-[21px]">
        {cities.map((city, index) => (
          <div 
            key={index} 
            className="group flex flex-col gap-[1px] cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-[5px]">
              <img 
                src={city.img}
                alt={city.name}
                className="w-[374px] h-[198px] object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex justify-end items-start">
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Bottom content */}
                <div className="space-y-2">
                  <h3 className="text-white font-medium">
                    {city.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    探索{city.name}的艺术与文化
                  </p>
                </div>
              </div>
            </div>

            {/* Title and options (visible when not hovering) */}
            <div className="flex justify-between items-center px-2 mt-2 group-hover:opacity-0 transition-opacity duration-300">
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
        ))}
      </div>
    </div>
  );
}