import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import React, { useLayoutEffect, useRef } from "react";

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

// 广告卡片组件 - 展示广告内容
function AdCard() {
  return (
    <div className="w-full mb-6">
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
  const containerRef = useRef<HTMLDivElement>(null);
  const columnHeights = useRef<number[]>([]);

  // 生成展示用的作品数组，为每个作品添加唯一ID、宽高比和是否为宽幅作品标识
  const displayArtworks = Array.from({ length: 20 }, (_, index) => {
    // 确保在宽幅作品前有2的倍数的普通作品
    const isWide = (index + 1) % 8 === 0; // 每8个作品放置一个宽幅作品
    return {
      ...artworks[index % artworks.length],
      id: index + 1,
      aspectRatio: isWide ? 2 : [3/4, 4/5, 2/3, 5/4, 1][index % 5],
      isWide
    };
  });

  // 优化布局间距的函数
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const items = Array.from(container.children) as HTMLElement[];
    const gap = 24; // 默认间距

    // 获取列数
    const computedStyle = window.getComputedStyle(container);
    const columnCount = parseInt(computedStyle.columnCount || '2');

    // 初始化列高度数组
    columnHeights.current = Array(columnCount).fill(0);

    items.forEach((item, index) => {
      const itemHeight = item.offsetHeight;
      const isWideItem = item.classList.contains('wide-item');

      if (isWideItem) {
        // 宽幅作品处理
        const minHeightColumn = Math.min(...columnHeights.current);
        const columnIndex = columnHeights.current.indexOf(minHeightColumn);

        // 智能间距调整：根据相邻列的高度差异动态计算
        const neighboringHeights = columnHeights.current.filter((_, i) => 
          Math.abs(i - columnIndex) <= 1
        );
        const heightVariance = Math.max(...neighboringHeights) - Math.min(...neighboringHeights);

        // 如果高度差异过大，添加补偿间距
        if (heightVariance > gap * 2) {
          const compensation = Math.min(heightVariance * 0.3, gap * 2);
          item.style.marginTop = `${compensation}px`;
        }

        // 更新所有列的高度，保持一致性
        const newHeight = minHeightColumn + itemHeight + gap;
        columnHeights.current = columnHeights.current.map(() => newHeight);
      } else {
        // 普通作品处理：寻找最矮的列
        const minHeight = Math.min(...columnHeights.current);
        const columnIndex = columnHeights.current.indexOf(minHeight);

        // 更新列高度
        columnHeights.current[columnIndex] = minHeight + itemHeight + gap;
      }
    });
  }, [displayArtworks]);

  // 生成作品卡片和广告的混合内容
  const contentWithAds = displayArtworks.reduce((acc: React.ReactNode[], artwork, index) => {
    // 添加作品卡片
    acc.push(
      <div 
        key={artwork.id} 
        className={cn(
          "mb-6 break-inside-avoid",
          artwork.isWide ? "!w-[calc(200%+1.5rem)] clear-both wide-item" : "w-full"
        )}
        style={{
          breakBefore: artwork.isWide ? 'column' : 'auto'
        }}
      >
        {/* 作品图片容器 */}
        <div 
          className="relative w-full"
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
      acc.push(<AdCard key={`ad-${index}`} />);
    }

    return acc;
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "columns-2 md:columns-3 lg:columns-4 gap-6 pb-20",
        className
      )}
    >
      {contentWithAds}
    </div>
  );
}