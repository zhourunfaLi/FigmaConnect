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

    // 提取有效的作品ID来导航
    let validId;
    
    console.log("处理作品导航, 作品数据:", artwork);
    
    // 优先使用数字ID (imageId)
    if (artwork.imageId && typeof artwork.imageId === 'number' && artwork.imageId > 0) {
      validId = artwork.imageId;
      console.log(`导航到作品: 使用imageId=${validId}`);
    } 
    // 如果有原始ID (originalId)，从中提取数字部分
    else if (artwork.originalId && typeof artwork.originalId === 'string') {
      // 处理originalId (art-123-45 格式)
      if (artwork.originalId.includes('-')) {
        const parts = artwork.originalId.split('-');
        // 优先使用第二部分作为ID
        if (parts.length >= 2 && !isNaN(parseInt(parts[1]))) {
          validId = parts[1]; 
          console.log(`导航到作品: 从originalId=${artwork.originalId}提取ID=${validId}`);
        }
        // 如果第二部分不是数字，尝试第三部分
        else if (parts.length >= 3 && !isNaN(parseInt(parts[2]))) {
          validId = parts[2];
          console.log(`导航到作品: 从originalId=${artwork.originalId}提取第三部分ID=${validId}`);
        }
        // 最后尝试第一部分
        else if (!isNaN(parseInt(parts[0]))) {
          validId = parts[0];
          console.log(`导航到作品: 从originalId=${artwork.originalId}提取第一部分ID=${validId}`);
        }
      } else if (!isNaN(parseInt(artwork.originalId))) {
        // 如果originalId本身就是数字
        validId = artwork.originalId;
        console.log(`导航到作品: 使用数字originalId=${validId}`);
      }
    }
    // 最后使用作品本身的ID
    else if (artwork.id) {
      // 处理字符串ID (包含横杠的情况)
      if (typeof artwork.id === 'string') {
        if (artwork.id.includes('-')) {
          const parts = artwork.id.split('-');
          if (parts.length >= 2 && !isNaN(parseInt(parts[1]))) {
            validId = parts[1];
            console.log(`导航到作品: 从id=${artwork.id}提取ID=${validId}`);
          } else if (!isNaN(parseInt(parts[0]))) {
            validId = parts[0];
            console.log(`导航到作品: 从id=${artwork.id}提取第一部分=${validId}`);
          }
        } else if (!isNaN(parseInt(artwork.id))) {
          // 字符串但可以解析为数字
          validId = artwork.id;
          console.log(`导航到作品: 使用字符串数字id=${validId}`);
        }
      } else {
        // 直接使用非字符串ID (可能是数字)
        validId = artwork.id;
        console.log(`导航到作品: 使用id=${validId}`);
      }
    }

    if (validId) {
      setLocation(`/artwork/${validId}`);
    } else {
      console.error("作品没有有效ID，无法导航", artwork);
    }
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
    ...artIds.map((imageId, index) => ({
      ...artworks[0],
      id: `art-${imageId}-${index}`, // 使用唯一组合键
      imageId: imageId,
      title: `艺术作品 ${imageId}`,
      description: "现代艺术创作",
      themeId: "art", 
      aspectRatio: aspectRatios[imageId % aspectRatios.length],
      isWide: false
    })),
    ...cityIds.map((imageId, index) => ({
      ...artworks[0],
      id: `city-${imageId}-${index}`, // 使用唯一组合键
      imageId: imageId,
      title: `城市风光 ${imageId}`,
      description: "城市建筑与人文景观",
      themeId: "city",
      aspectRatio: aspectRatios[imageId % aspectRatios.length],
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
        // 不覆盖原始ID，保持复合ID格式，在点击处理时提取数字部分
      };
    }

    // 确保没有复合ID的作品也有imageId
    if (!artwork.imageId && typeof artwork.id === 'number') {
      return {
        ...artwork,
        imageId: artwork.id
      };
    }

    return artwork;
  });

  // 添加调试日志
  console.log("WorksList显示的作品数据:", processedArtworks.slice(0, 5));

  // 添加调试日志
  console.log("WorksList显示的作品数据(处理后):", processedArtworks);
  console.log("原始作品数据:", artworks);

  // 插入广告
  const adPositions = adConfig?.isEnabled ? [...adConfig.adPositions] : [];

  // 如果是管理员模式且启用了广告，显示广告位置指示器
  const showAdPositionIndicators = isAdminMode && adConfig?.isEnabled;

  // Combine artworks with advertisements
  const contentWithAds = [];
  processedArtworks.forEach((artwork, index) => { // Use processedArtworks here
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

// 处理作品数据，标准化格式
const processArtwork = (artwork: Artwork, options?: { themeId?: string; imageId?: number }) => {
    const { themeId, imageId } = options || {};

    if (artwork) {
      // 确保imageId是有效的数字，或者从id中提取
      let validImageId;
      
      // 优先使用传入的imageId
      if (typeof imageId === 'number' && !isNaN(imageId)) {
        validImageId = imageId;
      }
      // 其次使用作品自身的imageId
      else if (typeof artwork.imageId === 'number' && !isNaN(artwork.imageId)) {
        validImageId = artwork.imageId;
      }
      // 再尝试从复合ID中提取
      else if (typeof artwork.id === 'string' && artwork.id.includes('-')) {
        const parts = artwork.id.split('-');
        if (parts.length >= 2) {
          const extractedId = parseInt(parts[1]);
          if (!isNaN(extractedId)) {
            validImageId = extractedId;
            console.log(`从复合ID提取imageId: ${artwork.id} -> ${validImageId}`);
          }
        }
      }
      // 最后使用数字ID或默认值
      else if (typeof artwork.id === 'number') {
        validImageId = artwork.id;
      }
      // 兜底使用默认值
      else {
        validImageId = 1;
        console.warn(`无法提取有效imageId, 使用默认值: 1，原始ID: ${artwork.id}`);
      }

      console.log(`处理作品ID: ${artwork.id} -> ${validImageId}`);

      return {
        ...artwork,
        themeId: themeId || artwork.themeId,
        imageId: validImageId, // 确保设置了有效的数字ID
        originalId: artwork.id, // 保存原始复合ID
      };
    }
    return artwork; // return artwork if it's null or undefined
  };

const processArtworks = (artworks: any[]): Artwork[] => {
    if (!artworks || !Array.isArray(artworks)) return [];

    return artworks.map((artwork) => {
      // 不再对ID做特殊处理，保留原始ID
      return {
        ...artwork,
        themeId: artwork.themeId || "art",
        // 确保保留原始数字ID，这对于API请求至关重要
      };
    });
  };