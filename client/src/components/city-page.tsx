
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Artwork } from "@shared/schema";

interface CityPageProps {
  artworks?: Artwork[];
}

export function CityPage({ artworks = [] }: CityPageProps) {
  return (
    <div className="w-[390px] h-[844px] relative bg-[#EEEAE2]">
      {/* 城市列表部分 */}
      <div className="h-[623px] left-[8px] top-[148px] absolute">
        <div className="flex flex-col gap-[21px]">
          {/* 城市项目 */}
          {['威尼斯', '梵蒂冈', '巴黎', '罗马废墟', '劳特布莱嫩', '苏黎世', '纽约'].map((city, index) => (
            <div key={index} className="flex flex-col items-center gap-[1px]">
              <img 
                src="https://placehold.co/374x198" 
                alt={city}
                className="w-[374px] h-[198px] rounded-[5px]"
              />
              <div className="w-[360px] flex justify-between items-center">
                <div className="text-[#111111] text-[14px] font-normal leading-[22px] font-['MS Gothic']">
                  {city}
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

      {/* 顶部导航 */}
      <div className="w-[373px] h-[22px] left-[9px] top-[114px] absolute">
        {['最新', '最热', '最早', '专题', '会员', '城市'].map((item, index) => (
          <div 
            key={index}
            className={`w-[73px] h-[22px] absolute text-center text-[18px] font-normal leading-[22px] tracking-[3px] font-['Microsoft YaHei']`}
            style={{
              left: `${index * 60}px`,
              color: item === '城市' ? 'black' : item === '会员' ? '#EB9800' : '#6D6D6D'
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* 底部导航 */}
      <div className="w-[390px] h-[73px] left-0 top-[771px] absolute bg-white border-t border-black/22">
        <div className="left-[67px] top-[21px] absolute">
          <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.70831 19.6711C7.70831 17.5779 7.70831 16.5313 8.13144 15.6113C8.55457 14.6913 9.34921 14.0102 10.9385 12.648L12.4802 11.3265C15.3528 8.8643 16.7891 7.63318 18.5 7.63318C20.2109 7.63318 21.6472 8.8643 24.5198 11.3265L26.0615 12.648C27.6507 14.0102 28.4454 14.6913 28.8685 15.6113C29.2916 16.5313 29.2916 17.5779 29.2916 19.6711V26.2084C29.2916 29.1154 29.2916 30.5689 28.3886 31.4719C27.4855 32.375 26.032 32.375 23.125 32.375H13.875C10.968 32.375 9.51449 32.375 8.6114 31.4719C7.70831 30.5689 7.70831 29.1154 7.70831 26.2084V19.6711Z" stroke="#1C1C1C" strokeWidth="2"/>
            <path d="M22.3541 32.375V24.125C22.3541 23.5727 21.9064 23.125 21.3541 23.125H15.6458C15.0935 23.125 14.6458 23.5727 14.6458 24.125V32.375" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="left-[280px] top-[21px] absolute">
          <div className="w-[12.33px] h-[12.33px] rounded-full border-2 border-[#1C1C1C]" />
          <svg width="25" height="14" viewBox="0 0 25 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[4.62px]">
            <path d="M2.93273 5.8306C3.86707 3.11605 6.56337 1.58331 9.43423 1.58331H15.5657C18.4366 1.58331 21.1329 3.11604 22.0672 5.8306C22.6255 7.45254 23.1257 9.39139 23.2578 11.3757C23.2944 11.9267 22.8439 12.375 22.2916 12.375H2.70831C2.15603 12.375 1.70554 11.9267 1.7422 11.3757C1.87421 9.39139 2.37447 7.45254 2.93273 5.8306Z" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* 顶部微信栏 */}
      <div className="w-[390px] h-[90px] left-0 top-0 absolute flex justify-center items-center">
        <img src="https://placehold.co/390x90" alt="微信栏" className="w-[390px] h-[90px]" />
      </div>
    </div>
  );
}
