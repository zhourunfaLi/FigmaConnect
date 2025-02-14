import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Share2, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";

// Common aspect ratios for artwork display
const ARTWORK_ASPECT_RATIOS = [3/4, 4/5, 2/3, 5/4, 1] as const;

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

// Advertisement component for the artwork grid
function AdCard() {
  return (
    <div className="w-full break-inside-avoid mb-9">
      <div className="relative aspect-[3/4] w-full bg-white rounded-lg overflow-hidden border border-black/5">
        {/* Ad Image */}
        <img 
          src="https://placehold.co/400x600/EEEAE2/111111?text=广告" 
          alt="广告内容"
          className="w-full h-full object-cover"
        />

        {/* Ad Label */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
          广告
        </div>

        {/* Hover Effect - Similar to artwork cards */}
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          <div className="space-y-2 mt-auto">
            <h3 className="text-white font-medium line-clamp-2">
              推广内容标题
            </h3>
            <p className="text-white/80 text-sm line-clamp-2">
              了解更多详情
            </p>
          </div>
        </div>
      </div>

      {/* Title Bar - Similar to artwork cards */}
      <div className="flex justify-between items-center mt-[2px]">
        <div className="text-sm text-[#111111] font-medium leading-5 truncate">
          推广内容
        </div>
        <button className="flex gap-1 p-1 hover:bg-black/5 rounded-full transition-colors">
          <MoreHorizontal className="w-4 h-4 text-[#111111]" />
        </button>
      </div>
    </div>
  );
}

function calculateHorizontalIndex(index: number, totalColumns: number): number {
  const row = Math.floor(index / totalColumns);
  const col = index % totalColumns;
  return row * totalColumns + col + 1;
}

function ArtworkItem({ 
  artwork, 
  index,
  isWide 
}: { 
  artwork: Artwork & { aspectRatio: number }; 
  index: number;
  isWide?: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const getColumnCount = () => {
    if (typeof window === 'undefined') return 2;
    const width = window.innerWidth;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    return 2;
  };

  const [columnCount, setColumnCount] = useState(getColumnCount());

  useEffect(() => {
    const updateColumnCount = () => {
      setColumnCount(getColumnCount());
    };

    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

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

  const horizontalIndex = calculateHorizontalIndex(index, columnCount);

  return (
    <Link 
      to={`/works/${artwork.id}`}
      className={cn(
        "group block w-full break-inside-avoid mb-9",
        isWide && "column-span-all"
      )}
    >
      <div 
        id={`artwork-${artwork.id}`}
        className="relative overflow-hidden rounded-lg"
        style={{ 
          aspectRatio: isWide ? 2.4 : artwork.aspectRatio
        }}
      >
        {(!isVisible || !imageLoaded) && (
          <Skeleton 
            className={cn(
              "absolute inset-0 rounded-lg",
              !imageLoaded && "animate-pulse"
            )}
          />
        )}

        {isVisible && (
          <>
            <img
              src={`/src/assets/design/works-${String((index % 8) + 1).padStart(2, '0')}.png`}
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
                #{horizontalIndex}
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
      <div className="flex justify-between items-center mt-[2px] group-hover:opacity-0 transition-opacity duration-300">
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
  // Transform artwork data for display and insert ads
  const contentItems = Array.from({ length: 30 }, (_, index) => {
    // Insert an ad after every 6 artworks
    if ((index + 1) % 6 === 0) {
      return {
        type: 'ad',
        id: `ad-${Math.floor(index / 6)}`
      };
    }

    // Calculate the actual artwork index (excluding ad positions)
    const artworkIndex = index - Math.floor(index / 6);
    const isWide = ((artworkIndex + 1) % 7 === 0);

    return {
      type: 'artwork',
      data: {
        ...artworks[artworkIndex % artworks.length],
        id: artworkIndex + 1,
        aspectRatio: ARTWORK_ASPECT_RATIOS[artworkIndex % ARTWORK_ASPECT_RATIOS.length],
        isWide
      }
    };
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto">
      <div 
        className={cn(
          "columns-2 md:columns-3 lg:columns-4 gap-[10px] px-2",
          className
        )}
      >
        {contentItems.map((item, index) => (
          item.type === 'ad' ? (
            <AdCard key={item.id} />
          ) : (
            <ArtworkItem 
              key={item.data.id}
              artwork={item.data}
              index={index - Math.floor(index / 6)} // Adjust index for horizontal numbering
              isWide={item.data.isWide}
            />
          )
        ))}
      </div>
    </div>
  );
}