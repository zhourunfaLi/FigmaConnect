import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BookmarkIcon,
  HeartIcon,
  ShareIcon,
  MessageSquareIcon,
  DownloadIcon,
  EyeIcon
} from "lucide-react";

import { extractArtworkId } from "@/lib/utils";
import { getArtwork } from "@/api";

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
        const data = await getArtwork(parsedId);
        console.log("加载的作品数据:", data);

        if (!data) {
          setError("作品不存在");
          toast({
            variant: "destructive",
            title: "错误",
            description: "无法加载作品数据",
          });
        } else {
          // 模拟一些额外的数据用于展示
          const enhancedData = {
            ...data,
            views: 2456,
            downloads: 189,
            comments: 32,
            artist: "创作者",
            createdAt: "2024-04-15",
            tags: ["风景", "水彩", "自然", "抽象"]
          };
          setArtwork(enhancedData);
        }
      } catch (err) {
        console.error("加载作品失败:", err);
        setError("加载作品失败");
        toast({
          variant: "destructive",
          title: "错误",
          description: `加载作品失败: ${err instanceof Error ? err.message : "未知错误"}`,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchArtwork();
  }, [parsedId, toast]);

  // 处理收藏
  const handleBookmark = () => {
    toast({
      title: "收藏成功",
      description: "已添加到您的收藏",
    });
  };

  // 处理点赞
  const handleLike = () => {
    toast({
      title: "点赞成功",
      description: "感谢您的喜欢",
    });
  };

  // 处理分享
  const handleShare = () => {
    // 复制当前URL到剪贴板
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "链接已复制",
      description: "作品链接已复制到剪贴板",
    });
  };

  // 渲染加载状态
  if (loading) {
    return (
      <div className="container mx-auto p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="aspect-video bg-gray-300 rounded-lg mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Card className="p-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-red-500 mb-4">无法加载作品</h2>
          <p className="mb-6 text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            返回上一页
          </Button>
        </Card>
      </div>
    );
  }

  // 渲染作品详情
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 顶部：标题和操作按钮 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{artwork?.title}</h1>
          <p className="text-muted-foreground">
            由 <span className="font-medium">{artwork?.artist}</span> 创作于 {artwork?.createdAt}
          </p>
        </div>

        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={handleBookmark}>
            <BookmarkIcon className="w-4 h-4 mr-2" />
            收藏
          </Button>
          <Button variant="outline" size="sm" onClick={handleLike}>
            <HeartIcon className="w-4 h-4 mr-2" />
            喜欢
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <ShareIcon className="w-4 h-4 mr-2" />
            分享
          </Button>
        </div>
      </div>

      {/* 主内容区：图片和信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 图片区 */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg overflow-hidden border shadow-sm">
            <img
              src={artwork?.imageUrl || '/placeholder.jpg'}
              alt={artwork?.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* 信息区 */}
        <div className="space-y-6">
          {/* 数据统计 */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">作品信息</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <EyeIcon className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                <div className="font-medium">{artwork?.views}</div>
                <div className="text-xs text-muted-foreground">浏览</div>
              </div>
              <div className="text-center">
                <HeartIcon className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                <div className="font-medium">{artwork?.likes}</div>
                <div className="text-xs text-muted-foreground">喜欢</div>
              </div>
              <div className="text-center">
                <DownloadIcon className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                <div className="font-medium">{artwork?.downloads}</div>
                <div className="text-xs text-muted-foreground">下载</div>
              </div>
            </div>

            {/* 描述 */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">作品描述</h4>
              <p className="text-sm text-muted-foreground">{artwork?.description}</p>
            </div>

            {/* 标签 */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">标签</h4>
              <div className="flex flex-wrap gap-2">
                {artwork?.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* 评论区链接 */}
            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full" onClick={() => {}}>
                <MessageSquareIcon className="w-4 h-4 mr-2" />
                查看评论 ({artwork?.comments})
              </Button>
            </div>
          </Card>

          {/* 下载按钮 */}
          <Button className="w-full">
            <DownloadIcon className="w-4 h-4 mr-2" />
            下载作品
          </Button>

          {/* 版权信息 */}
          <div className="text-xs text-center text-muted-foreground">
            © 内容遵循 CC-BY-NC 4.0 国际许可证
          </div>
        </div>
      </div>

      {/* 相关作品 */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">相关作品</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* 这里可以使用 map 循环展示相关作品缩略图 */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border rounded-md overflow-hidden group cursor-pointer">
              <div className="aspect-square bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              </div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}