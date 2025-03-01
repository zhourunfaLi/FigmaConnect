import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Share2, MoreHorizontal } from "lucide-react";
import { useLocation } from "wouter";

// Constants for layout configuration
const GRID_CONFIG = {
  MOBILE_COLUMNS: 2,
  TABLET_COLUMNS: 3,
  DESKTOP_COLUMNS: 4,
  GROUP_SIZE: 7, // 2*3 + 1 pattern
  BASE_HEIGHT: 128,
  TABLET_SCALE: 1.5,
  DESKTOP_SCALE: 2,
} as const;

// Common aspect ratios for artwork display
const ARTWORK_ASPECT_RATIOS = [3/4, 4/5, 2/3, 5/4, 1] as const;

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
  title?: string;
};

// Advertisement component for the artwork grid
function AdCard() {
  return (
    <div className="w-full">
      <div className="relative aspect-[3/4] w-full bg-white rounded-md overflow-hidden border border-black/5">
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


export default function WorksList({ artworks, className, title }: WorksListProps) {
  return (
    <div className={className}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            更多 <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map((artwork, index) => (
          <WorkCard key={artwork.id} artwork={artwork} index={index} />
        ))}
      </div>
    </div>
  );
}

function WorkCard({ artwork, index }: { artwork: Artwork; index: number }) {
  const [, navigate] = useLocation();

  const handleArtworkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/artwork/${artwork.id}`);
  };

  return (
    <div className="group cursor-pointer" onClick={handleArtworkClick}>
      <div className="w-full h-full relative">
        <div className="aspect-[3/4] overflow-hidden rounded-md">
          <img
            src={artwork.themeId === "art"
              ? new URL(`../assets/design/img/art-${String(artwork.id % 3 + 1).padStart(2, '0')}.jpg`, import.meta.url).href
              : new URL(`../assets/design/img/city-${String(artwork.id % 7 + 1).padStart(2, '0')}.jpg`, import.meta.url).href}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none group-hover:pointer-events-auto rounded-md">
            <div className="flex justify-end items-start">
              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Heart className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 className="mt-2 text-gray-800 dark:text-gray-200 font-medium">
        {artwork.title}
      </h3>
    </div>
  );
}