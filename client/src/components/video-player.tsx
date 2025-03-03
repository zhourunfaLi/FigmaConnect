import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function VideoPlayer({ url }: { url: string }) {
  return (
    <AspectRatio ratio={16/9}>
      <video
        controls
        className="w-full h-full rounded-lg"
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </AspectRatio>
  );
}
import React, { useState, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
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
        {!isPlaying && (
          <img 
            src={thumbnailUrl} 
            alt="Video thumbnail" 
            className="w-full h-full object-cover rounded-lg"
          />
        )}
        <video
          ref={videoRef}
          src={videoUrl}
          className={`w-full h-full object-cover rounded-lg ${!isPlaying ? 'hidden' : ''}`}
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

      {/* 控制条 */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 rounded-b-lg">
        <div className="relative h-2 w-full bg-red-200 rounded-full mb-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="h-2 bg-red-600 rounded-full"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          ></div>
          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"
            style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-white text-xs">
          <div className="flex space-x-4">
            <button className="focus:outline-none">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.75 12.8572L3.75 2.14288L11.7857 7.50003L3.75 12.8572Z" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg>
            </button>
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
                <path d="M6.42861 12.3214C6.42861 9.65839 4.27021 7.5 1.60718 7.5" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M1.60713 12.8571C1.90299 12.8571 2.14284 12.6173 2.14284 12.3214C2.14284 12.0256 1.90299 11.7857 1.60713 11.7857C1.31126 11.7857 1.07141 12.0256 1.07141 12.3214C1.07141 12.6173 1.31126 12.8571 1.60713 12.8571Z" fill="white"/>
                <path d="M2.14282 5.35716L2.14282 2.67859L13.3928 2.67859L13.3928 10.7143L8.57139 10.7143" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg>
            </button>
            <button className="focus:outline-none">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.49997 9.10717C8.38757 9.10717 9.10711 8.38763 9.10711 7.50003C9.10711 6.61243 8.38757 5.89288 7.49997 5.89288C6.61236 5.89288 5.89282 6.61243 5.89282 7.50003C5.89282 8.38763 6.61236 9.10717 7.49997 9.10717Z" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M11.7857 7.49997C11.7851 7.19136 11.7513 6.8837 11.685 6.58229L13.1389 5.4814L12.0675 3.62569L10.3838 4.33605C9.9278 3.91803 9.38661 3.60384 8.79751 3.41515L8.57144 1.60712L6.42858 1.60712L6.20251 3.41515C5.61341 3.60384 5.07223 3.91803 4.61626 4.33605L2.93251 3.62569L1.86108 5.4814L3.31501 6.58229C3.18076 7.18672 3.18076 7.81323 3.31501 8.41765L1.86108 9.51854L2.93251 11.3743L4.61626 10.6639C5.07223 11.0819 5.61341 11.3961 6.20251 11.5848L6.42858 13.3928H8.57144L8.79751 11.5848C9.38661 11.3961 9.9278 11.0819 10.3838 10.6639L12.0675 11.3743L13.1389 9.51854L11.685 8.41765C11.7513 8.11625 11.7851 7.80859 11.7857 7.49997Z" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg>
            </button>
            <button className="focus:outline-none">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.89282 9.10712L2.14282 12.8571" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10"/>
                <path d="M12.8572 2.14288L9.10718 5.89288" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10"/>
                <path d="M9.10718 9.10712L12.8572 12.8571" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10"/>
                <path d="M2.14282 2.14288L5.89282 5.89288" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10"/>
                <path d="M9.64282 2.14288L12.8571 2.14288V5.35717" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M5.35711 12.8572H2.14282L2.14282 9.64288" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M2.14282 5.35717L2.14282 2.14288L5.35711 2.14288" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M12.8571 9.64288V12.8572H9.64282" stroke="white" strokeWidth="1.28571" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
