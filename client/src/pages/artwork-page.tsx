import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { type Artwork } from "@shared/schema";
import VideoPlayer from "@/components/video-player";
import CommentSection from "@/components/comment-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { 
  Loader2, 
  ZoomIn, 
  ZoomOut, 
  Share2, 
  Heart,
  ArrowLeft,
  Download
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { fetchApi } from "@/lib/api";

export default function ArtworkPage() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const { user } = useAuth();

  const { data: artwork, isError, error, isLoading } = useQuery({
    queryKey: [`artwork-${id}`], // Corrected queryKey
    queryFn: () => fetchApi(`/artworks/${id}`),
    enabled: id > 0,
    retry: false,
    staleTime: 60000, // 缓存一分钟
  });

  useEffect(() => {
    // 重置状态
    setImageLoaded(false);
    setZoom(1);
    setLiked(false);

    // 页面标题
    if (artwork) {
      document.title = `${artwork.title} | 画廊`;
    }

    return () => {
      document.title = '画廊';
    };
  }, [id, artwork]);

  const handleLike = () => {
    setLiked(!liked);
    // 这里可以添加实际的点赞API调用
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork?.title || '艺术作品',
        text: artwork?.description || '',
        url: window.location.href,
      }).catch(err => console.error('分享失败:', err));
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('链接已复制到剪贴板'))
        .catch(err => console.error('复制失败:', err));
    }
  };

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
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> 返回首页
            </Button>
          </Link>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            {(error as Error).message || "无法加载作品信息"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> 返回首页
            </Button>
          </Link>
        </div>
        <Alert>
          <AlertDescription>
            未找到作品
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回首页
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-black/5">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 作品图片部分 */}
            <div className="lg:w-2/3">
              <div className="rounded-xl overflow-hidden bg-[#f8f8f8] border border-black/5 relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                  </div>
                )}

                <div className="relative overflow-hidden" 
                     style={{ 
                       transform: `scale(${zoom})`, 
                       transformOrigin: 'center',
                       transition: 'transform 0.3s ease'
                     }}>
                  <AspectRatio ratio={artwork.aspect_ratio ? parseFloat(artwork.aspect_ratio) : 4/3}>
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className={cn(
                        "w-full h-full object-cover transition-opacity duration-300",
                        imageLoaded ? "opacity-100" : "opacity-0"
                      )}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </AspectRatio>
                </div>

                {/* 作品工具栏 */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                    onClick={handleLike}
                  >
                    <Heart className={cn("h-5 w-5", liked ? "fill-red-500 text-red-500" : "text-slate-700")} />
                  </Button>

                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5 text-slate-700" />
                  </Button>

                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                    onClick={() => window.open(artwork.imageUrl, '_blank')}
                  >
                    <Download className="h-5 w-5 text-slate-700" />
                  </Button>
                </div>
              </div>

              {/* 缩放控制 */}
              <div className="flex items-center gap-4 mt-4 px-2">
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
                <div className="text-sm text-gray-500 ml-2">
                  {Math.round(zoom * 100)}%
                </div>
              </div>
            </div>

            {/* 作品信息部分 */}
            <div className="lg:w-1/3">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{artwork.title}</h1>

              <div className="mb-6">
                <div className="h-1 w-16 bg-primary my-4"></div>
                <p className="text-lg text-muted-foreground">
                  {artwork.description}
                </p>
              </div>

              <div className="space-y-4">
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

                {artwork.is_premium && (
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">特别内容</h3>
                    <span className="inline-block bg-amber-500/10 text-amber-500 px-3 py-1 rounded-md text-sm">
                      高级作品
                    </span>

                    {!user?.isPremium && (
                      <div className="mt-2 p-3 bg-amber-500/5 rounded-md">
                        <p className="text-sm text-gray-600">
                          升级到高级会员解锁更多内容
                        </p>
                        <Button className="mt-2 w-full" variant="outline" size="sm">
                          升级会员
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">详细信息</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex justify-between">
                      <span>ID:</span>
                      <span className="font-mono">{artwork.id}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>尺寸比例:</span>
                      <span>{artwork.aspect_ratio || "标准"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>显示顺序:</span>
                      <span>{artwork.display_order || "默认"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 视频部分 */}
          {artwork.videoUrl && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="h-5 w-1 bg-primary rounded mr-2"></span>
                视频展示
              </h2>
              <div className="rounded-xl overflow-hidden border border-black/5">
                <VideoPlayer url={artwork.videoUrl} />
              </div>
            </div>
          )}

          {/* 评论部分 */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="h-5 w-1 bg-primary rounded mr-2"></span>
              评论讨论
            </h2>
            <CommentSection artworkId={artwork.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}