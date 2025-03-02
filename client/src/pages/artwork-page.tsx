import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { fetchArtwork } from "@/api";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ArtworkPage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { toast } = useToast();
  const { user } = useAuth();
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [parsedId, setParsedId] = useState<number | null>(null);

  // 确保ID是有效数字
  useEffect(() => {
    console.log("接收到作品ID参数:", id);
    if (id) {
      // 处理可能包含字符的复合ID（例如 art-123-45）
      let rawId = id;
      
      // 首先检查ID是否已经是纯数字
      if (!isNaN(parseInt(id)) && parseInt(id).toString() === id) {
        console.log(`ID已经是有效的数字: ${id}`);
        setParsedId(parseInt(id));
        return;
      }
      
      // 处理复合ID格式
      if (id.includes('-')) {
        const parts = id.split('-');
        // 尝试获取第二部分作为数字ID
        if (parts.length >= 2 && !isNaN(parseInt(parts[1]))) {
          rawId = parts[1];
          console.log(`从复合ID '${id}' 提取数字ID: ${rawId}`);
        }
      }
      
      const numericId = parseInt(rawId);
      if (!isNaN(numericId)) {
        console.log(`设置有效的数字ID: ${numericId}`);
        setParsedId(numericId);
      } else {
        console.error("无法解析为有效的作品ID:", id);
        toast({
          title: "无效的作品ID",
          description: "请检查URL并重试",
          variant: "destructive"
        });
      }
    } else {
      console.error("URL参数中未提供作品ID");
      toast({
        title: "未提供作品ID",
        description: "请检查URL并重试",
        variant: "destructive"
      });
    }
  }, [id, toast]);

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
          <div className="animate-pulse rounded-lg bg-gray-200 h-[500px] w-[800px]"></div>
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