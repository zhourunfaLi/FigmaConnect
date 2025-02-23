import { type Artwork } from "@shared/schema";

interface CityPageProps {
  artworks?: Artwork[];
}

export function CityPage({ artworks = [] }: CityPageProps) {
  const cities = [
    { name: '威尼斯', img: '/assets/design/img/city-01.jpg' },
    { name: '梵蒂冈', img: '/assets/design/img/city-02.jpg' },
    { name: '巴黎', img: '/assets/design/img/city-03.jpg' },
    { name: '罗马废墟', img: '/assets/design/img/city-04.jpg' },
    { name: '劳特布莱嫩', img: '/assets/design/img/city-05.jpg' },
    { name: '苏黎世', img: '/assets/design/img/city-06.jpg' },
    { name: '纽约', img: '/assets/design/img/city-07.jpg' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {cities.map((city, index) => (
        <div key={index} className="relative">
          <img src={city.img} alt={city.name} className="w-full h-auto rounded-lg"/>
          <p className="mt-2 text-center">{city.name}</p>
        </div>
      ))}
    </div>
  );
}