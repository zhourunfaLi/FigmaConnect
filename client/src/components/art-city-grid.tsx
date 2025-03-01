
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
    navigate(`/artwork/${cityId}`);
  };

  return (
    <div className="container mx-auto px-[8px] py-4">
      <h1 className="text-2xl font-bold mb-6">艺术之城</h1>
      
      <div className="flex flex-col gap-6">
        {CITIES.map((city) => (
          <div 
            key={city.id}
            className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:shadow-lg"
            onClick={() => handleCityClick(city.id)}
          >
            <h3 className="text-lg font-medium mb-2 text-center">{city.name}</h3>
            <div className="relative rounded-lg overflow-hidden w-full">
              <img 
                src={new URL(`../assets/design/img/city-${String(city.id % 7 + 1).padStart(2, '0')}.jpg`, import.meta.url).href}
                alt={city.name}
                className="w-full aspect-[2/1] md:aspect-[3/1] object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
