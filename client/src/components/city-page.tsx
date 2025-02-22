
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import type { Artwork } from "@shared/schema";

interface CityPageProps {
  artworks: Artwork[];
}

export function CityPage({ artworks }: CityPageProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  return (
    <div className="w-full h-full p-6">
      <ScrollArea className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <Card key={artwork.id} className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-square">
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-4 text-white absolute bottom-0">
                    <h3 className="text-lg font-bold">{artwork.title}</h3>
                    <p className="text-sm">{artwork.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
