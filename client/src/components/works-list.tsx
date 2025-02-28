import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Share2, MoreHorizontal } from "lucide-react";
import { useNavigate } from 'react-router-dom'; // Added import

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

// Advertisement component for the artwork grid
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
  const navigate = useNavigate(); // Added useNavigate hook
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

  const handleArtworkClick = () => {
    navigate(`/artwork/${artwork.id}`);
  };

  return (
    <div 
      id={`artwork-${artwork.id}`}
      className={cn(
        "break-inside-avoid mb-4 group cursor-pointer", // Added cursor-pointer
        isWide && "-ml-[4px]"
      )}
      style={{
        columnSpan: isWide ? "all" : "none",
        breakBefore: isWide ? "column" : "auto",
        position: 'relative'
      }}
      onClick={handleArtworkClick} // Added onClick handler
    >
      <div 
        className="w-full relative overflow-hidden rounded-xl"
        style={{ 
          height: 'auto',
          aspectRatio: artwork.aspectRatio,
        }}
      >
        {/* Loading skeleton */}
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
              src={artwork.themeId === "art" 
                ? new URL(`../assets/design/img/art-${String(artwork.imageId).padStart(2, '0')}.jpg`, import.meta.url).href
                : new URL(`../assets/design/img/city-${String(artwork.imageId).padStart(2, '0')}.jpg`, import.meta.url).href}
              alt={artwork.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
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
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div className="flex justify-end items-start">
                {/* Action buttons */}
                <div className="flex gap-2">
                  <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
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
          </>
        )}
      </div>

      {/* Title and options (visible when not hovering) */}
      <div className="flex justify-between items-center px-2 mt-2 group-hover:opacity-0 transition-opacity duration-300">
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

  // Combine artworks with advertisements
  const contentWithAds = displayArtworks.map((artwork, index) => (
    <ArtworkItem 
      key={artwork.id}
      artwork={artwork}
      isWide={false}
      wideHeight={wideHeight}
      index={index}
    />
  ));


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