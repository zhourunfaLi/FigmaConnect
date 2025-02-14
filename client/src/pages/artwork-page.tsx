import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type Artwork } from "@shared/schema";
import VideoPlayer from "@/components/video-player";
import CommentSection from "@/components/comment-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ZoomIn,
  ZoomOut,
  Heart,
  Share2,
  MessageCircle,
  Calendar,
  Ruler,
  PaintBucket,
  ChevronRight
} from "lucide-react";
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Main Content */}
      <Card>
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{artwork.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div>
                  <p className="text-sm font-medium">艺术家名称</p>
                  <p className="text-xs text-muted-foreground">创作于 2024</p>
                </div>
              </div>
            </div>
            {artwork.isPremium && (
              <Badge variant="secondary" className="bg-[#EB9800] text-white hover:bg-[#EB9800]/90">
                SVIP
              </Badge>
            )}
          </div>

          {/* Image Viewer */}
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

            {/* Zoom Controls */}
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

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <Button variant="outline" className="flex-1">
              <Heart className="w-4 h-4 mr-2" />
              收藏
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              评论
            </Button>
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">作品介绍</h2>
              <p className="text-lg text-muted-foreground">
                {artwork.description}
              </p>
            </div>

            <Separator />

            {/* Technical Details */}
            <div>
              <h2 className="text-2xl font-bold mb-4">创作信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">创作时间</p>
                    <p className="font-medium">2024年2月</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">尺寸</p>
                    <p className="font-medium">100cm × 80cm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PaintBucket className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">材质</p>
                    <p className="font-medium">油画</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Video Section */}
            {artwork.videoUrl && (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-4">视频展示</h2>
                  <VideoPlayer url={artwork.videoUrl} />
                </div>
                <Separator />
              </>
            )}

            {/* Comments Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">评论区</h2>
              <CommentSection artworkId={artwork.id} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Artworks */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">相关作品</h2>
            <Button variant="ghost" className="text-muted-foreground">
              查看更多 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Placeholder for related artworks */}
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/3] bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}