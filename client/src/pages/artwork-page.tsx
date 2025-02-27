import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Artwork } from "@/shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/fetch"; // Assuming this path is correct relative to artwork-page.tsx
import { TypographyH2 } from "@/components/ui/typography";
import { CommentSection } from "@/components/comment-section";
import { Separator } from "@/components/ui/separator";
import { Heart, Share2, ZoomIn, ZoomOut, Bookmark, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

export default function ArtworkPage() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!id) return;

    // 获取作品详情
    fetchApi<Artwork>(`/api/artworks/${id}`)
      .then((data) => {
        setArtwork(data);
        setLikesCount(data.likes || 0);
        setViewCount(data.views || 0);
        setLoading(false);

        // 记录浏览量
        fetchApi(`/api/artworks/${id}/view`, { method: "POST" })
          .then(data => {
            setViewCount(data.views);
          })
          .catch(err => console.error("Failed to record view:", err));
      })
      .catch((err) => {
        console.error("Failed to fetch artwork:", err);
        setLoading(false);
      });

    // 如果用户已登录，检查是否已点赞和收藏
    if (isAuthenticated) {
      fetchApi<{liked: boolean, bookmarked: boolean}>(`/api/artworks/${id}/user-actions`)
        .then(data => {
          setLiked(data.liked);
          setBookmarked(data.bookmarked);
        })
        .catch(err => console.error("Failed to fetch user actions:", err));
    }
  }, [id, isAuthenticated]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "请先登录",
        description: "登录后才能点赞作品",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetchApi<{liked: boolean, likesCount: number}>(`/api/artworks/${id}/like`, {
        method: "POST",
      });

      setLiked(response.liked);
      setLikesCount(response.likesCount);

      toast({
        title: response.liked ? "已点赞" : "已取消点赞",
        description: response.liked ? "感谢您的喜欢！" : "您已取消点赞",
      });
    } catch (error) {
      console.error("Failed to like artwork:", error);
      toast({
        title: "操作失败",
        description: "无法完成点赞操作，请稍后再试",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast({
        title: "请先登录",
        description: "登录后才能收藏作品",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetchApi<{bookmarked: boolean}>(`/api/artworks/${id}/bookmark`, {
        method: "POST",
      });

      setBookmarked(response.bookmarked);

      toast({
        title: response.bookmarked ? "已收藏" : "已取消收藏",
        description: response.bookmarked ? "作品已添加到您的收藏" : "作品已从您的收藏中移除",
      });
    } catch (error) {
      console.error("Failed to bookmark artwork:", error);
      toast({
        title: "操作失败",
        description: "无法完成收藏操作，请稍后再试",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading artwork...</div>;
  }

  if (!artwork) {
    return <div className="container mx-auto p-4">Artwork not found</div>;
  }

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "已复制链接",
      description: "作品链接已复制到剪贴板",
    });
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className={`w-full h-auto object-contain ${
                zoom ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              style={{ maxHeight: zoom ? "none" : "80vh" }}
              onClick={() => setZoom(!zoom)}
            />
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button 
              variant="secondary" 
              size="icon"
              onClick={() => setZoom(!zoom)}
            >
              {zoom ? <ZoomOut /> : <ZoomIn />}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Share2 />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-semibold">分享作品</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {/* 这里可以放社交媒体分享按钮 */}
                    <Button onClick={handleShareClick}>
                      复制链接
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant={liked ? "default" : "secondary"} 
              size="icon"
              onClick={handleLike}
            >
              <Heart className={liked ? "fill-current" : ""} />
            </Button>

            <Button 
              variant={bookmarked ? "default" : "secondary"} 
              size="icon"
              onClick={handleBookmark}
            >
              <Bookmark className={bookmarked ? "fill-current" : ""} />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <TypographyH2>{artwork.title}</TypographyH2>
              {artwork.is_premium && (
                <Badge variant="outline" className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-100 border-amber-200">
                  SVIP专享
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-muted-foreground">
                {artwork.category_name}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{viewCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{likesCount}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-lg">{artwork.description}</p>

          {artwork.is_premium && (
            <div className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-100 rounded-md p-3 text-sm flex items-center gap-2">
              <span className="font-semibold">SVIP专享</span> 
              高清原图下载
            </div>
          )}

          {isAdmin && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <a href={`/admin/artwork/${artwork.id}/edit`}>编辑作品</a>
              </Button>
              {artwork.is_premium ? (
                <Button variant="outline" onClick={() => {
                  fetchApi(`/api/artworks/${artwork.id}/premium`, {
                    method: "POST",
                    body: JSON.stringify({ isPremium: false }),
                  })
                    .then(() => {
                      setArtwork({...artwork, is_premium: false});
                      toast({ title: "已设为普通作品" });
                    });
                }}>
                  设为普通作品
                </Button>
              ) : (
                <Button variant="outline" onClick={() => {
                  fetchApi(`/api/artworks/${artwork.id}/premium`, {
                    method: "POST",
                    body: JSON.stringify({ isPremium: true }),
                  })
                    .then(() => {
                      setArtwork({...artwork, is_premium: true});
                      toast({ title: "已设为SVIP专享" });
                    });
                }}>
                  设为SVIP专享
                </Button>
              )}
            </div>
          )}

          <Separator />

          <CommentSection artworkId={artwork.id} />
        </div>
      </div>
    </div>
  );
}