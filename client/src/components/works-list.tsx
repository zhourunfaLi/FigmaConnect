import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal } from 'lucide-react';
import { type Artwork } from "@shared/schema"; // Added import from original file

const GRID_CONFIG = {
  BASE_HEIGHT: 300,
  TABLET_SCALE: 1.2,
  DESKTOP_SCALE: 1.4
};

//type Artwork = { //Removed type definition as it is already imported
//  id: string;
//  imageId: number;
//  title: string;
//  description: string;
//  themeId: string;
//};

type WorksListProps = {
  category?: string;
  layout?: 'waterfall' | 'grid';
  className?: string;
};

export function WorksList({ category = 'latest', layout = 'waterfall', className }: WorksListProps) {
  const [wideHeight, setWideHeight] = useState(GRID_CONFIG.BASE_HEIGHT);
  const [artworks] = useState<Artwork[]>([{
    id: '1',
    imageId: 1,
    title: '示例作品',
    description: '示例描述',
    themeId: 'art'
  }]);

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

  return (
    <div className={cn("min-h-screen p-4", className)}>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="break-inside-avoid mb-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={`/images/artwork-${artwork.imageId}.jpg`}
                alt={artwork.title}
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="text-white font-medium">{artwork.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}