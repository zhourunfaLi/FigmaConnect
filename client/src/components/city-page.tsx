import { Heart, Share2 } from "lucide-react";

export function CityPage() {
  const cities = [
    { name: '威尼斯', img: '/src/assets/design/img/city-01.jpg' },
    { name: '梵蒂冈', img: '/src/assets/design/img/city-02.jpg' },
    { name: '巴黎', img: '/src/assets/design/img/city-03.jpg' },
    { name: '罗马', img: '/src/assets/design/img/city-04.jpg' },
    { name: '劳特布莱嫩', img: '/src/assets/design/img/city-05.jpg' },
    { name: '苏黎世', img: '/src/assets/design/img/city-06.jpg' },
    { name: '纽约', img: '/src/assets/design/img/city-07.jpg' },
    { name: '伦敦', img: '/src/assets/design/img/city-08.jpg' },
    { name: '阿姆斯特丹', img: '/src/assets/design/img/city-09.jpg' },
    { name: '维也纳', img: '/src/assets/design/img/city-10.jpg' },
    { name: '布拉格', img: '/src/assets/design/img/city-11.jpg' },
    { name: '柏林', img: '/src/assets/design/img/city-12.jpg' },
    { name: '马德里', img: '/src/assets/design/img/city-13.jpg' },
    { name: '巴塞罗那', img: '/src/assets/design/img/city-14.jpg' },
    { name: '佛罗伦萨', img: '/src/assets/design/img/city-15.jpg' },
    { name: '米兰', img: '/src/assets/design/img/city-16.jpg' },
    { name: '雅典', img: '/src/assets/design/img/city-17.jpg' },
    { name: '斯德哥尔摩', img: '/src/assets/design/img/city-18.jpg' },
    { name: '慕尼黑', img: '/src/assets/design/img/city-19.jpg' },
    { name: '里斯本', img: '/src/assets/design/img/city-20.jpg' }
  ];

  // 创建一个包含城市和广告的新数组
  const contentWithAds = cities.reduce((acc: React.ReactNode[], city, index) => {
    // 先添加城市卡片
    acc.push(
      <div key={`city-${index}`} className="group flex flex-col gap-[1px] cursor-pointer">
        <div className="relative overflow-hidden rounded-[5px]">
          <img 
            src={city.img}
            alt={city.name}
            className="w-[374px] h-[166px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
            <div className="flex justify-end gap-2">
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Heart className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
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

    // 在第三个位置后和之后每隔3个位置插入广告
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
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

type City = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

const CITIES: City[] = [
  {
    id: 'paris',
    name: '巴黎',
    description: '艺术与浪漫之都，拥有世界闻名的卢浮宫和埃菲尔铁塔。',
    imageUrl: '/src/assets/design/img/city-01.jpg'
  },
  {
    id: 'venice',
    name: '威尼斯',
    description: '水城威尼斯，以其运河、贡多拉和独特的建筑而闻名。',
    imageUrl: '/src/assets/design/img/city-02.jpg'
  },
  {
    id: 'tokyo',
    name: '东京',
    description: '传统与现代融合的城市，拥有丰富的文化遗产和前卫艺术。',
    imageUrl: '/src/assets/design/img/city-03.jpg'
  },
  {
    id: 'newyork',
    name: '纽约',
    description: '现代艺术的重要中心，拥有现代艺术博物馆和大都会艺术博物馆。',
    imageUrl: '/src/assets/design/img/city-04.jpg'
  },
  {
    id: 'beijing',
    name: '北京',
    description: '中国文化中心，拥有丰富的历史遗迹和现代艺术设施。',
    imageUrl: '/src/assets/design/img/city-05.jpg'
  }
];

export function CityPage() {
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">城市艺术探索</h1>
      
      <div className="mb-6 w-full max-w-xs">
        <Select 
          value={selectedCity.id}
          onValueChange={(value) => {
            const city = CITIES.find(c => c.id === value);
            if (city) setSelectedCity(city);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择城市" />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src={selectedCity.imageUrl} 
            alt={selectedCity.name} 
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">{selectedCity.name}</h2>
          <p className="text-gray-700 mb-4">{selectedCity.description}</p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">特色艺术</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>历史建筑与纪念碑</li>
              <li>街头艺术与壁画</li>
              <li>博物馆与艺术展览</li>
              <li>当地艺术家作品</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
