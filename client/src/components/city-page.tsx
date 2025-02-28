
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
  const [, navigate] = useLocation();
  
  const handleCityClick = (cityId: number) => {
    console.log("点击城市:", cityId);
    navigate(`/artwork/${cityId}`);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">探索世界城市艺术</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CITIES.map((city) => (
          <div 
            key={city.id}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg"
            onClick={() => handleCityClick(city.id)}
          >
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={city.img} 
                alt={city.name}
                className="w-full aspect-[3/4] object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white">点击查看作品</p>
              </div>
            </div>
            <h3 className="mt-2 font-medium">{city.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CityPage;
