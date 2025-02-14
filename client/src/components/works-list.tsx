import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Share2, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";

// Common aspect ratios for artwork display
const ARTWORK_ASPECT_RATIOS = [3/4, 4/5, 2/3, 5/4, 1] as const;

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

function ArtworkItem({ 
  artwork, 
  index,
  style
}: { 
  artwork: Artwork & { aspectRatio: number }; 
  index: number;
  style?: React.CSSProperties;
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

  return (
    <div className="relative" style={style}>
      <Link 
        to={`/works/${artwork.id}`}
        className="group block w-full"
      >
        <div 
          id={`artwork-${artwork.id}`}
          className="relative overflow-hidden rounded-lg"
          style={{ aspectRatio: artwork.aspectRatio }}
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
        <div className="flex justify-between items-center mt-[2px] group-hover:opacity-0 transition-opacity duration-300">
          <div className="text-sm text-[#111111] font-medium leading-5 truncate">
            {artwork.title}
          </div>
          <button className="flex gap-1 p-1 hover:bg-black/5 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-[#111111]" />
          </button>
        </div>
      </Link>
    </div>
  );
}

export default function WorksList({ artworks, className }: WorksListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(4);
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const [artworkPositions, setArtworkPositions] = useState<{[key: number]: {top: number, left: number}}>({});

  // Update column count based on screen size
  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      if (width < 768) setColumnCount(2);
      else if (width < 1024) setColumnCount(3);
      else setColumnCount(4);
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // Transform artwork data for display
  const displayArtworks = Array.from({ length: 30 }, (_, index) => ({
    ...artworks[index % artworks.length],
    id: index + 1,
    aspectRatio: ARTWORK_ASPECT_RATIOS[index % ARTWORK_ASPECT_RATIOS.length],
  }));

  // Calculate artwork positions
  useEffect(() => {
    if (!containerRef.current) return;

    const gap = 8; // 0.5rem
    const containerPadding = 8; // 0.5rem padding on each side
    const availableWidth = Math.min(1440, containerRef.current.offsetWidth) - (containerPadding * 2);
    const columnWidth = Math.floor((availableWidth - (gap * (columnCount - 1))) / columnCount);

    const heights = new Array(columnCount).fill(0);
    const positions: {[key: number]: {top: number, left: number}} = {};

    displayArtworks.forEach((artwork, index) => {
      const columnIndex = index % columnCount;
      const left = Math.round(columnIndex * (columnWidth + gap));
      const top = heights[columnIndex];

      // Calculate height including the gap and add extra vertical spacing
      const itemHeight = Math.round((columnWidth / artwork.aspectRatio)) + 24; // 增加垂直间距为24px
      heights[columnIndex] += itemHeight;

      positions[index] = { 
        top, 
        left: left + containerPadding // Add padding to left position
      };
    });

    setColumnHeights(heights);
    setArtworkPositions(positions);
  }, [columnCount, displayArtworks.length, containerRef.current?.offsetWidth]);

  return (
    <div className="w-full max-w-[1440px] mx-auto">
      <div 
        ref={containerRef}
        className={cn(
          "relative mx-auto px-8", // 8px padding on each side
          className
        )}
        style={{
          height: Math.max(...columnHeights) + 'px'
        }}
      >
        {displayArtworks.map((artwork, index) => {
          const position = artworkPositions[index];
          if (!position) return null;

          return (
            <ArtworkItem 
              key={artwork.id}
              artwork={artwork}
              index={index}
              style={{
                position: 'absolute',
                width: `calc((100% - ${(columnCount - 1) * 8}px - 16px) / ${columnCount})`, // Updated width calculation
                transform: `translate3d(${position.left}px, ${position.top}px, 0)`,
                transition: 'transform 0.2s ease-out'
              }}
            />
          );
        })}
      </div>
    </div>
  );
}