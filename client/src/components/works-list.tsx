import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Share2, MoreHorizontal } from "lucide-react";
import { useNavigate } from 'react-router-dom'; 

// Constants for layout configuration
const GRID_CONFIG = {
  BASE_HEIGHT: 300, // Base height for standard cards
  TABLET_SCALE: 1.2, // Multiplier for tablet view
  DESKTOP_SCALE: 1.4, // Multiplier for desktop view
  AD_FREQUENCY: 8, // Show an ad after every 8 artworks
};

// Type definitions
type Artwork = {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  imageId?: number;
  themeId?: string;
  likes?: number;
  is_premium?: boolean;
};

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

// Advertisement component for the artwork grid
function AdCard() {
  return (
    <div className="w-full">
      <div className="relative aspect-[3/4] w-full bg-white rounded-xl overflow-hidden border border-black/5">
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

// Artwork component with lazy loading and hover interactions
function ArtworkItem({ artwork, index }: { artwork: Artwork; index: number }) {
  // 使用条件导航 - 避免在非Router环境下使用
  const navigateIfAvailable = () => {
    try {
      const navigate = useNavigate();
      return () => navigate(`/artwork/${artwork.id}`);
    } catch (e) {
      return () => console.log("Navigation not available");
    }
  };

  const handleCardClick = navigateIfAvailable();

  // Generate a placeholder color based on the artwork ID for loading state
  const placeholderColor = `hsl(${(artwork.id * 40) % 360}, 70%, 80%)`;

  return (
    <div className="w-full group cursor-pointer" onClick={handleCardClick}>
      {/* Artwork image with hover effects */}
      <div className="relative aspect-[3/4] w-full bg-white rounded-xl overflow-hidden border border-black/5">
        {/* Premium badge */}
        {artwork.is_premium && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-[#EB9800] text-white text-xs font-medium rounded-md z-10">
            会员
          </div>
        )}

        {/* Artwork image */}
        <div className="w-full h-full bg-black/5">
          {/* Image with lazy loading */}
          <img
            src={artwork.imageUrl || `/src/assets/design/img/art-${String((artwork.imageId || index % 30) + 1).padStart(2, '0')}.jpg`}
            alt={artwork.title}
            className="w-full h-full object-cover opacity-0 transition-opacity duration-300"
            onLoad={(e) => {
              (e.target as HTMLImageElement).classList.remove('opacity-0');
              (e.target as HTMLImageElement).classList.add('opacity-100');
            }}
            style={{ backgroundColor: placeholderColor }}
          />
        </div>

        {/* Hover overlay with options */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
          {/* Top row: empty */}
          <div></div>

          {/* Bottom row: action buttons */}
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                <Heart className="w-4 h-4 text-[#111111]" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                <Share2 className="w-4 h-4 text-[#111111]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Title and options (visible when not hovering) */}
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
}

function WorksList({ artworks, className }: WorksListProps) {
  const [wideHeight, setWideHeight] = useState(GRID_CONFIG.BASE_HEIGHT);

  // Update wide artwork height based on screen size
  useEffect(() => {
    const updateWideHeight = () => {
      const width = window.innerWidth;
      if (width < 768) { // Mobile: 2 columns
        setWideHeight(GRID_CONFIG.BASE_HEIGHT);
      } else if (width < 1024) { // Tablet: 3 columns
        setWideHeight(GRID_CONFIG.BASE_HEIGHT * GRID_CONFIG.TABLET_SCALE);
      } else { // Desktop: 4 columns
        setWideHeight(GRID_CONFIG.BASE_HEIGHT * GRID_CONFIG.DESKTOP_SCALE);
      }
    };

    updateWideHeight();
    window.addEventListener('resize', updateWideHeight);
    return () => window.removeEventListener('resize', updateWideHeight);
  }, []);

  // Insert ads into the content
  const contentWithAds = artworks.flatMap((artwork, index) => {
    const elements = [
      <ArtworkItem key={`artwork-${artwork.id}`} artwork={artwork} index={index} />
    ];

    // Add an ad after every N artworks (except the last one)
    if ((index + 1) % GRID_CONFIG.AD_FREQUENCY === 0 && index < artworks.length - 1) {
      elements.push(<AdCard key={`ad-${index}`} />);
    }

    return elements;
  });

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4",
        className
      )}
    >
      {contentWithAds}
    </div>
  );
}

export default WorksList;

function App() {
  const artworks = [{id:1, title: "test", description: "test", themeId: "art", is_premium: false, imageId: 1, imageUrl: "/src/assets/design/img/art-01.jpg"}]; // Example artwork data.  Replace with your actual data fetching.

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorksList artworks={artworks} />} />
        {/* Add other routes as needed */}
        <Route path="/artwork/:id" element={<div>Artwork Detail</div>} /> {/* Example artwork detail route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;