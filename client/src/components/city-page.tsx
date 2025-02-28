
import { useLocation } from "wouter";
import { Heart, Share2 } from "lucide-react";

export function CityPage() {
  const [, setLocation] = useLocation();
  const cities = [
    { id: 1, name: '威尼斯', img: '/src/assets/design/img/city-01.jpg' },
    { id: 2, name: '梵蒂冈', img: '/src/assets/design/img/city-02.jpg' },
    { id: 3, name: '巴黎', img: '/src/assets/design/img/city-03.jpg' },
    { id: 4, name: '罗马', img: '/src/assets/design/img/city-04.jpg' },
    { id: 5, name: '劳特布莱嫩', img: '/src/assets/design/img/city-05.jpg' },
    { id: 6, name: '苏黎世', img: '/src/assets/design/img/city-06.jpg' },
    { id: 7, name: '纽约', img: '/src/assets/design/img/city-07.jpg' },
    { id: 8, name: '伦敦', img: '/src/assets/design/img/city-08.jpg' },
    { id: 9, name: '阿姆斯特丹', img: '/src/assets/design/img/city-09.jpg' },
    { id: 10, name: '维也纳', img: '/src/assets/design/img/city-10.jpg' },
    { id: 11, name: '布拉格', img: '/src/assets/design/img/city-11.jpg' },
    { id: 12, name: '柏林', img: '/src/assets/design/img/city-12.jpg' },
    { id: 13, name: '马德里', img: '/src/assets/design/img/city-13.jpg' },
    { id: 14, name: '巴塞罗那', img: '/src/assets/design/img/city-14.jpg' },
    { id: 15, name: '佛罗伦萨', img: '/src/assets/design/img/city-15.jpg' },
    { id: 16, name: '米兰', img: '/src/assets/design/img/city-16.jpg' },
    { id: 17, name: '雅典', img: '/src/assets/design/img/city-17.jpg' },
    { id: 18, name: '斯德哥尔摩', img: '/src/assets/design/img/city-18.jpg' },
    { id: 19, name: '慕尼黑', img: '/src/assets/design/img/city-19.jpg' },
    { id: 20, name: '里斯本', img: '/src/assets/design/img/city-20.jpg' }
  ];

  const handleCityClick = (cityId: number) => {
    setLocation(`/artwork/${cityId}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 py-6">
      {cities.map((city, index) => (
        <div 
          key={`city-${index}`} 
          className="group flex flex-col gap-[1px] cursor-pointer" 
          onClick={() => handleCityClick(city.id)}
        >
          <div className="relative overflow-hidden rounded-[5px]">
            <img
              src={city.img}
              alt={city.name}
              className="w-full h-full object-cover aspect-[3/4] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2 flex gap-2">
              <div className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
                #{index + 1}
              </div>
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div className="flex justify-end gap-2">
                <button 
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="w-5 h-5 text-white" />
                </button>
                <button 
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
              <div>
                <h3 className="text-white font-medium truncate">{city.name}</h3>
                <p className="text-white/80 text-sm truncate">著名旅游城市</p>
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
