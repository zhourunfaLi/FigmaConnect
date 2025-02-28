import React from "react";
import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Heart, Share2, MoreHorizontal } from "lucide-react";
import { useLocation } from 'wouter';

type Theme = {
  id: string;
  title: string;
  artworks: Artwork[];
};

type GridListProps = {
  artworks: Theme[] | Artwork[];
  className?: string;
  title?: string;
};

export default function GridList({ artworks, className, title }: GridListProps) {
  const isThemeData = Array.isArray(artworks) && artworks.length > 0 && 'artworks' in artworks[0];
  const isCityData = artworks.some(art => art.cityId);

  const ArtworkCard = ({ artwork, index }: { artwork: Artwork; index: number }) => {
    const [, navigate] = useLocation();

    const handleArtworkClick = () => {
      navigate(`/artwork/${artwork.id}`);
    };

    return (
      <div className="break-inside-avoid mb-4 group cursor-pointer" onClick={handleArtworkClick}> 
        <div className="w-full relative overflow-hidden rounded-xl">
          <div className="aspect-[3/4]">
            <img
              src={artwork.themeId === "art"
                ? new URL(`../assets/design/img/art-${String(artwork.id % 3 + 1).padStart(2, '0')}.jpg`, import.meta.url).href
                : new URL(`../assets/design/img/city-${String(artwork.id % 7 + 1).padStart(2, '0')}.jpg`, import.meta.url).href}
              alt={artwork.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
              {theme.artworks.map((artwork, index) => (
                <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // 城市布局
  if (isCityData) {
    return (
      <div className={cn("space-y-8", className)}>
        {artworks.map((artwork, index) => (
          <section key={artwork.id} className="space-y-4">
            <h3 className="text-lg px-4">{artwork.title}</h3>
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mx-4">
                <div className="aspect-[2/1]">
                  <img
                    src={new URL(`../assets/design/img/city-${String(artwork.id % 15 + 1).padStart(2, '0')}.jpg`, import.meta.url).href}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Labels */}
                <div className="absolute top-2 left-2 flex gap-2">
                  <div className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
                    #{index + 1}
                  </div>
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
                  </div>
                </div>
              </div>

              {/* Title and options */}
              <div className="flex justify-between items-center px-6 mt-2 group-hover:opacity-0 transition-opacity duration-300">
                <div className="text-sm text-[#111111] font-medium leading-5 truncate">
                  {artwork.title}
                </div>
                <button className="flex gap-1 p-1 hover:bg-black/5 rounded-full transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-[#111111]" />
                </button>
              </div>
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {(artworks as Artwork[]).map((artwork, index) => (
          <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
        ))}
      </div>
    </div>
  );
}