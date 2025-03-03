import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { fetchArtworkById, fetchRelatedArtworks } from '@/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heart, Share2, BookmarkIcon, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artwork } from '@shared/schema';

// 相关作品组件
const RelatedArtworkCard = ({ artwork }: { artwork: Artwork }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-md">
        <img 
          src={artwork.imageUrl || 'https://placehold.co/300x400'} 
          alt={artwork.title}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ aspectRatio: artwork.aspect_ratio || '3/4' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-medium line-clamp-2">{artwork.title}</h3>
          </div>
        </div>
      </div>
      <h4 className="mt-2 text-sm font-medium truncate">{artwork.title}</h4>
    </div>
  );
};

// 评论组件
const CommentSection = ({ artworkId }: { artworkId: number }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/artworks/${artworkId}/comments`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('获取评论失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [artworkId]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">评论 ({comments.length})</h2>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-bold">{comment.user?.username?.[0] || 'U'}</span>
              </div>
              <div>
                <div className="font-medium">{comment.user?.username || '用户'}</div>
                <p className="text-gray-700 mt-1">{comment.content}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(comment.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">暂无评论，成为第一个评论的人吧！</p>
      )}

      <div className="mt-6">
        <textarea 
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          rows={3} 
          placeholder="分享你的想法..."
        />
        <Button className="mt-2">发布评论</Button>
      </div>
    </div>
  );
};

export default function ArtworkPage() {
  const [match, params] = useRoute('/artwork/:id');
  const artworkId = params?.id ? parseInt(params.id) : 1; // 默认使用ID 1，如果没有路径参数

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(`ArtworkPage: URL路径参数=${params?.id}, 解析后ID=${artworkId}`);

  useEffect(() => {
    const loadArtworkData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 获取作品详情
        const artworkData = await fetchArtworkById(artworkId);
        setArtwork(artworkData);

        // 获取相关作品
        const relatedData = await fetchRelatedArtworks(artworkId);
        setRelatedArtworks(relatedData);
      } catch (err) {
        console.error('加载作品详情失败:', err);
        setError('无法加载作品详情，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworkData();
  }, [artworkId]);

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="w-full aspect-[3/4] rounded-md" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          {error || '无法找到作品'}
        </h2>
        <p className="text-gray-600 mb-4">请尝试刷新页面或返回首页</p>
        <Button as="a" href="/">返回首页</Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* 作品详情区域 */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 作品图片 */}
          <div className="relative">
            <div className="sticky top-4">
              <div className="relative overflow-hidden rounded-md">
                <img 
                  src={artwork.imageUrl || 'https://placehold.co/600x800'} 
                  alt={artwork.title} 
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: artwork.aspect_ratio || '3/4' }}
                />
                {artwork.is_premium && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">
                    会员专享
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 作品信息 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{artwork.title}</h1>
              <p className="text-gray-600 mt-2">浏览次数: 1,234 · 收藏次数: 567</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-medium">作品描述</h2>
              <p className="text-gray-700 whitespace-pre-line">{artwork.description}</p>
            </div>

            {/* 互动按钮 */}
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex gap-2 items-center">
                <Heart className="w-5 h-5" />
                <span>收藏</span>
              </Button>
              <Button variant="outline" size="lg" className="flex gap-2 items-center">
                <Share2 className="w-5 h-5" />
                <span>分享</span>
              </Button>
              <Button variant="outline" size="lg" className="flex gap-2 items-center">
                <MessageCircle className="w-5 h-5" />
                <span>评论</span>
              </Button>
            </div>

            {/* 标签 */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium">标签</h2>
              <div className="flex flex-wrap gap-2">
                {['艺术', '印象派', '油画', '风景'].map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 作者信息 - 如果有的话 */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-800 font-bold">A</span>
                </div>
                <div>
                  <div className="font-medium">艺术家名称</div>
                  <p className="text-sm text-gray-600">创作于 {new Date().toLocaleDateString()}</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  关注
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 相关作品区域 */}
        {relatedArtworks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6">相关作品</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedArtworks.map((relatedArtwork) => (
                <RelatedArtworkCard key={relatedArtwork.id} artwork={relatedArtwork} />
              ))}
            </div>
          </div>
        )}

        {/* 评论区域 */}
        <CommentSection artworkId={artworkId} />
      </div>
    </div>
  );
}