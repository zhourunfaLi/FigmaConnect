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

function ArtworkItem({ 
  artwork, 
  index 
}: { 
  artwork: Artwork & { aspectRatio: number }; 
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
      className="group relative block w-full"
    >
      <div 
        id={`artwork-${artwork.id}`}
        className="relative overflow-hidden rounded-xl"
        style={{ 
          aspectRatio: artwork.aspectRatio,
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
      <div className="flex justify-between items-center mt-2 group-hover:opacity-0 transition-opacity duration-300">
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
  // Transform artwork data for display with horizontal numbering
  const displayArtworks = Array.from({ length: 30 }, (_, index) => ({
    ...artworks[index % artworks.length],
    id: index + 1,
    aspectRatio: ARTWORK_ASPECT_RATIOS[index % ARTWORK_ASPECT_RATIOS.length],
  }));

  return (
    <div 
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 pb-20",
        className
      )}
    >
      {displayArtworks.map((artwork, index) => (
        <ArtworkItem 
          key={artwork.id}
          artwork={artwork}
          index={index}
        />
      ))}
    </div>
  );
}