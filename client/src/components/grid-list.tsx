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

import { useAds } from '@/contexts/ad-context';
import { AdCard } from './ad-card';

// AdCard 组件已经从 './ad-card' 导入，无需重复定义


export default function GridList({ artworks, className, title }: GridListProps) {
  const isThemeData = Array.isArray(artworks) && artworks.length > 0 && 'artworks' in artworks[0];

  const ArtworkCard = ({ artwork, index }: { artwork: Artwork; index: number }) => {
    const [, navigate] = useLocation();

    const handleArtworkClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 优先使用imageId作为数字ID，这是服务器需要的
      let numericId = artwork.imageId;

      // 如果没有imageId，尝试从复合ID中提取
      if (!numericId && typeof artwork.id === 'string' && artwork.id.includes('-')) {
        const parts = artwork.id.split('-');
        if (parts.length >= 2) {
          numericId = parseInt(parts[1]);
        }
      }

      // 如果artwork.id本身就是数字，则直接使用
      if (!numericId && typeof artwork.id === 'number') {
        numericId = artwork.id;
      }

      // 最后验证ID有效性
      if (!numericId || isNaN(Number(numericId))) {
        console.error('无法访问作品：ID无效', artwork);
        alert('无法访问作品：ID无效');
        return;
      }

      console.log(`点击作品，导航到ID: ${numericId}，原始ID: ${artwork.id}`);
      navigate(`/artwork/${numericId}`);
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
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-md">
              <div className="absolute top-2 right-2 flex gap-2 group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Heart className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-medium">{artwork.title}</h3>
                <p className="text-white/80 text-xs mt-1">探索艺术的奇妙世界</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-2 mt-3 group-hover:opacity-0 transition-opacity duration-300">
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
              {(() => {
                // 使用广告配置
                {/* 广告相关代码在这里 */}

                // 在组件顶部使用 useAds hook
                const { getAdConfigForPage, isAdminMode } = useAds();
                const adConfig = getAdConfigForPage('theme');

                // 创建一个包含广告的数组
                const withAds = [...theme.artworks];

                // 如果广告已启用，则添加广告
                if (adConfig?.isEnabled) {
                  // 每隔 adInterval 项插入一个广告
                  const adInterval = adConfig.adInterval || 3;
                  for (let i = adInterval; i < withAds.length; i += adInterval) {
                    withAds.splice(i, 0, { id: `ad-${i}`, isAd: true } as any);
                  }
                }

                // 如果是管理员模式且启用了广告，显示广告位置指示器
                const showAdPositionIndicators = isAdminMode && adConfig?.isEnabled;

                return withAds.map((item, index) => 
                  (item as any).isAd ? (
                    <AdCard key={item.id} variant={index % 3 === 0 ? "square" : "standard"} />
                  ) : (
                    <ArtworkCard key={item.id} artwork={item as Artwork} index={index} />
                  )
                );
              })()}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // 普通网格布局
  const withAds = [...(artworks as Artwork[])];
  const adInterval = Math.floor(Math.random() * 4) + 5;
  for (let i = adInterval; i < withAds.length; i += adInterval) {
    withAds.splice(i, 0, { id: `ad-${i}`, isAd: true } as any);
  }

  return (
    <div className={cn("space-y-8", className)}>
      {title && (
        <h2 className="text-2xl font-bold px-4">{title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-[8px]">
        {withAds.map((item, index) =>
          (item as any).isAd ? (
            <AdCard key={item.id} variant={index % 3 === 0 ? "square" : "standard"} />
          ) : (
            <ArtworkCard key={item.id} artwork={item as Artwork} index={index} />
          )
        )}
      </div>
    </div>
  );
}