import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

function AdCard() {
  return (
    <div className="w-full">
      <div className="relative aspect-[3/4] w-full bg-white rounded-xl overflow-hidden border border-black/5">
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
          广告
        </div>
        <div className="w-full h-full flex items-center justify-center text-black/30">
          Google Ads
        </div>
      </div>
      <div className="flex justify-between items-center px-2 mt-2">
        <div className="text-sm text-[#111111] font-medium leading-5 truncate">
          推广内容
        </div>
      </div>
    </div>
  );
}

export default function WorksList({ artworks, className }: WorksListProps) {
  const [wideHeight, setWideHeight] = useState(128);

  useEffect(() => {
    const updateWideHeight = () => {
      const width = window.innerWidth;
      if (width < 768) { // 2列
        setWideHeight(128);
      } else if (width < 1024) { // 3列
        setWideHeight(128 * 1.5);
      } else { // 4列
        setWideHeight(128 * 2);
      }
    };

    updateWideHeight();
    window.addEventListener('resize', updateWideHeight);
    return () => window.removeEventListener('resize', updateWideHeight);
  }, []);

  // 使用2*3*n+1的布局规则重新组织作品
  const displayArtworks = Array.from({ length: 30 }, (_, index) => {
    // 计算当前位置是否应该是宽幅作品
    // 每7个作品（2*3+1）中的最后一个作为宽幅作品
    const isWide = (index + 1) % 7 === 0;
    return {
      ...artworks[index % artworks.length],
      id: index + 1,
      aspectRatio: isWide ? 2.4 : [3/4, 4/5, 2/3, 5/4, 1][index % 5],
      isWide
    };
  });

  const contentWithAds = displayArtworks.reduce((acc: React.ReactNode[], artwork, index) => {
    acc.push(
      <div 
        key={artwork.id} 
        className={cn(
          "break-inside-avoid mb-4",
          artwork.isWide && "-ml-[4px]"
        )}
        style={{
          columnSpan: artwork.isWide ? "all" : "none",
          breakBefore: artwork.isWide ? "column" : "auto",
          position: 'relative'
        }}
      >
        <div 
          className="w-full relative"
          style={{ 
            height: artwork.isWide ? `${wideHeight}px` : undefined,
            aspectRatio: artwork.isWide ? undefined : artwork.aspectRatio,
          }}
        >
          <img
            src={`./src/assets/design/works-${String(artwork.id % 8 + 1).padStart(2, '0')}.png`}
            alt={artwork.title}
            className="w-full h-full rounded-xl object-cover"
          />
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
            #{index + 1}
          </div>
          {artwork.isPremium && (
            <div className="absolute top-2 left-[4.5rem] px-2 py-1 bg-[#EB9800] text-white text-xs font-medium rounded-md">
              SVIP
            </div>
          )}
        </div>
        <div className="flex justify-between items-center px-2 mt-2">
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

    // 每6个作品后添加一个广告（调整为7个一组后，广告插入规则也相应调整）
    if ((index + 1) % 7 === 6) {
      acc.push(
        <div key={`ad-${index}`} className="break-inside-avoid mb-4">
          <AdCard />
        </div>
      );
    }

    return acc;
  }, []);

  return (
    <div 
      className={cn(
        "columns-2 md:columns-3 lg:columns-4 gap-4 px-[8px] pb-20",
        className
      )}
    >
      {contentWithAds}
    </div>
  );
}