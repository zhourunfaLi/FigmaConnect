import type { Artwork } from "@shared/schema";

interface CityPageProps {
  artworks?: Artwork[];
}

export function CityPage() {
  const cities = [
    { name: '威尼斯', img: '/src/assets/design/img/city-01.jpg' },
    { name: '梵蒂冈', img: '/src/assets/design/img/city-02.jpg' },
    { name: '巴黎', img: '/src/assets/design/img/city-03.jpg' },
    { name: '罗马废墟', img: '/src/assets/design/img/city-04.jpg' },
    { name: '劳特布莱嫩', img: '/src/assets/design/img/city-05.jpg' },
    { name: '苏黎世', img: '/src/assets/design/img/city-06.jpg' },
    { name: '纽约', img: '/src/assets/design/img/city-07.jpg' }
  ];

  return (
    <div className="w-[390px] h-[844px] relative bg-[#EEEAE2]">
      <div className="left-[8px] top-[20px] absolute flex flex-col gap-[21px]">
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

      {/* 底部导航 */}
      <div className="w-[390px] h-[73px] left-0 top-[771px] absolute bg-white border-t border-black/22">
        <div className="left-[67px] top-[21px] absolute">
          <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.70831 19.6711C7.70831 17.5779 7.70831 16.5313 8.13144 15.6113C8.55457 14.6913 9.34921 14.0102 10.9385 12.648L12.4802 11.3265C15.3528 8.8643 16.7891 7.63318 18.5 7.63318C20.2109 7.63318 21.6472 8.8643 24.5198 11.3265L26.0615 12.648C27.6507 14.0102 28.4454 14.6913 28.8685 15.6113C29.2916 16.5313 29.2916 17.5779 29.2916 19.6711V26.2084C29.2916 29.1154 29.2916 30.5689 28.3886 31.4719C27.4855 32.375 26.032 32.375 23.125 32.375H13.875C10.968 32.375 9.51449 32.375 8.6114 31.4719C7.70831 30.5689 7.70831 29.1154 7.70831 26.2084V19.6711Z" stroke="#1C1C1C" strokeWidth="2"/>
            <path d="M22.3541 32.375V24.125C22.3541 23.5727 21.9064 23.125 21.3541 23.125H15.6458C15.0935 23.125 14.6458 23.5727 14.6458 24.125V32.375" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}