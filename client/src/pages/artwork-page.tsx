import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type Artwork } from "@shared/schema";
import VideoPlayer from "@/components/video-player";
import CommentSection from "@/components/comment-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

export default function ArtworkPage() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [zoom, setZoom] = useState(1);

  const { data: artwork, isError, error } = useQuery<Artwork>({
    queryKey: [`/api/artworks/${id}`],
    enabled: id > 0,
  });

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {(error as Error).message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>

          <div className="relative mb-6">
            <AspectRatio ratio={4/3}>
              <div 
                className="w-full h-full overflow-auto bg-gray-100 rounded-lg"
                style={{ position: 'relative' }}
              >
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-contain transition-transform duration-200 ease-out"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: '0 0',
                    maxWidth: 'none',
                    maxHeight: 'none'
                  }}
                />
              </div>
            </AspectRatio>

            <div className="flex items-center gap-4 mt-4">
              <ZoomOut className="w-4 h-4 text-gray-500" />
              <Slider
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                min={1}
                max={4}
                step={0.1}
                className="w-48"
              />
              <ZoomIn className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            {artwork.description}
          </p>

          {artwork.videoUrl && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Video Presentation</h2>
              <VideoPlayer url={artwork.videoUrl} />
            </div>
          )}

          <CommentSection artworkId={artwork.id} />
        </CardContent>
      </Card>
    </div>
  );
}