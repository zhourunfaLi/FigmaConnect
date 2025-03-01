
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
        <div key={city.id} className="flex flex-col gap-2">
          {/* 城市名称 - 独立显示在图片上方 */}
          <h3 className="text-lg font-medium">{city.name}</h3>
          
          {/* 城市缩略图 - 圆角图片，无底部名称 */}
          <div 
            className="cursor-pointer group"
            onClick={() => handleCityClick(city.id)}
          >
            <div className="relative overflow-hidden rounded-xl">
              <img 
                src={new URL(`../assets/design/img/city-${String(city.id % 7 + 1).padStart(2, '0')}.jpg`, import.meta.url).href}
                alt={city.name}
                className="w-full aspect-[2/1] md:aspect-[3/1] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* 悬浮遮罩 - 添加与最新页一致的黑色遮罩效果 */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 rounded-xl">
                {/* 顶部操作按钮 */}
                <div className="flex justify-end items-start">
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                
                {/* 底部内容 - 悬浮时显示 */}
                <div className="space-y-2">
                  <h3 className="text-white font-medium line-clamp-2">
                    {city.name}艺术与历史
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-2">
                    探索{city.name}的艺术与文化遗产
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
