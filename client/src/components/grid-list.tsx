
import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";

type GridListProps = {
  artworks: Artwork[];
  className?: string;
  title?: string;
};

export default function GridList({ artworks, className, title }: GridListProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {title && (
        <h2 className="text-2xl font-bold px-4">{title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="space-y-2">
            <div className="aspect-square overflow-hidden rounded-xl">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="text-sm font-medium">{artwork.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
