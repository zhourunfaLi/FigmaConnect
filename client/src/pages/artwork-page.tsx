
import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchArtwork } from "@/api";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
        console.log(`从复合ID中提取数字部分: ${validId}`);
      }
      // 尝试使用第一部分作为ID
      else if (parts.length >= 1 && !isNaN(Number(parts[0])) && Number(parts[0]) > 0) {
        validId = Number(parts[0]);
        console.log(`从复合ID中提取数字部分(第一部分): ${validId}`);
      }
      
      // 通用情况下尝试第二个部分作为ID
      if (parts.length >= 2 && !isNaN(Number(parts[1]))) {
        validId = Number(parts[1]);
        console.log(`从复合ID中提取数字部分(第二部分): ${validId}`);
      }
    }
    
    // 设置解析后的ID
    if (validId !== null && validId > 0) {
      console.log(`设置有效的作品ID: ${validId}`);
      setParsedId(validId);
    } else {
      console.log("无法从URL参数解析有效的作品ID");
      setError("无效的作品ID");
      setLoading(false);
      toast({
        title: "无效的作品ID",
        description: "请检查URL并重试",
        variant: "destructive"
      });
    }
  }, [rawId, toast]);

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

  // 处理加载状态
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
        <div className="md:w-2/3">
          <div 
            className={`relative rounded-lg overflow-hidden cursor-zoom-in ${isZoomed ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/90' : ''}`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title} 
              className={`w-full object-contain ${isZoomed ? 'max-h-screen' : 'max-h-[70vh]'}`} 
            />
            {isZoomed && (
              <button 
                className="absolute top-4 right-4 bg-white rounded-full p-2"
                onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
              >
                关闭
              </button>
            )}
          </div>
        </div>
        
        <div className="md:w-1/3">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">作品信息</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500">艺术家</h3>
                <p>{artwork.artist || '未知'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">创作年代</h3>
                <p>{artwork.year || '未知'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">尺寸</h3>
                <p>{artwork.dimensions || '未知'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">材质</h3>
                <p>{artwork.medium || '未知'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">风格</h3>
                <p>{artwork.style || '未知'}</p>
              </div>
              
              <div className="pt-4">
                {artwork.isPremium && !user?.isPremium ? (
                  <Button className="w-full" onClick={() => setShowPremiumDialog(true)}>
                    升级会员查看高清大图
                  </Button>
                ) : (
                  <Button className="w-full">
                    下载高清大图
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>升级会员</DialogTitle>
            <DialogDescription>
              成为会员后可以查看和下载所有高清艺术作品
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/20 p-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75V4.75C16.0041 4.75 19.25 7.99594 19.25 12V12C19.25 16.0041 16.0041 19.25 12 19.25V19.25C7.99594 19.25 4.75 16.0041 4.75 12V12Z"></path>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 12.75L10.75 13.75L14.25 10.25"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">无限下载</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">下载所有艺术作品的高清图像</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/20 p-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75V4.75C16.0041 4.75 19.25 7.99594 19.25 12V12C19.25 16.0041 16.0041 19.25 12 19.25V19.25C7.99594 19.25 4.75 16.0041 4.75 12V12Z"></path>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 12.75L10.75 13.75L14.25 10.25"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">专属内容</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">访问会员专享的独家艺术作品</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
              取消
            </Button>
            <Button>升级会员</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtworkPage;
