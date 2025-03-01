import React from "react";
import { type Artwork, type Theme } from "@shared/schema";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Heart, Share2 } from "lucide-react";
import { useLocation } from "wouter";

type GridListProps = {
  artworks: Theme[] | Artwork[];
  className?: string;
  title?: string;
};

export default function GridList({ artworks, className, title }: GridListProps) {
  const isThemeData = Array.isArray(artworks) && artworks.length > 0 && 'artworks' in artworks[0];

  return (
    <div className={className}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            更多 <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {artworks.map((artwork, index) => (
          <ArtworkCard 
            key={artwork.id} 
            artwork={isThemeData ? (artwork as Theme).artworks[0] : (artwork as Artwork)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

const ArtworkCard = ({ artwork, index }: { artwork: Artwork; index: number }) => {
  const [, navigate] = useLocation();

  const handleArtworkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/artwork/${artwork.id}`);
  };

  return (
    <div className="break-inside-avoid mb-4 group cursor-pointer" onClick={handleArtworkClick}> 
      <div className="w-full relative">
        <div className="aspect-[3/4] overflow-hidden rounded-md">
          <img
            src={artwork.themeId === "art"
              ? new URL(`../assets/design/img/art-${String(artwork.id % 3 + 1).padStart(2, '0')}.jpg`, import.meta.url).href
              : new URL(`../assets/design/img/city-${String(artwork.id % 7 + 1).padStart(2, '0')}.jpg`, import.meta.url).href}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-md"></div>
        </div>

          {/* 悬浮遮罩层 - 鼠标悬浮时显示 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 rounded-md">
            {/* 点赞和分享按钮 */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button className="w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                </svg>
              </button>
              <button className="w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                </svg>
              </button>
            </div>
            
            <h3 className="text-white font-medium line-clamp-2 drop-shadow-md">
              {artwork.title}
            </h3>
            <p className="text-white/80 text-sm line-clamp-2 drop-shadow-md">
              {artwork.description || `探索艺术世界`}
            </p>
          </div>
        </div>

        {/* Title and options - moved outside the image container */}
        <div className="flex justify-between items-center px-2 mt-3">
          <div className="text-sm text-[#111111] font-medium leading-5 truncate">
            {artwork.title}
          </div>
          <button className="flex gap-1 p-1 hover:bg-black/5 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-[#111111]" />
          </button>
        </div>
      </div>
    );
  };

  if (isThemeData) {
    const themes = artworks as Theme[];
    return (
      <div className={cn("space-y-12", className)}>
        {themes.map((theme) => (
          <section key={theme.id} className="space-y-6">
            <h2 className="text-2xl font-bold px-4">{theme.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-[8px]">
              {theme.artworks.map((artwork, index) => (
                <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // 普通网格布局
  return (
    <div className={cn("space-y-8", className)}>
      {title && (
        <h2 className="text-2xl font-bold px-4">{title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-[8px]">
        {(artworks as Artwork[]).map((artwork, index) => (
          <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
        ))}
      </div>
    </div>
  );
}