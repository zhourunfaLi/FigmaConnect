import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { fetchArtwork } from "@/api";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import CommentSection from "@/components/comment-section";

const ArtworkPage = () => {
  const params = useParams();
  const id = params.id;
  const { toast } = useToast();
  const { user } = useAuth();
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [parsedId, setParsedId] = useState<number | null>(null);

  // 确保ID是有效数字
  useEffect(() => {
    if (id) {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        setParsedId(numericId);
      } else {
        console.error("无效的作品ID:", id);
      }
    }
  }, [id]);

  // 查询作品数据
  const { data: artwork, error, isLoading } = useQuery({
    queryKey: ["artwork", parsedId],
    queryFn: () => parsedId ? fetchArtwork(parsedId) : Promise.reject(new Error("无效的作品ID")),
    enabled: parsedId !== null, // 仅在有有效ID时执行查询
  });

  console.log("尝试获取作品，ID:", parsedId);
  console.log("Artwork data:", { artwork, error });

  if (parsedId === null) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">无效的作品ID</h1>
          <p className="text-gray-600">请检查URL并重试</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex justify-center">
          <div className="animaexport default function ArtworkPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: artwork, isLoading, error } = useQuery({
    queryKey: [`/api/artworks/${id}`],
    queryFn: () => fetchArtwork(id as string),
    retry: 3,
    retryDelay: 1000,
  });

  // 处理加载状态
  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 animate-pulse bg-gray-200 h-8 w-64 rounded"></h1>
          <div className="animate-pulse rounded-lg bg-gray-200 h-[500px] w-full max-w-3xl"></div>
        </div>
      </div>
    );
  }

  // 处理错误情况
  if (error) {
    const errorMessage = error instanceof Error ? error.message : "未知错误";

    // 检查是否是Premium内容访问错误
    if (errorMessage.includes("Premium content")) {
      if (!showPremiumDialog) {
        setShowPremiumDialog(true);
      }
      // 显示作品基本信息，但提示需要会员
      return (
        <div className="container mx-auto py-12">
          <h1 className="text-3xl font-bold mb-6">{artwork?.title || "会员专享内容"}</h1>
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-3xl">
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-10">
                <span className="text-xl font-semibold mb-4">🔒 会员专享内容</span>
                <Button
                  onClick={() => toast({ title: "功能开发中", description: "会员升级功能尚未实现" })}
                >
                  立即升级
                </Button>
              </div>
              {artwork?.imageUrl && (
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.title} 
                  className="w-full max-w-3xl rounded-lg shadow-md blur-sm"
                />
              )}
            </div>
          </div>
        </div>
      );
    }

    // 其他错误情况
    return (
      <div className="container mx-auto py-12">
        <Alert variant="destructive">
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => setLocation('/')}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="container mx-auto py-12">
        <Alert variant="destructive">
          <AlertDescription>
            找不到艺术品
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => setLocation('/')}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  // 显示艺术品详情
  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="mb-4">
            <Button variant="outline" size="sm" onClick={() => setLocation('/')}>
              &larr; 返回
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
          
          {artwork.is_premium && (
            <Badge variant="secondary" className="mb-4">
              会员专享
            </Badge>
          )}
          
          <div className="rounded-lg overflow-hidden shadow-md mb-6">
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title} 
              className="w-full h-auto"
            />
          </div>
          
          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-2">作品描述</h2>
            <p>{artwork.description}</p>
          </div>
          
          {artwork.videoUrl && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">视频介绍</h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <video 
                  src={artwork.videoUrl} 
                  controls 
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="md:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">评论</h2>
            <CommentSection artworkId={artwork.id} />
          </div>
        </div>
      </div>
      
      {/* 会员内容弹窗 */}
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>会员专享内容</DialogTitle>
            <DialogDescription>
              该作品为会员专享内容，请升级为高级会员后查看。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
              取消
            </Button>
            <Button onClick={() => toast({ 
              title: "功能开发中", 
              description: "会员升级功能尚未实现" 
            })}>
              立即升级
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-auto rounded-lg filter blur-sm"
                />
              )}
            </div>
          </div>

          <AlertDialog open={showPremiumDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>会员专享内容</AlertDialogTitle>
                <AlertDialogDescription>
                  该内容仅对会员用户开放。升级到会员后，您将解锁所有高级艺术品内容。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowPremiumDialog(false)}>暂不升级</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    toast({ title: "功能开发中", description: "会员升级功能尚未实现" });
                    setShowPremiumDialog(false);
                  }}
                >
                  立即升级
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    }

    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">无法加载作品</h1>
          <p className="text-gray-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // 作品不存在
  if (!artwork) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">未找到作品</h1>
          <p className="text-gray-600">您查找的作品不存在或已被删除</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${artwork.hideTitle ? "opacity-50" : ""}`}>
          {artwork.title}
          {artwork.isPremium && (
            <Badge variant="secondary" className="ml-3">
              会员专享
            </Badge>
          )}
        </h1>
        <p className="text-gray-600 mt-2">{artwork.description}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="relative group">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-auto rounded-lg cursor-pointer"
              onClick={() => setIsZoomed(true)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white bg-black bg-opacity-60 px-4 py-2 rounded">点击查看大图</span>
            </div>
          </div>

          {artwork.videoUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">相关视频</h3>
              <video
                src={artwork.videoUrl}
                controls
                className="w-full rounded-lg"
                poster={artwork.imageUrl}
              ></video>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">作品详情</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">作者</dt>
                <dd className="mt-1">暂无信息</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">创作时间</dt>
                <dd className="mt-1">暂无信息</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">分类</dt>
                <dd className="mt-1">{artwork.categoryId ? `分类 ${artwork.categoryId}` : "未分类"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">展示序号</dt>
                <dd className="mt-1">{artwork.displayOrder || "未设置"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-screen-xl">
          <DialogHeader>
            <DialogTitle>{artwork.title}</DialogTitle>
            <DialogDescription>{artwork.description}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="max-h-[80vh] w-auto"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ArtworkPage;