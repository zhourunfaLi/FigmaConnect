
import React from "react";
import { useLocation } from "wouter";

// 模拟城市数据
const CITIES = [
  { id: 1, name: '巴黎', img: '/src/assets/design/img/city-01.jpg' },
  { id: 2, name: '伦敦', img: '/src/assets/design/img/city-02.jpg' },
  { id: 3, name: '纽约', img: '/src/assets/design/img/city-03.jpg' },
  { id: 4, name: '东京', img: '/src/assets/design/img/city-04.jpg' },
  { id: 5, name: '罗马', img: '/src/assets/design/img/city-05.jpg' },
  { id: 6, name: '巴塞罗那', img: '/src/assets/design/img/city-06.jpg' },
  { id: 7, name: '阿姆斯特丹', img: '/src/assets/design/img/city-07.jpg' },
  { id: 8, name: '威尼斯', img: '/src/assets/design/img/city-08.jpg' },
  { id: 9, name: '维也纳', img: '/src/assets/design/img/city-09.jpg' },
  { id: 10, name: '柏林', img: '/src/assets/design/img/city-10.jpg' },
  { id: 11, name: '悉尼', img: '/src/assets/design/img/city-11.jpg' },
  { id: 12, name: '布拉格', img: '/src/assets/design/img/city-12.jpg' },
  { id: 13, name: '新加坡', img: '/src/assets/design/img/city-13.jpg' },
  { id: 14, name: '首尔', img: '/src/assets/design/img/city-14.jpg' },
  { id: 15, name: '迪拜', img: '/src/assets/design/img/city-15.jpg' },
  { id: 16, name: '京都', img: '/src/assets/design/img/city-16.jpg' },
  { id: 17, name: '布宜诺斯艾利斯', img: '/src/assets/design/img/city-17.jpg' },
  { id: 18, name: '圣托里尼', img: '/src/assets/design/img/city-18.jpg' },
  { id: 19, name: '开普敦', img: '/src/assets/design/img/city-19.jpg' },
  { id: 20, name: '里斯本', img: '/src/assets/design/img/city-20.jpg' }
];

function CityPage() {
  const [, setLocation] = useLocation();

  // 处理点击事件，导航到作品详情页
  const handleCityClick = (e: React.MouseEvent, cityId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setLocation(`/artwork/${cityId}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {CITIES.map((city, index) => (
        <div 
          key={`city-${index}`} 
          className="group flex flex-col gap-[1px] cursor-pointer" 
          onClick={(e) => handleCityClick(e, city.id)}
        >
          <div className="relative overflow-hidden rounded-[5px]">
            <img
              src={city.img}
              alt={city.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-3 w-full">
                <p className="text-white/80 text-sm">
                  城市风光与建筑
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-2 mt-2 group-hover:opacity-0 transition-opacity duration-300">
            <div className="text-sm text-[#111111] font-medium">{city.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CityPage;
