import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import React from "react";

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

// 广告卡片组件
function AdCard() {
  return (
    <div className="mb-8 w-full">
      <div className="relative aspect-[3/4] w-full bg-white rounded-[18px] overflow-hidden border border-black/5">
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
          广告
        </div>
        {/* 这里是Google广告代码的占位符 */}
        <div className="w-full h-full flex items-center justify-center text-black/30">
          Google Ads
        </div>
      </div>
      <div className="flex justify-between items-center px-2 mt-3">
        <div className="text-sm text-[#111111] font-medium leading-5 truncate">
          推广内容
        </div>
      </div>
    </div>
  );
}

export default function WorksList({ artworks, className }: WorksListProps) {
  // 创建一个20个元素的数组来展示作品
  const displayArtworks = Array.from({ length: 20 }, (_, index) => ({
    ...artworks[index % artworks.length],
    id: index + 1,
    // 每5个作品中的第3个设置为双列宽度
    isWide: (index % 5) === 2
  }));

  // 在作品中随机插入广告
  const contentWithAds = displayArtworks.reduce((acc: React.ReactNode[], artwork, index) => {
    // 为宽图选择特定的图片
    const isWideImage = artwork.isWide;
    const imageNumber = isWideImage 
      ? (index % 2 === 0 ? '10' : '11') // 在宽图中交替使用works-10和works-11
      : String(artwork.id % 8 + 1).padStart(2, '0');

    acc.push(
      <div 
        key={artwork.id} 
        className={cn(
          "mb-8", // 增加底部间距
          artwork.isWide ? "col-span-2 w-[200%] break-inside-avoid" : "w-full"
        )}
      >
        <div className={cn(
          "relative w-full",
          artwork.isWide ? "aspect-[2.4/1]" : "aspect-[3/4]"
        )}>
          <img
            src={`./src/assets/design/works-${imageNumber}.png`}
            alt={artwork.title}
            className="w-full h-full object-cover rounded-[18px]"
          />
          {artwork.isPremium && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-[#EB9800] text-white text-xs font-medium rounded-md">
              SVIP
            </div>
          )}
        </div>
        <div className="flex justify-between items-center px-2 mt-3">
          <div className="text-sm text-[#111111] font-medium leading-5 truncate">
            {artwork.title}
          </div>
          <button className="flex gap-1 p-1 hover:bg-black/5 rounded-full transition-colors">
            <div className="w-1 h-1 rounded-full bg-[#111111]" />
            <div className="w-1 h-1 rounded-full bg-[#111111]" />
            <div className="w-1 h-1 rounded-full bg-[#111111]" />
          </button>
        </div>
      </div>
    );

    // 每6个作品后添加一个广告
    if ((index + 1) % 6 === 0) {
      acc.push(<AdCard key={`ad-${index}`} />);
    }

    return acc;
  }, []);

  return (
    <div className={cn(
      "columns-2 md:columns-3 lg:columns-4 gap-8 space-y-0 pb-20", // 增加列间距到gap-8
      className
    )}>
      {contentWithAds}
    </div>
  );
}