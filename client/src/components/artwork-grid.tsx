import { type Artwork } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function ArtworkGrid({ artworks }: { artworks: Artwork[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <Link key={artwork.id} to={`/works/${artwork.id}`}>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full aspect-[4/3] object-cover"
                />
                {artwork.isPremium && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2"
                  >
                    Premium
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <h3 className="font-medium">{artwork.title}</h3>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}