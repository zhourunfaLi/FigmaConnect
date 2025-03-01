
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

  const ArtworkCard = ({ artwork, index }: { artwork: Artwork; index: number }) => {
    const [, navigate] = useLocation();

    const handleArtworkClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/artwork/${artwork.id}`);
    };

    return (
      <div className="group cursor-pointer" onClick={handleArtworkClick}>
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={new URL(`../assets/design/img/art-${String(artwork.id % 8 + 1).padStart(2, '0')}.jpg`, import.meta.url).href}
            alt={artwork.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* 悬浮遮罩层 - 与最新页完全一致 */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
            {/* 顶部操作按钮 */}
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
            
            {/* 底部内容 - 悬浮时显示 */}
            <div className="space-y-2">
              <h3 className="text-white font-medium line-clamp-2">
                {artwork.title}
              </h3>
              <p className="text-white/80 text-sm line-clamp-2">
                {artwork.description || `探索${artwork.title}的艺术世界`}
              </p>
            </div>
          </div>
        </div>

        {/* 标题和选项 - 正常状态下显示 */}
        <div className="mt-2 flex justify-between items-center">
          <h3 className="text-sm font-medium line-clamp-1">{artwork.title}</h3>
          <button className="p-1.5 rounded-full hover:bg-accent transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isThemeData) {
      // 如果是主题数据，显示主题及其作品
      return (
        <div className="space-y-8">
          {(artworks as Theme[]).map((theme, index) => (
            <div key={theme.id} className="space-y-4">
              <h2 className="text-lg font-medium">{theme.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {theme.artworks.map((artwork, artworkIndex) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    index={artworkIndex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // 如果是作品数据，直接显示作品网格
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(artworks as Artwork[]).map((artwork, index) => (
            <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {title && <h2 className="text-lg font-medium">{title}</h2>}
      {renderContent()}
    </div>
  );
}
