import { FC } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Play, Volume2, Maximize, Heart, Share2, MessageCircle } from 'lucide-react';
import React, { useState } from "react";

// Modified STATIC_ARTWORK to include only necessary fields from original
const STATIC_ARTWORK = {
  id: 1,
  title: "蒙娜丽莎",
  imageUrl: "/src/assets/design/works-01.png",
  description: "《蒙娜丽莎》是意大利文艺复兴时期画家列奥纳多·达·芬奇的著名画作。",
  videoUrl: "/src/assets/design/works-02.png",
};

const WorkDetails: FC = () => {
  // 状态管理
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    // 主容器 - 响应式布局
    <div className="min-h-screen bg-[#EEEAE2] py-8 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* 作品展示区 */}
        <section className="mb-8">
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src={STATIC_ARTWORK.imageUrl}
              alt={STATIC_ARTWORK.title}
              className="w-full h-auto object-cover"
            />
            {/* 缩放控制 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <button className="p-2 bg-[#C1AB09] text-white rounded-full">
                <Minus className="w-4 h-4" />
              </button>
              <span className="bg-[#C1AB09] text-white px-4 py-1 rounded-full">
                {zoom.toFixed(1)}x
              </span>
              <button className="p-2 bg-[#C1AB09] text-white rounded-full">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 视频播放区 */}
        <section className="mb-8">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
            <img
              src={STATIC_ARTWORK.videoUrl}
              alt="视频预览"
              className="w-full h-full object-cover opacity-70"
            />
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Play className="w-12 h-12 text-white" />
            </button>
            {/* 视频控制栏 */}
            <div className="absolute bottom-0 w-full px-4 py-2 bg-black/50 flex items-center gap-4">
              <Volume2 className="w-4 h-4 text-white" />
              <div className="flex-1 h-1 bg-white/30">
                <div className="w-1/3 h-full bg-white" />
              </div>
              <Maximize className="w-4 h-4 text-white" />
            </div>
          </div>
        </section>

        {/* 作品信息 */}
        <section className="mb-8">
          <h1 className="text-xl font-bold mb-4">{STATIC_ARTWORK.title}</h1>
          <p className="text-gray-600">{STATIC_ARTWORK.description}</p>
        </section>

        {/* 互动按钮 */}
        <section className="flex justify-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            喜欢
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            分享
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            评论
          </Button>
        </section>
      </div>
    </div>
  );
};

export default WorkDetails;