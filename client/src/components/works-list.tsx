import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Heart, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Artwork = {
  id: string;
  title: string;
  description: string;
  isPremium?: boolean;
  imageUrl: string; // Added imageUrl field
};

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

function ArtworkItem({ 
  artwork, 
  index 
}: { 
  artwork: Artwork;
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

  return (
    <div 
      id={`artwork-${artwork.id}`}
      className="break-inside-avoid mb-4 group"
    >
      <div className="w-full relative overflow-hidden rounded-xl aspect-[3/4]">
        {(!isVisible || !imageLoaded) && (
          <Skeleton className="absolute inset-0 rounded-xl" />
        )}

        {isVisible && (
          <>
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
                imageLoaded ? "opacity-100" : "opacity-0",
                "group-hover:scale-105"
              )}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />

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

export function WorksList({ artworks, className }: WorksListProps) {
  return (
    <div className={cn("columns-2 md:columns-3 lg:columns-4 gap-4 p-4", className)}>
      {artworks.map((artwork, index) => (
        <ArtworkItem key={artwork.id} artwork={artwork} index={index} />
      ))}
    </div>
  );
}