import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Share2, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";

// Constants for layout configuration
const GRID_CONFIG = {
  MOBILE_COLUMNS: 2,
  TABLET_COLUMNS: 3,
  DESKTOP_COLUMNS: 4,
  GROUP_SIZE: 7,
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

// Advertisement component
function AdCard() {
  return (
    <div className="w-full mb-4">
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

export function ArtworkItem({ 
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
      { rootMargin: '50px' }
    );

    const element = document.getElementById(`artwork-${artwork.id}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [artwork.id]);

  const imageUrl = artwork.imageUrl || `/src/assets/design/works-${String((index % 8) + 1).padStart(2, '0')}.png`;

  return (
    <Link 
      to={`/works/${artwork.id}`}
      className={cn(
        "break-inside-avoid mb-4 group relative",
        isWide && "column-span-all"
      )}
      style={{
        columnSpan: isWide ? "all" : "1"
      }}
    >
      <div 
        id={`artwork-${artwork.id}`}
        className="w-full relative overflow-hidden rounded-xl"
        style={{ 
          height: isWide ? `${wideHeight}px` : undefined,
          aspectRatio: isWide ? undefined : artwork.aspectRatio,
        }}
      >
        {(!isVisible || !imageLoaded) && (
          <Skeleton 
            className={cn(
              "absolute inset-0 rounded-xl",
              !imageLoaded && "animate-pulse"
            )}
          />
        )}

        {isVisible && (
          <>
            <img
              src={imageUrl}
              alt={artwork.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
                imageLoaded ? "opacity-100" : "opacity-0",
                "group-hover:scale-105"
              )}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />

            {/* Labels */}
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

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div className="flex justify-end items-start">
                <div className="flex gap-2">
                  <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-medium line-clamp-2">
                  {artwork.title}
                </h3>
                <p className="text-white/80 text-sm line-clamp-2">
                  {artwork.description}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Title and options */}
      <div className="flex justify-between items-center px-2 mt-2 group-hover:opacity-0 transition-opacity duration-300">
        <div className="text-sm text-[#111111] font-medium leading-5 truncate">
          {artwork.title}
        </div>
        <button className="flex gap-1 p-1 hover:bg-black/5 rounded-full transition-colors">
          <MoreHorizontal className="w-4 h-4 text-[#111111]" />
        </button>
      </div>
    </Link>
  );
}

export default function WorksList({ artworks, className }: WorksListProps) {
  const [wideHeight, setWideHeight] = useState(GRID_CONFIG.BASE_HEIGHT);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setWideHeight(GRID_CONFIG.BASE_HEIGHT);
      } else if (width < 1024) {
        setWideHeight(GRID_CONFIG.BASE_HEIGHT * GRID_CONFIG.TABLET_SCALE);
      } else {
        setWideHeight(GRID_CONFIG.BASE_HEIGHT * GRID_CONFIG.DESKTOP_SCALE);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // 确保横向编号顺序
  const columnsCount = window.innerWidth < 768 ? GRID_CONFIG.MOBILE_COLUMNS : 
                      window.innerWidth < 1024 ? GRID_CONFIG.TABLET_COLUMNS : 
                      GRID_CONFIG.DESKTOP_COLUMNS;
  const rowsCount = Math.ceil(30 / columnsCount);

  // 生成横向编号的作品数组
  const displayArtworks = Array.from({ length: 30 }, (_, index) => {
    // 计算横向顺序的新索引
    // 例如对于3列布局：index=0 时 originalIndex=0, index=1 时 originalIndex=3, index=2 时 originalIndex=6
    const row = index % rowsCount;
    const col = Math.floor(index / rowsCount);
    const originalIndex = col + row * columnsCount;

    // 第一列的每第3个作品是宽幅
    const isWide = col === 0 && (row + 1) % 3 === 0;

    return {
      ...artworks[originalIndex % artworks.length],
      id: originalIndex + 1,  // 保持横向编号
      aspectRatio: isWide ? 2.4 : ARTWORK_ASPECT_RATIOS[index % ARTWORK_ASPECT_RATIOS.length],
      isWide
    };
  });

  return (
    <div 
      className={cn(
        "columns-2 md:columns-3 lg:columns-4 gap-4 px-4 pb-20",
        className
      )}
    >
      {displayArtworks.map((artwork, index) => {
        const content = [];

        // Add artwork
        content.push(
          <ArtworkItem 
            key={artwork.id}
            artwork={artwork}
            isWide={artwork.isWide}
            wideHeight={wideHeight}
            index={index}
          />
        );

        // Add advertisement after every 6 artworks (before wide artwork)
        if ((index + 1) % 6 === 0) {
          content.push(
            <div key={`ad-${index}`} className="break-inside-avoid mb-4">
              <AdCard />
            </div>
          );
        }

        return content;
      }).flat()}
    </div>
  );
}