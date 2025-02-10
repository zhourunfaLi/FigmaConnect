import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type Artwork } from "@shared/schema";
import VideoPlayer from "@/components/video-player";
import CommentSection from "@/components/comment-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function ArtworkPage() {
  const { id } = useParams();
  
  const { data: artwork, isError, error } = useQuery<Artwork>({
    queryKey: [`/api/artworks/${id}`],
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
          
          <AspectRatio ratio={4/3} className="mb-6 overflow-hidden rounded-lg">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          
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
