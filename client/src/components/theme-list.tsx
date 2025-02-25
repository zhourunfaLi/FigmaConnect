
import { type Artwork } from "@shared/schema";

type Theme = {
  id: string;
  title: string;
  artworks: Artwork[];
};

export default function ThemeList({ themes }: { themes: Theme[] }) {
  return (
    <div className="space-y-12 px-4">
      {themes.map((theme) => (
        <div key={theme.id} className="space-y-4">
          <h2 className="text-2xl font-bold text-black/80">{theme.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {theme.artworks.map((artwork) => (
              <div key={artwork.id} className="space-y-2">
                <div className="aspect-square overflow-hidden rounded-xl">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-sm font-medium text-black/70">{artwork.title}</h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
