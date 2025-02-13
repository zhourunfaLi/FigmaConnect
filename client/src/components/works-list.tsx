
import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

export default function WorksList({ artworks, className }: WorksListProps) {
  return (
    <div className={cn("columns-2 md:columns-3 lg:columns-4 gap-4 pb-20 space-y-4", className)}>
      {artworks.map((artwork) => (
        <div key={artwork.id} className="flex flex-col gap-1 break-inside-avoid inline-block w-full">
          <div className="relative w-full">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full object-cover rounded-[18px]"
            />
            {artwork.isPremium && (
              <div className="absolute top-2 left-2 text-white text-[14px] text-shadow">
                SVIP
              </div>
            )}
          </div>
          <div className="flex justify-between items-center px-[7px]">
            <div className="text-[14px] text-[#111111] leading-5 truncate">
              {artwork.title}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <div className="w-[3px] h-[3px] rounded-full bg-[#111111]" />
              <div className="w-[3px] h-[3px] rounded-full bg-[#111111]" />
              <div className="w-[3px] h-[3px] rounded-full bg-[#111111]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
