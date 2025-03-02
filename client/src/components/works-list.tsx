import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Share2, MoreHorizontal } from "lucide-react";
import { useLocation } from "wouter";
import { useAds } from '@/contexts/ad-context';

// Constants for layout configuration
const GRID_CONFIG = {
  MOBILE_COLUMNS: 2,
  TABLET_COLUMNS: 3,
  DESKTOP_COLUMNS: 4,
  GROUP_SIZE: 7, // 2*3 + 1 pattern
  BASE_HEIGHT: 128,
  TABLET_SCALE: 1.5,
  DESKTOP_SCALE: 2,
} as const;

// Common aspect ratios for artwork display
const ARTWORK_ASPECT_RATIOS = [3/4, 4/5, 2/3, 5/4, 1] as const;

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

import { AdCard } from "./ad-card";

// Artwork component with lazy loading and animation
function ArtworkItem({ 
  artwork, 
  isWide, 
  wideHeight, 
  index 
}: { 
  artwork: Artwork & { isWide: boolean; aspectRatio: number }; 
  isWide: boolean; 
  wideHeight: number;
  index: number;
}) {
  const [, setLocation] = useLocation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px'
      }
    );

    const element = document.getElementById(`artwork-${artwork.id}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [artwork.id]);

  const handleArtworkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocation(`/artwork/${artwork.id}`);
  };

  return (
    <div 
      id={`artwork-${artwork.id}`}
      className={cn(
        "break-inside-avoid mb-4 group cursor-pointer", 
        isWide && "-ml-[4px]"
      )}
      style={{
        columnSpan: isWide ? "all" : "none",
        breakBefore: isWide ? "column" : "auto",
        position: 'relative'
      }}
      onClick={handleArtworkClick} 
    >
      <div 
        className="w-full relative overflow-hidden rounded-md" 
        style={{ 
          height: 'auto',
          aspectRatio: artwork.aspectRatio,
        }}
      >
        {(!isVisible || !imageLoaded) && (
          <Skeleton 
            className={cn(
              "absolute inset-0 rounded-md", 
              !imageLoaded && "animate-pulse"
            )}
          />
        )}

        {isVisible && (
          <>
            <div className="w-full h-full relative rounded-md overflow-hidden"> 
              <img
                src={artwork.themeId === "art" 
                  ? new URL(`../assets/design/img/art-${String(artwork.imageId).padStart(2, '0')}.jpg`, import.meta.url).href
                  : new URL(`../assets/design/img/city-${String(artwork.imageId).padStart(2, '0')}.jpg`, import.meta.url).href}
                alt={artwork.title}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300", 
                  imageLoaded ? "opacity-100" : "opacity-0",
                  "group-hover:scale-105"
                )}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />

              {/* Always visible labels */}
              <div className="absolute top-2 left-2 flex gap-2">
                <div className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
                  #{index + 1}
                </div>
                {artwork.isPremium && (
                  <div className="px-2 py-1 bg-[#EB9800] text-white text-xs font-medium rounded-md">
                    SVIP
                  </div>
                )}
              </div>

              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none group-hover:pointer-events-auto rounded-md">
                <div className="flex justify-end items-start">
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                    {/* <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-white" />
                    </button> */}
                  </div>
                </div>

                {/* Bottom content */}
                <div className="space-y-2">
                  <h3 className="text-white font-medium line-clamp-2">
                    {artwork.title}
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-2">
                    {artwork.description}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 标题和更多按钮 - 在卡片外面 */}
      <div className="flex justify-between items-center px-2 mt-3 transition-opacity duration-300 group-hover:opacity-0">
        <div className="text-sm text-[#111111] font-medium leading-5 truncate">
          {artwork.title}
        </div>
        <button className="flex gap-1 p-1 hover:bg-black/5 rounded-full transition-colors">
          <MoreHorizontal className="w-4 h-4 text-[#111111]" />
        </button>
      </div>
    </div>
  );
}

export default function WorksList({ artworks, className }: WorksListProps) {
  const [wideHeight, setWideHeight] = useState(GRID_CONFIG.BASE_HEIGHT);

  // Update wide artwork height based on screen size
  useEffect(() => {
    const updateWideHeight = () => {
      const width = window.innerWidth;
      if (width < 768) { // Mobile: 2 columns
        setWideHeight(GRID_CONFIG.BASE_HEIGHT);
      } else if (width < 1024) { // Tablet: 3 columns
        setWideHeight(GRID_CONFIG.BASE_HEIGHT * GRID_CONFIG.TABLET_SCALE);
      } else { // Desktop: 4 columns
        setWideHeight(GRID_CONFIG.BASE_HEIGHT * GRID_CONFIG.DESKTOP_SCALE);
      }
    };

    updateWideHeight();
    window.addEventListener('resize', updateWideHeight);
    return () => window.removeEventListener('resize', updateWideHeight);
  }, []);

  // Get unique random numbers for art and city images
  const getUniqueRandoms = (max: number, count: number) => {
    const numbers = Array.from({ length: max }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, count);
  };

  // Get 24 unique artworks (19 art + 5 city)
  const artIds = getUniqueRandoms(19, 19);
  const cityIds = getUniqueRandoms(20, 5);

  // 定义一组不同的宽高比
  const aspectRatios = [0.8, 1, 1.2, 1.5, 0.7, 1.3, 0.9, 1.1];

  const displayArtworks = [
    ...artIds.map((id, index) => ({
      ...artworks[0],
      id: `art-${id}-${index}`,
      imageId: id,
      title: `艺术作品 ${id}`,
      description: "现代艺术创作",
      themeId: "art", 
      aspectRatio: aspectRatios[id % aspectRatios.length],
      isWide: false
    })),
    ...cityIds.map((id, index) => ({
      ...artworks[0],
      id: `city-${id}-${index}`,
      imageId: id,
      title: `城市风光 ${id}`,
      description: "城市建筑与人文景观",
      themeId: "city",
      aspectRatio: aspectRatios[id % aspectRatios.length],
      isWide: false
    }))
  ].sort(() => Math.random() - 0.5);

  // 使用广告配置
  {/* 广告相关代码在这里 */}

  // 在组件顶部使用 useAds hook
  const { getAdConfigForPage, isAdminMode } = useAds();
  const adConfig = getAdConfigForPage('works');
  
  // 确保所有作品都有一个正确的imageId，用于API调用
  const processedArtworks = displayArtworks.map(artwork => {
    // 将复合ID（如"art-12-15"）分解，确保imageId可用
    if (typeof artwork.id === 'string' && artwork.id.includes('-')) {
      const parts = artwork.id.split('-');
      const themeId = parts[0];  // "art"或"city"
      const imageId = parseInt(parts[1]); // 数字部分
      const index = parts[2] ? parseInt(parts[2]) : 0; // 索引部分
      
      if (!artwork.imageId && !isNaN(imageId)) {
        console.log(`设置作品imageId: ${artwork.id} -> imageId: ${imageId}`);
      }
      
      return {
        ...artwork,
        themeId: themeId || artwork.themeId,
        imageId: artwork.imageId || imageId || 1,
        originalId: artwork.id, // 保存原始复合ID
      };
    }
    return artwork;
  });
  
  // 添加调试日志
  console.log("WorksList显示的作品数据(处理后):", processedArtworks);
  console.log("原始作品数据:", artworks);

  // 插入广告
  const adPositions = adConfig?.isEnabled ? [...adConfig.adPositions] : [];

  // 如果是管理员模式且启用了广告，显示广告位置指示器
  const showAdPositionIndicators = isAdminMode && adConfig?.isEnabled;

  // Combine artworks with advertisements
  const contentWithAds = [];
  displayArtworks.forEach((artwork, index) => {
    contentWithAds.push(
      <ArtworkItem 
        key={artwork.id}
        artwork={artwork}
        isWide={false}
        wideHeight={wideHeight}
        index={index}
      />
    );

    // 在指定位置后添加广告
    if (adPositions.includes(index)) {
      contentWithAds.push(
        <AdCard 
          key={`ad-${index}`} 
          variant={index % 2 === 0 ? "standard" : "square"} 
          className="mb-4 break-inside-avoid"
        />
      );
    }
  });


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