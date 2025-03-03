import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ZoomIn,
  ZoomOut,
  Download,
  Info,
  MessageSquare as Message,
  HelpCircle,
  Video,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";
import VideoPlayer from "@/components/video-player";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "wouter"; // Added import for useParams
import { type Artwork } from "@shared/schema"; // Added import for Artwork type


// Mock data for demonstration
const mockComments = [
  { id: 1, username: "ArtLover", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix", content: "This is such a magnificent piece! The use of color is extraordinary.", timestamp: "2023-06-15T09:30:00" },
  { id: 2, username: "GalleryOwner", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka", content: "I've been following this artist for years. Their evolution is remarkable.", timestamp: "2023-06-16T15:20:00" },
  { id: 3, username: "ArtHistorian", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mimi", content: "The influence of the Renaissance period is evident in this work.", timestamp: "2023-06-17T11:45:00" },
  { id: 4, username: "Curator123", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jasper", content: "We featured this in our spring exhibition last year. It was the highlight of the show!", timestamp: "2023-06-18T14:10:00" },
];

const mockQuizQuestions = [
  { id: 1, question: "Did the artist create this during their 'Blue Period'?", answer: "NO" },
  { id: 2, question: "Was this painting completed in a single day?", answer: "NO" },
  { id: 3, question: "Is this considered one of the artist's most famous works?", answer: "YES" },
  { id: 4, question: "Did the artist use traditional oil painting techniques?", answer: "YES" },
  { id: 5, question: "Was this artwork initially rejected by critics?", answer: "YES" },
];

export default function ArtworkPage() {
  // Extract artwork ID from URL
  const { id } = useParams<{ id: string }>(); // Use useParams correctly
  const [, params] = useLocation();
  const defaultArtworkId = 1; // Fallback ID
  const [artworkId, setArtworkId] = useState<number>(defaultArtworkId);

  useEffect(() => {
    let parsedId = defaultArtworkId;
    if (id) {
      const numId = parseInt(id, 10);
      if (!isNaN(numId)) {
        parsedId = numId;
      }
    }
    setArtworkId(parsedId);
    console.log("ArtworkPage: URL路径参数=" + params, "解析后ID=" + artworkId);
  }, [params, id]); // Add id to dependency array

  // State for image zoom
  const [zoom, setZoom] = useState(1);

  // State for quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // State for comments
  const [commentExpanded, setCommentExpanded] = useState<Record<number, boolean>>({});
  const [newComment, setNewComment] = useState("");

  // Toast notifications
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch artwork data
  const { data: artwork, error, isLoading } = useQuery({
    queryKey: [`/api/artworks/${artworkId}`],
    queryFn: async () => {
      console.log("正在请求作品数据，ID=" + artworkId);
      console.log("发送API请求: /api/artworks/" + artworkId);
      const response = await fetch(`/api/artworks/${artworkId}`);
      console.log("收到响应: 状态=" + response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch artwork: ${response.status}`);
      }
      const data = await response.json();
      console.log("成功获取作品数据:", data);
      return data as Artwork; //Ensure type safety
    },
  });

  // Handle zoom in/out
  const handleZoomIn = () => {
    if (zoom < 2) setZoom(zoom + 0.1);
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) setZoom(zoom - 0.1);
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  // Handle download
  const handleDownload = () => {
    if (artwork?.imageUrl) {
      const link = document.createElement("a");
      link.href = artwork.imageUrl;
      link.download = artwork.title || "artwork";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "下载开始",
        description: "图片下载已开始",
      });
    }
  };

  // Handle quiz answers
  const handleQuizAnswer = (questionId: number, answer: string) => {
    if (!quizSubmitted) {
      setQuizAnswers({
        ...quizAnswers,
        [questionId]: answer
      });
    }
  };

  // Submit quiz
  const handleQuizSubmit = () => {
    if (Object.keys(quizAnswers).length === 0) {
      toast({
        title: "请先回答问题",
        description: "请先回答至少一个问题再提交",
        variant: "destructive",
      });
      return;
    }

    let score = 0;
    mockQuizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.answer) {
        score += 10;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    toast({
      title: "测验已提交",
      description: `您的得分是: ${score}/${mockQuizQuestions.length * 10}`,
    });
  };

  // Toggle comment expansion
  const handleToggleComment = (commentId: number) => {
    setCommentExpanded({
      ...commentExpanded,
      [commentId]: !commentExpanded[commentId]
    });
  };

  // Submit new comment
  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "评论不能为空",
        description: "请输入评论内容",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录才能发表评论",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "评论已提交",
      description: "您的评论已成功发布",
    });
    setNewComment("");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center items-center">加载中...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <p>加载错误: {(error as Error).message}</p>
      </div>
    );
  }

  if (!artwork) {
    return <div className="p-8">未找到作品数据</div>;
  }

  const artworkMetadata = {
    artist: "文森特·梵高",
    year: "1888",
    dimensions: "92.1 × 73 厘米",
    location: "荷兰阿姆斯特丹国家美术馆"
  };

  return (
    <div className="p-2 space-y-4">
      {/* 1. 作品展示互动区 */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}>
              <AspectRatio ratio={16/9}>
                <img
                  src={artwork.imageUrl || "https://placehold.co/1200x800"}
                  alt={artwork.title}
                  className="rounded-md object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/50 rounded-lg p-2 flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4 text-white" />
              </Button>
              <div className="w-32">
                <Slider
                  value={[zoom]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={handleZoomChange}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. 基础信息区 */}
      <Card>
        <CardContent className="p-4">
          <h1 className="text-2xl font-bold mb-2">{artwork.title}</h1>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">艺术家</p>
              <p>{artworkMetadata.artist}</p>
            </div>
            <div>
              <p className="text-muted-foreground">年代</p>
              <p>{artworkMetadata.year}</p>
            </div>
            <div>
              <p className="text-muted-foreground">尺寸</p>
              <p>{artworkMetadata.dimensions}</p>
            </div>
            <div>
              <p className="text-muted-foreground">收藏地</p>
              <p>{artworkMetadata.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. 作品介绍区 */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            作品简介
          </h2>
          <p className="text-sm">
            {artwork.description || "这是梵高最著名的作品之一，描绘了盛开的向日葵。这幅作品是他在阿尔勒期间创作的向日葵系列之一，表现了艺术家对生命和自然的热爱。画中的向日葵色彩鲜艳，充满活力，是梵高艺术创作的代表作。他使用了丰富的黄色和金色调，创造出一种充满阳光和积极能量的氛围。这幅画不仅是对自然的赞美，也是艺术家内心情感的表达。"}
          </p>
          <p className="text-sm mt-2">
            梵高的向日葵系列在艺术史上具有重要地位，影响了后来许多艺术流派和艺术家。这幅作品通过其独特的笔触和色彩运用，展现了梵高对印象派技法的创新和突破，同时也体现了他对后印象派风格的探索。
          </p>
        </CardContent>
      </Card>

      {/* 4. 视频讲解区 */}
      {artwork.videoUrl && (
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Video className="h-5 w-5 mr-2" />
              视频讲解
            </h2>
            <VideoPlayer url={artwork.videoUrl} />
          </CardContent>
        </Card>
      )}

      {/* 5. 趣味问答区 */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            趣味问答
          </h2>
          <div className="space-y-3">
            {mockQuizQuestions.map((question) => (
              <div key={question.id} className="border p-3 rounded-md">
                <p className="font-medium mb-2">{question.question}</p>
                <div className="flex space-x-2">
                  <Button
                    variant={quizAnswers[question.id] === "YES" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuizAnswer(question.id, "YES")}
                    disabled={quizSubmitted}
                  >
                    是
                  </Button>
                  <Button
                    variant={quizAnswers[question.id] === "NO" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuizAnswer(question.id, "NO")}
                    disabled={quizSubmitted}
                  >
                    否
                  </Button>
                  {quizSubmitted && (
                    <span className={`ml-2 text-sm ${quizAnswers[question.id] === question.answer ? "text-green-500" : "text-red-500"}`}>
                      {quizAnswers[question.id] === question.answer ? "✓ 正确" : "✗ 错误"}
                    </span>
                  )}
                </div>
                {quizSubmitted && (
                  <p className="text-sm mt-1 text-muted-foreground">
                    正确答案: {question.answer === "YES" ? "是" : "否"}
                  </p>
                )}
              </div>
            ))}

            {!quizSubmitted ? (
              <Button onClick={handleQuizSubmit} className="w-full mt-2">提交答案</Button>
            ) : (
              <div className="bg-slate-100 p-3 rounded-md mt-2">
                <p className="font-semibold">您的得分: {quizScore}/{mockQuizQuestions.length * 10}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 6. 用户评论区 */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <Message className="h-5 w-5 mr-2" />
            用户评论
          </h2>

          <div className="space-y-4 mb-4">
            {mockComments.map((comment) => (
              <div key={comment.id} className="border rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <img
                    src={comment.avatar                    alt={comment.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{comment.username}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</p>
                    </div>
                    <p className={`text-sm mt-1 ${commentExpanded[comment.id] ? '' : 'line-clamp-2'}`}>
                      {comment.content}
                    </p>
                    {comment.content.length > 100 && (
                      <button
                        onClick={() => handleToggleComment(comment.id)}
                        className="text-xs text-blue-500 mt-1"
                      >
                        {commentExpanded[comment.id] ? '收起' : '展开'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="发表您的评论..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleSubmitComment} className="mt-2">
              发布评论
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 7. 原图图片下载区 */}
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              <Download className="h-5 w-5 mr-2" />
              原图下载
            </h2>
            <p className="text-sm text-muted-foreground">
              下载高清原图，了解更多细节
            </p>
          </div>
          <Button onClick={handleDownload} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            下载原图
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}