import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import React from "react";

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

// 广告卡片组件 - 展示广告内容
function AdCard() {
  return (
    <div className="w-full">
      <div className="relative aspect-[3/4] w-full bg-white rounded-[18px] overflow-hidden border border-black/5">
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
          广告
        </div>
        {/* Google广告组件占位 */}
        <div className="w-full h-full flex items-center justify-center text-black/30">
          Google Ads
        </div>
      </div>
      <div className="flex justify-between items-center px-2 mt-4">
        <div className="text-sm text-[#111111] font-medium leading-5 truncate">
          推广内容
        </div>
      </div>
    </div>
  );
}

export default function WorksList({ artworks, className }: WorksListProps) {
  // 生成作品数组，确保宽幅作品只出现在第一列开始位置
  const displayArtworks = Array.from({ length: 30 }, (_, index) => {
    // 每8个作品的第一个位置放置宽幅作品
    const isWide = index % 8 === 0 && index !== 0;
    return {
      ...artworks[index % artworks.length],
      id: index + 1,
      aspectRatio: isWide ? 2 : [3/4, 4/5, 2/3, 5/4, 1][index % 5],
      isWide
    };
  });

  // 生成作品卡片和广告的混合内容
  const contentWithAds = displayArtworks.reduce((acc: React.ReactNode[], artwork, index) => {
    // 添加作品卡片
    acc.push(
      <div 
        key={artwork.id} 
        className={cn(
          "break-inside-avoid mb-6",
          artwork.isWide && "!w-[calc(200%+24px)] !ml-[-12px]"
        )}
        style={{
          columnSpan: artwork.isWide ? "all" : "none",
          breakBefore: artwork.isWide ? "column" : "auto",
          pageBreakBefore: artwork.isWide ? "always" : "auto"
        }}
      >
        <div 
          className="w-full"
          style={{ 
            height: artwork.isWide ? "240px" : "auto",
            aspectRatio: artwork.isWide ? undefined : artwork.aspectRatio
          }}
        >
          <img
            src={`./src/assets/design/works-${String(artwork.id % 8 + 1).padStart(2, '0')}.png`}
            alt={artwork.title}
            className="w-full h-full rounded-[18px] object-cover"
          />
          {/* 编号标签 */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
            #{index + 1}
          </div>
          {/* SVIP标签 */}
          {artwork.isPremium && (
            <div className="absolute top-2 left-[4.5rem] px-2 py-1 bg-[#EB9800] text-white text-xs font-medium rounded-md">
              SVIP
            </div>
          )}
        </div>
        {/* 作品标题和操作按钮 */}
        <div className="flex justify-between items-center px-2 mt-4">
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
      acc.push(
        <div key={`ad-${index}`} className="break-inside-avoid mb-6">
          <AdCard />
        </div>
      );
    }

    return acc;
  }, []);

  return (
    <div 
      className={cn(
        "columns-2 md:columns-3 lg:columns-4 gap-6 pb-20",
        className
      )}
    >
      {contentWithAds}
    </div>
  );
}