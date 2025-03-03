import React, { useState, useRef } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, thumbnailUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="w-full relative">
      <div className="relative">
        {!isPlaying && thumbnailUrl && (
          <img 
            src={thumbnailUrl} 
            alt="Video thumbnail" 
            className="w-full h-full object-cover rounded-lg"
          />
        )}
        <video
          ref={videoRef}
          src={videoUrl}
          className={`w-full h-full object-cover rounded-lg ${!isPlaying && thumbnailUrl ? 'hidden' : ''}`}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
        <div className={`absolute inset-0 bg-black/30 rounded-lg ${isPlaying ? 'hidden' : ''}`}></div>
      </div>

      {/* 播放按钮 */}
      <button
        onClick={togglePlay}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-red-500 rounded-full p-3"
      >
        {!isPlaying ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 20.5714L6 3.42859L18.8571 12L6 20.5714Z" stroke="#FF0000" strokeWidth="2.05714" strokeMiterlimit="10" strokeLinecap="square"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="4" width="4" height="16" rx="1" fill="#FF0000"/>
            <rect x="14" y="4" width="4" height="16" rx="1" fill="#FF0000"/>
          </svg>
        )}
      </button>

      {/* 视频控制栏 */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={togglePlay} className="focus:outline-none">
            {!isPlaying ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.75 12.8572L3.75 2.14288L11.7857 7.50003L3.75 12.8572Z" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="2" width="3" height="11" rx="0.5" fill="white"/>
                <rect x="9" y="2" width="3" height="11" rx="0.5" fill="white"/>
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-32 h-1 bg-gray-500 rounded-full cursor-pointer"
          />
          <button className="focus:outline-none">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.75 11.25L9.0625 7.5L3.75 3.75L3.75 11.25ZM5 6.1625L6.89375 7.5L5 8.8375L5 6.1625ZM10 3.75L11.25 3.75L11.25 11.25H10L10 3.75Z" fill="white"/>
            </svg>
          </button>
          <button className="focus:outline-none">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_89_373)">
              <path d="M9.10718 9.64288L9.10718 12.8572L4.82146 9.64288H1.60718L1.60718 5.35717L4.82146 5.35717L9.10718 2.14288V5.35717" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
              <path d="M10.1786 7.5L13.3929 7.5" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
              </g>
              <defs>
              <clipPath id="clip0_89_373">
              <rect width="15" height="15" fill="white"/>
              </clipPath>
              </defs>
            </svg>
          </button>
        </div>
        <div>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="flex space-x-4">
          <button className="focus:outline-none">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.28575 12.3215C4.28575 10.8423 3.08628 9.64288 1.60718 9.64288" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
            </svg>
          </button>
          <button className="focus:outline-none">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.49997 9.10717C8.38757 9.10717 9.10711 8.38763 9.10711 7.50003C9.10711 6.61243 8.38757 5.89288 7.49997 5.89288C6.61236 5.89288 5.89282 6.61243 5.89282 7.50003C5.89282 8.38763 6.61236 9.10717 7.49997 9.10717Z" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
            </svg>
          </button>
          <button className="focus:outline-none">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.89282 9.10712L2.14282 12.8571" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10"/>
              <path d="M12.8572 2.14288L9.10718 5.89288" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10"/>
              <path d="M9.10718 9.10712L12.8572 12.8571" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10"/>
              <path d="M2.14282 2.14288L5.89282 5.89288" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;