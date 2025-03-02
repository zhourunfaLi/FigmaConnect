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
  const rawId = params.id;
  const { toast } = useToast();
  const { user } = useAuth();
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [parsedId, setParsedId] = useState<number | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artwork, setArtwork] = useState<any | null>(null);

  // 解析作品ID
  useEffect(() => {
    let validId: number | null = null;

    console.log(`开始解析作品ID: ${rawId}`);

    if (!rawId) {
      console.error("URL参数中未提供作品ID");
      setError("未提供作品ID");
      setLoading(false);
      toast({
        title: "缺少作品ID",
        description: "URL中未包含作品ID",
        variant: "destructive"
      });
      return;
    }

    // 1. 直接检查ID是否为纯数字
    if (!isNaN(Number(rawId)) && Number(rawId) > 0) {
      validId = Number(rawId);
      console.log(`ID是有效的数字: ${validId}`);
    } 
    // 2. 检查是否是复合ID (如 art-123-456)
    else if (rawId.includes('-')) {
      const parts = rawId.split('-');

      // 常见模式: art-123-456，第二部分通常是ID
      if (parts.length >= 2 && !isNaN(Number(parts[1])) && Number(parts[1]) > 0) {
        validId = Number(parts[1]);
        console.log(`从复合ID中提取数字部分(第二部分): ${validId}`);
      }
      // 备选模式: 1-123，第一部分可能是ID
      else if (parts.length >= 1 && !isNaN(Number(parts[0])) && Number(parts[0]) > 0) {
        validId = Number(parts[0]);
        console.log(`从复合ID中提取数字部分(第一部分): ${validId}`);
      }

      // 通用情况下尝试第二个部分作为ID
      if (parts.length >= 2 && !isNaN(Number(parts[1]))) {
        validId = Number(parts[1]);
        console.log(`从复合ID中提取数字部分: ${validId}`);
        }
      }
    }

    // 设置解析后的ID
    if (validId !== null && validId > 0) {
      console.log(`设置有效的作品ID: ${validId}`);
      setParsedId(validId);
    } else {
      console.log("无法从URL参数解析有效的作品ID");
      setError("无效的作品ID");
    }
  }, [rawId]);

  // 在ID被成功解析后加载作品数据
  useEffect(() => {
    if (parsedId === null) return;

    const loadArtwork = async () => {
      try {
        console.log(`开始加载作品数据，ID: ${parsedId}`);
        setLoading(true);
        const data = await fetchArtwork(parsedId);

        if (data) {
          console.log('成功加载作品:', data);
          setArtwork(data);
        } else {
          console.error(`作品ID ${parsedId} 不存在或返回为空`);
          setError('作品不存在或已被删除');
          toast({
            title: "作品不存在",
            description: "您请求的作品不存在或已被删除",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('加载作品失败:', err);
        setError('加载作品失败，请稍后重试');
        toast({
          title: "加载失败",
          description: "无法加载作品详情，请稍后重试",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadArtwork();
  }, [parsedId, toast]);


  console.log("尝试获取作品，ID:", parsedId);
  console.log("Artwork data:", { artwork, error });

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
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">无法加载作品</h1>
          <p className="text-gray-600">{error}</p>
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
};

export default ArtworkPage;