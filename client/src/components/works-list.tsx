import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

export default function WorksList({ artworks, className }: WorksListProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20", className)}>
      {artworks.map((artwork) => (
        <div key={artwork.id} className="flex flex-col gap-3">
          <div className="relative aspect-[3/4] w-full">
            <img
              src={artwork.imageUrl || `/works-0${(artwork.id % 8) + 1}.png`}
              alt={artwork.title}
              className="w-full h-full object-cover rounded-[18px]"
            />
            {artwork.isPremium && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-[#EB9800] text-white text-xs font-medium rounded-md">
                SVIP
              </div>
            )}
          </div>
          <div className="flex justify-between items-center px-2">
            <div className="text-sm text-[#111111] font-medium leading-5 truncate">
              {artwork.title}
            </div>
            <button className="flex gap-1 p-1 hover:bg-black/5 rounded-full transition-colors">
              <div className="w-1 h-1 rounded-full bg-[#111111]" />
              <div className="w-1 h-1 rounded-full bg-[#111111]" />
              <div className="w-1 h-1 rounded-full bg-[#111111]" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}