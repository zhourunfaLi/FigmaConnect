import React from "react";
import { type Artwork, type Theme } from "@shared/schema";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { useLocation } from "wouter";

type GridListProps = {
  artworks: Theme[] | Artwork[];
  className?: string;
  title?: string;
};

export default function GridList({ artworks, className, title }: GridListProps) {
  const isThemeData = Array.isArray(artworks) && artworks.length > 0 && 'artworks' in artworks[0];

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
        </div>
        
        {/* 标题和更多按钮 - 在图片容器外面 */}
        <div className="flex justify-between items-center px-2 mt-3">
          <div className="text-sm text-[#111111] font-medium leading-5 truncate">
            {artwork.title}
          </div>
          <button className="flex gap-1 p-1 hover:bg-black/5 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-[#111111]" />
          </button>
        </div>

        {/* 标题和更多按钮 - 在图片容器外面 */}
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