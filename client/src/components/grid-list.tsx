
import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";

type Theme = {
  id: string;
  title: string;
  artworks: Artwork[];
};

type GridListProps = {
  artworks: Theme[] | Artwork[];
  className?: string;
  title?: string;
};

export default function GridList({ artworks, className, title }: GridListProps) {
  // 检查是否为专题数据
  const isThemeData = Array.isArray(artworks) && artworks.length > 0 && 'artworks' in artworks[0];
  
  if (isThemeData) {
    const themes = artworks as Theme[];
    return (
      <div className={cn("space-y-12", className)}>
        {themes.map((theme) => (
          <section key={theme.id} className="space-y-6">
            <h2 className="text-2xl font-bold px-4">{theme.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
              {theme.artworks.map((artwork) => (
                <div key={artwork.id} className="space-y-2">
                  <div className="aspect-square overflow-hidden rounded-xl">
                    <img
                      src={artwork.themeId === "art" 
                        ? new URL(`../assets/design/img/art-${String(artwork.id % 3 + 1).padStart(2, '0')}.jpg`, import.meta.url).href
                        : new URL(`../assets/design/img/city-${String(artwork.id % 7 + 1).padStart(2, '0')}.jpg`, import.meta.url).href}
                      alt={artwork.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="text-sm font-medium">{artwork.title}</h3>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // 普通网格布局
  return (
    <div className={cn("space-y-8", className)}>
      {title && (
        <h2 className="text-2xl font-bold px-4">{title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {(artworks as Artwork[]).map((artwork) => (
          <div key={artwork.id} className="space-y-2">
            <div className="aspect-square overflow-hidden rounded-xl">
              <img
                src={artwork.themeId === "art" 
                  ? new URL(`../assets/design/img/art-${String(artwork.id % 3 + 1).padStart(2, '0')}.jpg`, import.meta.url).href
                  : new URL(`../assets/design/img/city-${String(artwork.id % 7 + 1).padStart(2, '0')}.jpg`, import.meta.url).href}
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
