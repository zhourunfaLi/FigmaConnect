import { Heart, Share2 } from "lucide-react";
import { useLocation } from 'wouter';

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
    { name: '里斯本', img: '/src/assets/design/img/city-20.jpg' }
  ];

  const contentWithAds = cities.reduce((acc: React.ReactNode[], city, index) => {
    acc.push(
      <div 
        key={`city-${index}`} 
        className="group flex flex-col gap-[1px] cursor-pointer" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setLocation(`/artwork/${city.id}`);
        }}
      >
        <div className="relative overflow-hidden rounded-[5px]">
          <img
            src={city.img}
            alt={city.name}
            className="w-[374px] h-[166px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
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
            <div className="space-y-2">
              <h3 className="text-white font-medium">{city.name}</h3>
              <p className="text-white text-sm opacity-90">探索{city.name}的艺术与文化</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-2 mt-2 group-hover:opacity-0 transition-opacity duration-300">
          <div className="text-[#111111] text-[14px] font-normal leading-[22px] font-['MS Gothic']">
            {city.name}
          </div>
        </div>
      </div>
    );

    if ((index === 2) || (index > 2 && (index - 2) % 3 === 0)) {
      acc.push(
        <div key={`ad-${index}`} className="w-full max-w-[390px] mx-auto">
          <div className="relative aspect-[374/166] w-full bg-white rounded-[5px] overflow-hidden border border-black/5">
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
              广告
            </div>
            <div className="w-full h-full flex items-center justify-center text-black/30">
              广告位招租 {Math.floor((index - 2) / 3) + 1}
            </div>
          </div>
          <div className="flex justify-between items-center px-2 mt-2">
            <div className="text-sm text-[#111111] font-medium leading-5 truncate">
              推广内容 {Math.floor((index - 2) / 3) + 1}
            </div>
          </div>
        </div>
      );
    }

    return acc;
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#EEEAE2]">
      <div className="max-w-[390px] mx-auto py-[20px] px-2 flex flex-col gap-[21px]">
        {contentWithAds}
      </div>
    </div>
  );
}