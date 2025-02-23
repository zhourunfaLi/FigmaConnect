import { ScrollArea } from "@/components/ui/scroll-area";
import type { Artwork } from "@shared/schema";

interface CityPageProps {
  artworks?: Artwork[];
}

export function CityPage({ artworks = [] }: CityPageProps) {
  return (
    <div className="w-[390px] h-[844px] relative bg-[#EEEAE2]">
      {/* 城市列表部分 */}
      <div className="h-[623px] left-[8px] top-[20px] absolute">
        <div className="flex flex-col gap-[21px]">
          {/* 城市项目 */}
          {[
            { name: '威尼斯', img: '/client/src/assets/design/img/venice.jpg' },
            { name: '梵蒂冈', img: '/client/src/assets/design/img/vatican.jpg' },
            { name: '巴黎', img: '/client/src/assets/design/img/paris.jpg' },
            { name: '罗马废墟', img: '/client/src/assets/design/img/rome.jpg' },
            { name: '劳特布莱嫩', img: '/client/src/assets/design/img/lauterbrunnen.jpg' },
            { name: '苏黎世', img: '/client/src/assets/design/img/zurich.jpg' },
            { name: '纽约', img: '/client/src/assets/design/img/newyork.jpg' }
          ].map((city, index) => (
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
    </div>
  );
}