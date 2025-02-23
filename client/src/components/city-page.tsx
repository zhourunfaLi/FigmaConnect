import type { Artwork } from "@shared/schema";

interface CityPageProps {
  artworks?: Artwork[];
}

import { Heart, Share2 } from "lucide-react";

export function CityPage() {
  // 广告组件
  const AdCard = () => (
    <div className="w-full max-w-[390px] mx-auto mb-[21px]">
      <div className="relative aspect-[374/198] w-full bg-white rounded-[5px] overflow-hidden border border-black/5">
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
          广告
        </div>
        <div className="w-full h-full flex items-center justify-center text-black/30">
          Google Ads
        </div>
      </div>
      <div className="flex justify-between items-center px-2 mt-2">
        <div className="text-sm text-[#111111] font-medium leading-5 truncate">
          推广内容
        </div>
      </div>
    </div>
  );

  const cities = [
    { name: '威尼斯', img: '../assets/design/img/city-01.jpg' },
    { name: '梵蒂冈', img: '../assets/design/img/city-02.jpg' },
    { name: '巴黎', img: '../assets/design/img/city-03.jpg' },
    { name: '罗马', img: '../assets/design/img/city-04.jpg' },
    { name: '劳特布莱嫩', img: '../assets/design/img/city-05.jpg' },
    { name: '苏黎世', img: '../assets/design/img/city-06.jpg' },
    { name: '纽约', img: '../assets/design/img/city-07.jpg' },
    { name: '伦敦', img: '../assets/design/img/city-08.jpg' },
    { name: '阿姆斯特丹', img: '../assets/design/img/city-09.jpg' },
    { name: '维也纳', img: '../assets/design/img/city-10.jpg' },
    { name: '布拉格', img: '../assets/design/img/city-11.jpg' },
    { name: '柏林', img: '../assets/design/img/city-12.jpg' },
    { name: '马德里', img: '../assets/design/img/city-13.jpg' },
    { name: '巴塞罗那', img: '../assets/design/img/city-14.jpg' },
    { name: '佛罗伦萨', img: '../assets/design/img/city-15.jpg' },
    { name: '米兰', img: '../assets/design/img/city-16.jpg' },
    { name: '雅典', img: '../assets/design/img/city-17.jpg' },
    { name: '斯德哥尔摩', img: '../assets/design/img/city-18.jpg' },
    { name: '慕尼黑', img: '../assets/design/img/city-19.jpg' },
    { name: '里斯本', img: '../assets/design/img/city-20.jpg' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#EEEAE2]">
      <div className="max-w-[390px] mx-auto py-[20px] px-2 flex flex-col gap-[21px]">
        <AdCard /> {/* Inserting the AdCard component */}
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
                <div className="flex justify-end gap-2">
                  <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Heart className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
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