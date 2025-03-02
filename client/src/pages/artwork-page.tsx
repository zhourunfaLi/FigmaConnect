
import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { extractArtworkId } from "@/lib/utils";
import { fetchArtworkById, fetchRelatedArtworks } from "@/api";
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
  const [relatedArtworks, setRelatedArtworks] = useState<ArtworkDetail[]>([]);
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

    async function fetchArtworkData() {
      try {
        setLoading(true);
        console.log(`正在加载ID为 ${parsedId} 的作品`);

        // 从API获取作品数据
        const data = await fetchArtworkById(parsedId);
        console.log("加载的作品数据:", data);

        // 设置作品数据
        setArtwork(data);
        setError(null);

        // 获取相关作品
        try {
          const related = await fetchRelatedArtworks(parsedId, 4);
          setRelatedArtworks(related);
        } catch (err) {
          console.warn("加载相关作品失败:", err);
          // 不影响主作品显示，仅记录警告
        }
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

    fetchArtworkData();
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
        <div className="text-red-500 text-xl font-semibold mb-4">加载作品时出错</div>
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

  // 格式化日期
  const formattedDate = artwork.createdAt 
    ? new Date(artwork.createdAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) 
    : "未知";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 顶部栏 - 作品标题和操作按钮 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-0">{artwork.title}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Share2Icon className="h-4 w-4 mr-2" />
            分享
          </Button>
          <Button variant="outline" size="sm">
            <BookmarkIcon className="h-4 w-4 mr-2" />
            收藏
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主内容区 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 主图 */}
          <div className="bg-card rounded-lg overflow-hidden border shadow-sm">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* 描述 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">作品描述</h2>
            <p className="text-muted-foreground whitespace-pre-line">{artwork.description || "暂无描述"}</p>
          </Card>

          {/* 标签 */}
          {artwork.tags && artwork.tags.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">标签</h2>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 相关推荐 */}
          {relatedArtworks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">相关作品</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedArtworks.map((related) => (
                  <a 
                    key={related.id}
                    href={`/artwork/${related.id}`} 
                    className="block group"
                  >
                    <div className="aspect-square overflow-hidden rounded-md border bg-muted">
                      <img 
                        src={related.imageUrl} 
                        alt={related.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="mt-2 text-sm font-medium truncate">{related.title}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 作者信息 */}
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <img 
                  src="/src/assets/avatar.png" 
                  alt="作者头像"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150';
                  }}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{artwork.artist || "未知作者"}</div>
                <div className="text-sm text-muted-foreground">作品创作者</div>
              </div>
            </div>
            <Button className="w-full mb-4">关注作者</Button>
            <Button variant="outline" className="w-full">查看更多作品</Button>
          </Card>

          {/* 作品信息 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">作品信息</h3>
            
            {/* 交互数据 */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="text-center">
                <HeartIcon className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                <div className="font-medium">{artwork.likes || 0}</div>
                <div className="text-xs text-muted-foreground">喜欢</div>
              </div>
              <div className="text-center">
                <EyeIcon className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                <div className="font-medium">{artwork.views || 0}</div>
                <div className="text-xs text-muted-foreground">浏览</div>
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
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">分类</span>
                <span>{artwork.categoryId || "未分类"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">作品ID</span>
                <span>{artwork.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">会员专属</span>
                <span>{artwork.isPremium ? "是" : "否"}</span>
              </div>
            </div>
          </Card>

          {/* 下载按钮 */}
          <Button size="lg" className="w-full">
            <DownloadIcon className="mr-2 h-5 w-5" />
            下载作品
          </Button>
        </div>
      </div>
    </div>
  );
}
