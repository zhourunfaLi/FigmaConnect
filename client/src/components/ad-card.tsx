
import React from "react";
import { cn } from "@/lib/utils";

// Google广告卡片的样式规范
// https://support.google.com/adsense/answer/6002621

type AdCardProps = {
  className?: string;
  variant?: "standard" | "wide" | "square";
};

export function AdCard({ className, variant = "standard" }: AdCardProps) {
  // 根据不同变体设置不同的宽高比
  const aspectRatio = 
    variant === "wide" ? "aspect-[16/9]" : 
    variant === "square" ? "aspect-square" : 
    "aspect-[3/4]";
  
  return (
    <div className={cn("w-full group", className)}>
      <div className={cn(
        "relative w-full bg-gray-50 rounded-md overflow-hidden border border-black/5",
        aspectRatio
      )}>
        {/* 广告标识 */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md z-10">
          广告
        </div>
        
        {/* 模拟广告内容 */}
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          <div className="w-[80%] h-[60%] bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-sm">Ad</span>
          </div>
          <div className="mt-2 w-[80%] h-4 bg-gray-200 rounded-md"></div>
          <div className="mt-1 w-[60%] h-3 bg-gray-200 rounded-md"></div>
        </div>
        
        {/* 广告链接 */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          Google Ads
        </div>
      </div>
      
      {/* 卡片底部信息 */}
      <div className="flex justify-between items-center px-2 mt-3 transition-opacity duration-300 group-hover:opacity-0">
        <div className="text-sm text-[#111111] font-medium leading-5 truncate">
          推广内容
        </div>
      </div>
    </div>
  );
}
