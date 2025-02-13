
import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

export default function WorksList({ artworks, className }: WorksListProps) {
  return (
    <div className={cn("space-y-6 pb-20", className)}>
      {artworks.map((artwork) => (
        <div key={artwork.id} className="flex flex-col gap-1">
          <div className="w-full">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-[163px] object-cover rounded-[18px]"
            />
          </div>
          <div className="flex justify-between items-center px-[7px]">
            <div className="text-[14px] text-[#111111] leading-5">
              {artwork.title}
            </div>
            <div className="flex gap-2">
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
