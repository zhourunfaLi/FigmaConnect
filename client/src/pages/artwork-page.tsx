import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { extractArtworkId } from "@/lib/utils";
import { EyeIcon, HeartIcon, DownloadIcon, Share2Icon, BookmarkIcon } from "lucide-react";

// 作品详情类型
interface ArtworkDetail {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  categoryId?: number;
  isPremium: boolean;
  likes?: number;
  views?: number;
  downloads?: number;
  comments?: number;
  artist?: string;
  createdAt?: string;
  tags?: string[];
}

export default function ArtworkPage() {
  const params = useParams();
  const { toast } = useToast();
  const [artwork, setArtwork] = useState<ArtworkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedId, setParsedId] = useState<number | null>(null);

  // 解析作品ID
  useEffect(() => {
    if (params.id) {
      // 尝试解析作品ID
      const validId = extractArtworkId(params.id);
      console.log(`设置有效的作品ID: ${validId}`);
      setParsedId(validId);
    } else {
      console.error("未提供作品ID");
      setError("未提供作品ID");
      setLoading(false);
    }
  }, [params.id]);

  // 加载作品详情
  useEffect(() => {
    if (parsedId === null) {
      return; // 等待有效ID
    }

    async function fetchArtwork() {
      try {
        setLoading(true);
        console.log(`正在加载ID为 ${parsedId} 的作品`);

        // 从API获取作品数据
        const response = await fetch(`/api/artworks/${parsedId}`);
        if (!response.ok) {
          throw new Error(`获取作品失败: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("加载的作品数据:", data);

        // 设置作品数据
        setArtwork(data);
        setError(null);
      } catch (err) {
        console.error("加载作品失败:", err);
        setError(`加载作品失败: ${err instanceof Error ? err.message : '未知错误'}`);
        toast({
          title: "加载失败",
          description: `无法加载作品: ${err instanceof Error ? err.message : '未知错误'}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchArtwork();
  }, [parsedId, toast]);

  // 加载中状态
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-slate-200 rounded-lg mb-4"></div>
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 mb-4">加载作品时出错</div>
        <p>{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.history.back()}
        >
          返回
        </Button>
      </div>
    );
  }

  // 未找到作品
  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-muted-foreground mb-4">未找到作品</div>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.history.back()}
        >
          返回
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 主图 */}
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg overflow-hidden border shadow-sm mb-4">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* 标题和描述 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {artwork.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
              {artwork.isPremium && <Badge variant="default" className="bg-gradient-to-r from-amber-400 to-amber-600">Premium</Badge>}
            </div>
            <p className="text-muted-foreground">{artwork.description}</p>
          </div>

          {/* 按钮区 */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button variant="default" size="lg" className="gap-2">
              <HeartIcon className="w-5 h-5" />
              <span>喜欢</span>
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <DownloadIcon className="w-5 h-5" />
              <span>下载</span>
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Share2Icon className="w-5 h-5" />
              <span>分享</span>
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <BookmarkIcon className="w-5 h-5" />
              <span>收藏</span>
            </Button>
          </div>
        </div>

        {/* 侧边信息区 */}
        <div className="space-y-6">
          {/* 艺术家信息 */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                <img src="/placeholder-avatar.jpg" alt="Artist" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium">{artwork.artist || "匿名艺术家"}</h3>
                <p className="text-sm text-muted-foreground">创作者</p>
              </div>
            </div>
            <Button variant="secondary" className="w-full">关注创作者</Button>
          </Card>

          {/* 数据统计 */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">作品信息</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <EyeIcon className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                <div className="font-medium">{artwork.views || 0}</div>
                <div className="text-xs text-muted-foreground">浏览</div>
              </div>
              <div className="text-center">
                <HeartIcon className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                <div className="font-medium">{artwork.likes || 0}</div>
                <div className="text-xs text-muted-foreground">喜欢</div>
              </div>
              <div className="text-center">
                <DownloadIcon className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                <div className="font-medium">{artwork.downloads || 0}</div>
                <div className="text-xs text-muted-foreground">下载</div>
              </div>
            </div>

            {/* 创作信息 */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">创建时间</span>
                <span>{artwork.createdAt ? new Date(artwork.createdAt).toLocaleDateString() : "未知"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">分类</span>
                <span>{artwork.categoryId || "未分类"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">作品ID</span>
                <span>{artwork.id}</span>
              </div>
            </div>
          </Card>

          {/* 相关推荐 */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">相关作品</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square rounded-md bg-muted overflow-hidden">
                  <div className="w-full h-full bg-muted"></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}