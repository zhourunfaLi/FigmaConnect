
import { useState, useEffect } from 'react';
import { MoreHorizontal, Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type WorksListProps = {
  artworks: any[];
  className?: string;
};

const GRID_CONFIG = {
  BASE_HEIGHT: 280,
  TABLET_SCALE: 1.2,
  DESKTOP_SCALE: 1.4,
  GROUP_SIZE: 7
};

const ARTWORK_ASPECT_RATIOS = [1.33, 1.5, 1.25, 1.6, 1.4, 1.8];

function ArtworkItem({ artwork, isWide, wideHeight, index }: any) {
  return (
    <div className="group relative break-inside-avoid mb-4">
      <div 
        className="relative w-full rounded-xl overflow-hidden bg-white"
        style={{
          height: isWide ? wideHeight : undefined,
          aspectRatio: isWide ? undefined : artwork.aspectRatio
        }}
      >
        <img 
          src={artwork.imageUrl || `https://source.unsplash.com/random/800x${Math.floor(800/artwork.aspectRatio)}?art`} 
          alt={artwork.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          <div className="flex justify-end items-start gap-2">
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Heart className="w-4 h-4 text-white" />
            </button>
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-medium line-clamp-2">{artwork.title}</h3>
            <p className="text-white/80 text-sm line-clamp-2">{artwork.description}</p>
          </div>
        </div>

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
      </div>

      <div className="flex justify-between items-center px-2 mt-2">
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
  const [wideHeight, setWideHeight] = useState(GRID_CONFIG.BASE_HEIGHT);

  useEffect(() => {
    const updateWideHeight = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setWideHeight(GRID_CONFIG.BASE_HEIGHT);
      } else if (width < 1024) {
        setWideHeight(GRID_CONFIG.BASE_HEIGHT * GRID_CONFIG.TABLET_SCALE);
      } else {
        setWideHeight(GRID_CONFIG.BASE_HEIGHT * GRID_CONFIG.DESKTOP_SCALE);
      }
    };

    updateWideHeight();
    window.addEventListener('resize', updateWideHeight);
    return () => window.removeEventListener('resize', updateWideHeight);
  }, []);

  const displayArtworks = Array.from({ length: Math.min(30, artworks.length) }, (_, index) => {
    const isWide = (index + 1) % GRID_CONFIG.GROUP_SIZE === 0;
    return {
      ...artworks[index % artworks.length],
      id: index + 1,
      aspectRatio: isWide ? 2.4 : ARTWORK_ASPECT_RATIOS[index % ARTWORK_ASPECT_RATIOS.length],
      isWide
    };
  });

  return (
    <div className={cn("columns-2 md:columns-3 lg:columns-4 gap-4 px-2", className)}>
      {displayArtworks.map((artwork, index) => (
        <ArtworkItem 
          key={artwork.id}
          artwork={artwork}
          isWide={artwork.isWide}
          wideHeight={wideHeight}
          index={index}
        />
      ))}
    </div>
  );
}
