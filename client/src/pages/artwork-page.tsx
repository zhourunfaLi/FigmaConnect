
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type Artwork } from "@shared/schema";
import VideoPlayer from "@/components/video-player";
import CommentSection from "@/components/comment-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ZoomIn, ZoomOut, Heart, Share2 } from "lucide-react";
import { useState } from "react";

export default function ArtworkPage() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [zoom, setZoom] = useState(1);

  const { data: artwork, isError, error, isLoading } = useQuery<Artwork>({
    queryKey: [`/api/artworks/${id}`],
    enabled: id > 0,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {(error as Error).message || "Failed to load artwork"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Artwork not found
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{artwork.title}</h1>
            {artwork.is_premium && (
              <Badge variant="secondary">SVIP</Badge>
            )}
          </div>

          <div className="relative mb-6 bg-gray-50 rounded-lg">
            <AspectRatio ratio={4/3}>
              <div 
                className="w-full h-full overflow-auto bg-gray-100 rounded-lg"
                style={{ position: 'relative' }}
              >
                <img
                  src={artwork.image_url}
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

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg p-2">
              <div className="flex items-center gap-4 flex-1">
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
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  收藏
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
              </div>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-lg text-muted-foreground">
              {artwork.description}
            </p>
          </div>

          {artwork.video_url && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">视频介绍</h2>
              <VideoPlayer url={artwork.video_url} />
            </div>
          )}

          <CommentSection artworkId={artwork.id} />
        </CardContent>
      </Card>
    </div>
  );
}
