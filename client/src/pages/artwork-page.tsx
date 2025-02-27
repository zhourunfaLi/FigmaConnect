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
                    transformOrigin: 'center center',
                    maxWidth: zoom > 1 ? 'none' : '100%',
                    maxHeight: zoom > 1 ? 'none' : '100%'
                  }}
                />
              </div>
            </AspectRatio>
            <div className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm rounded-lg p-1 shadow-md">
              <button 
                onClick={() => setZoom(prev => Math.max(1, prev - 0.25))}
                className="p-1 hover:bg-gray-200 rounded-lg"
                disabled={zoom <= 1}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setZoom(prev => Math.min(4, prev + 0.25))}
                className="p-1 hover:bg-gray-200 rounded-lg"
                disabled={zoom >= 4}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

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

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <p className="text-lg text-muted-foreground flex-1">
              {artwork.description}
            </p>
            
            <div className="flex-shrink-0 space-y-4 min-w-[200px]">
              {artwork.category_id && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">分类</h3>
                  <Link href={`/category/${artwork.category_id}`}>
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-primary/20 transition-colors">
                      查看相关作品
                    </span>
                  </Link>
                </div>
              )}
              
              {artwork.isPremium && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">特别内容</h3>
                  <span className="inline-block bg-amber-500/10 text-amber-500 px-3 py-1 rounded-md text-sm">
                    高级作品
                  </span>
                </div>
              )}
            </div>
          </div>

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