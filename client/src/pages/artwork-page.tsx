
import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { extractArtworkId } from '@/lib/utils';
import { fetchArtworkById } from '@/api';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 作品详情页面
export default function ArtworkPage() {
  const params = useParams();
  
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artwork, setArtwork] = useState<any | null>(null);
  const [parsedId, setParsedId] = useState<number | null>(null);

  // 解析作品ID
  useEffect(() => {
    if (params.id) {
      try {
        // 尝试解析作品ID
        const validId = extractArtworkId(params.id);
        console.log(`设置有效的作品ID: ${validId}`);
        
        if (validId === null) {
          throw new Error(`无法从 ${params.id} 提取有效ID`);
        }
        
        setParsedId(validId);
      } catch (err) {
        console.error("解析作品ID出错:", err);
        setError(`无法识别作品ID: ${params.id}`);
        setLoading(false);
      }
    } else {
      console.error("未提供作品ID");
      setError("未提供作品ID");
    }
  }, [params.id]);

  // 获取作品数据
  useEffect(() => {
    if (parsedId === null) {
      return;
    }

    const loadArtwork = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`正在加载ID为 ${parsedId} 的作品`);

        // 从API获取作品数据
        const data = await fetchArtworkById(parsedId);
        console.log("加载的作品数据:", data);

        // 设置作品数据
        setArtwork(data);
      } catch (err: any) {
        console.error("加载作品失败:", err);
        setError(`加载作品时出错: ${err.message || '未知错误'}`);
      } finally {
        setLoading(false);
      }
    };

    loadArtwork();
  }, [parsedId]);

  // 加载中状态
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-500">加载作品时出错</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              返回上一页
            </button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 作品内容
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{artwork?.title || '未知作品'}</CardTitle>
          <CardDescription>{artwork?.description || '暂无描述'}</CardDescription>
        </CardHeader>
        <CardContent>
          {artwork?.imageUrl && (
            <div className="mb-4">
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title} 
                className="w-full h-auto rounded-md"
              />
            </div>
          )}
          
          <div className="space-y-4">
            <p>{artwork?.description || '暂无详细信息'}</p>
            {artwork?.likes && (
              <div className="flex items-center gap-2">
                <span>点赞数:</span>
                <span className="font-bold">{artwork.likes}</span>
              </div>
            )}
            {artwork?.theme && (
              <div className="flex items-center gap-2">
                <span>主题:</span>
                <span className="font-bold">{artwork.theme}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            返回列表
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
