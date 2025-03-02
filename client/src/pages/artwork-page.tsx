import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchArtworkById } from "@/api";
import { Heart, Share2, MessageSquare, BookmarkPlus, ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export interface Artwork {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  likes?: number;
  comments?: number;
  views?: number;
  isPremium?: boolean;
  artist?: {
    id: number;
    name: string;
    avatar: string;
  };
  date?: string;
  tags?: string[];
  cityId?: string;
  dimensions?: string;
  medium?: string;
  created?: string;
}

export default function ArtworkPage() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedId, setParsedId] = useState<number | null>(null);
  const { toast } = useToast();

  // 解析作品ID
  useEffect(() => {
    if (!id) return;

    console.log(`处理作品ID: ${id}`);

    let validId: number | null = null;

    // 尝试直接将ID解析为数字
    if (!isNaN(Number(id))) {
      validId = Number(id);
    } else {
      // 尝试从复合ID中提取数字ID (例如 "art-123-456" 或 "city-123-456")
      const matches = id.match(/^(art|city)-(\d+)(-\d+)?$/);
      if (matches && matches[2]) {
        validId = Number(matches[2]);
      }
    }

    // 设置解析后的ID
    if (validId !== null && validId > 0) {
      console.log(`设置有效的作品ID: ${validId}`);
      setParsedId(validId);
    } else {
      setError("无效的作品ID");
      setLoading(false);
    }
  }, [id]);

  // 获取作品数据
  useEffect(() => {
    if (!parsedId) return;

    setLoading(true);
    setError(null);

    fetchArtworkById(parsedId)
      .then(data => {
        if (data) {
          console.log("获取到的作品数据:", data);
          setArtwork(data);
          setLoading(false);
        } else {
          setError("无法加载作品");
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("加载作品时出错:", err);
        setError("加载作品时出错");
        setLoading(false);
        toast({
          title: "错误",
          description: "加载作品时出错",
          variant: "destructive",
        });
      });
  }, [parsedId, toast]);

  // 加载中状态
  if (loading) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">正在加载作品...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="container mx-auto p-4 h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-lg p-6 text-center">
          <div className="text-red-500 text-5xl mb-4">
            <span className="block">!</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <p className="mb-6 text-muted-foreground">
            无法找到或加载请求的作品，请检查URL后重试。
          </p>
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // 作品未找到
  if (!artwork) {
    return (
      <div className="container mx-auto p-4 h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-lg p-6 text-center">
          <div className="text-amber-500 text-5xl mb-4">
            <span className="block">?</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">作品未找到</h2>
          <p className="mb-6 text-muted-foreground">
            无法找到ID为 {id} 的作品，请检查URL后重试。
          </p>
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // 临时模拟数据
  const mockArtist = {
    id: 1,
    name: "艺术家名字",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=artist",
  };

  const mockRelatedWorks = Array.from({ length: 4 }, (_, i) => ({
    id: `art-${i + 1}-${Math.floor(Math.random() * 20)}`,
    title: `相关作品 ${i + 1}`,
    imageUrl: `/src/assets/design/img/art-${String((i + 1) % 30 + 1).padStart(2, '0')}.jpg`,
  }));

  // 渲染作品详情
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            返回首页
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 作品图片 - 占据左侧2/3 */}
        <div className="lg:col-span-2 sticky top-20 self-start">
          <div className="relative rounded-xl overflow-hidden bg-black/5 aspect-square md:aspect-[4/3] shadow-md">
            <img
              src={artwork.imageUrl || `/src/assets/design/img/art-${String(artwork.id % 30 + 1).padStart(2, '0')}.jpg`}
              alt={artwork.title}
              className="w-full h-full object-contain"
            />
            {artwork.isPremium && (
              <Badge variant="secondary" className="absolute top-4 right-4 bg-amber-500 text-white">
                会员专享
              </Badge>
            )}
          </div>

          {/* 作品互动按钮 */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{artwork.likes || Math.floor(Math.random() * 1000)}</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>{artwork.comments || Math.floor(Math.random() * 100)}</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                分享
              </Button>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BookmarkPlus className="h-4 w-4" />
              收藏
            </Button>
          </div>
        </div>

        {/* 作品信息 - 占据右侧1/3 */}
        <div className="lg:col-span-1">
          <div className="space-y-8">
            {/* 作品标题和描述 */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>
              <p className="text-muted-foreground">{artwork.description}</p>
            </div>

            {/* 艺术家信息 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={artwork.artist?.avatar || mockArtist.avatar}
                  alt={artwork.artist?.name || mockArtist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{artwork.artist?.name || mockArtist.name}</h3>
                <p className="text-sm text-muted-foreground">艺术家</p>
              </div>
            </div>

            {/* 作品详细信息 */}
            <div className="space-y-4 border-t border-b py-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">尺寸</p>
                  <p className="font-medium">{artwork.dimensions || "120 x 80 cm"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">媒介</p>
                  <p className="font-medium">{artwork.medium || "油彩、画布"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">创作年份</p>
                  <p className="font-medium">{artwork.created || "2023"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">浏览次数</p>
                  <p className="font-medium">{artwork.views || Math.floor(Math.random() * 5000)}</p>
                </div>
              </div>
            </div>

            {/* 标签 */}
            <div>
              <h3 className="font-medium mb-3">标签</h3>
              <div className="flex flex-wrap gap-2">
                {(artwork.tags || ["现代艺术", "油画", "抽象", "人像"]).map((tag, index) => (
                  <Badge key={index} variant="outline" className="rounded-md">
                    {tag}
                  </Badge>
                ))}
                {artwork.cityId && (
                  <Badge variant="secondary" className="rounded-md">
                    {artwork.cityId}
                  </Badge>
                )}
              </div>
            </div>

            {/* 下载或购买按钮 */}
            <div className="flex gap-4">
              {artwork.isPremium ? (
                <Button className="w-full bg-amber-500 hover:bg-amber-600">
                  会员免费下载
                </Button>
              ) : (
                <Button className="w-full">免费下载</Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 相关作品 */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">相关作品</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockRelatedWorks.map((work) => (
            <Link key={work.id} href={`/artwork/${work.id}`}>
              <div className="group cursor-pointer">
                <div className="aspect-square rounded-lg overflow-hidden bg-black/5 mb-2">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium truncate">{work.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}