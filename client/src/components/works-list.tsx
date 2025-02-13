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
    <div className="w-full break-inside-avoid mb-6">
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
  // 生成展示用的作品数组，为每个作品添加唯一ID、宽高比和是否为宽幅作品标识
  const displayArtworks = Array.from({ length: 20 }, (_, index) => ({
    ...artworks[index % artworks.length],
    id: index + 1,
    aspectRatio: index % 7 === 3 ? 2 : [3/4, 4/5, 2/3, 5/4, 1][index % 5], // 每7个作品中的第4个是宽幅作品
    isWide: index % 7 === 3 // 标记宽幅作品
  }));

  // 生成作品卡片和广告的混合内容
  const contentWithAds = displayArtworks.reduce((acc: React.ReactNode[], artwork, index) => {
    // 添加作品卡片
    acc.push(
      <div 
        key={artwork.id} 
        className={cn(
          "break-inside-avoid mb-6",
          artwork.isWide ? "!w-[calc(200%+1.5rem)] relative left-0" : "w-full"
        )}
        style={{
          marginTop: artwork.isWide ? "2rem" : undefined
        }}
      >
        {/* 作品图片容器 */}
        <div 
          className="relative w-full"
          style={{ 
            height: artwork.isWide ? "240px" : "auto", // 宽幅作品使用固定高度
            aspectRatio: artwork.isWide ? undefined : artwork.aspectRatio
          }}
        >
          <img
            src={`./src/assets/design/works-${String(artwork.id % 8 + 1).padStart(2, '0')}.png`}
            alt={artwork.title}
            className="w-full h-full rounded-[18px] object-cover"
          />
          {/* SVIP标签 */}
          {artwork.isPremium && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-[#EB9800] text-white text-xs font-medium rounded-md">
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
      acc.push(<AdCard key={`ad-${index}`} />);
    }

    return acc;
  }, []);

  // 使用瀑布流布局展示作品和广告
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