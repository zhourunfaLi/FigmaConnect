
import { type Artwork } from "@shared/schema";

interface CityPageProps {
  artworks?: Artwork[];
}

export function CityPage({ artworks = [] }: CityPageProps) {
  const cities = [
    { name: '威尼斯', img: '/design/img/city-01.jpg' },
    { name: '梵蒂冈', img: '/design/img/city-02.jpg' },
    { name: '巴黎', img: '/design/img/city-03.jpg' },
    { name: '罗马废墟', img: '/design/img/city-04.jpg' },
    { name: '劳特布莱嫩', img: '/design/img/city-05.jpg' },
    { name: '苏黎世', img: '/design/img/city-06.jpg' },
    { name: '纽约', img: '/design/img/city-07.jpg' }
  ];

  return (
    <div className="w-[390px] h-[844px] relative bg-[#EEEAE2]">
      <div className="h-[623px] left-[8px] top-[148px] absolute flex flex-col gap-[21px]">
        {cities.map((city, index) => (
          <div key={index} className="flex flex-col items-center gap-[1px]">
            <img 
              src={city.img}
              alt={city.name}
              className="w-[374px] h-[198px] rounded-[5px] object-cover"
            />
            <div className="w-[360px] flex justify-between items-center">
              <div className="text-[#111111] text-[14px] font-normal leading-[22px] font-['MS Gothic']">
                {city.name}
              </div>
              <div className="w-[13px] h-[3px] flex justify-center items-start gap-[2px]">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-[3px] h-[3px] bg-[#111111] rounded-full" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
