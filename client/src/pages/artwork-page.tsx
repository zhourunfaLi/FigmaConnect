
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { type Artwork } from "@shared/schema";
import VideoPlayer from "@/components/video-player";
import CommentSection from "@/components/comment-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, ZoomIn, ZoomOut, Download, Info, 
  Video, MessageSquare, HelpCircle, Heart, 
  Share2, Eye, Tag, Calendar, User, Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { fetchArtworkById, fetchRelatedArtworks } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 用于模拟的相关艺术品数据
const MOCK_RELATED_ARTWORKS = [
  { id: 101, title: "相关作品 1", imageUrl: "https://placehold.co/300x400", artist: "艺术家 A" },
  { id: 102, title: "相关作品 2", imageUrl: "https://placehold.co/300x400", artist: "艺术家 B" },
  { id: 103, title: "相关作品 3", imageUrl: "https://placehold.co/300x400", artist: "艺术家 C" },
  { id: 104, title: "相关作品 4", imageUrl: "https://placehold.co/300x400", artist: "艺术家 D" }
];

// 艺术品知识问答
const MOCK_QUIZ = [
  {
    question: "这件作品创作于哪个年代？",
    options: ["17世纪", "18世纪", "19世纪", "20世纪"],
    correctAnswer: 2
  },
  {
    question: "作品主要使用了什么技法？",
    options: ["油画", "水彩", "粉彩", "丙烯"],
    correctAnswer: 0
  },
  {
    question: "作品所属的艺术流派是？",
    options: ["现实主义", "印象派", "抽象主义", "超现实主义"],
    correctAnswer: 1
  }
];

export default function ArtworkPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState("info");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // 改进ID处理逻辑
  let artworkId = null;
  try {
    if (id) {
      // 尝试直接解析为数字ID
      const parsedId = parseInt(id);
      if (!isNaN(parsedId)) {
        artworkId = parsedId;
        console.log(`成功解析数字ID: ${artworkId}`);
      } 
      // 如果是复合ID格式（如"art-17-0"）
      else if (id.includes('-')) {
        const parts = id.split('-');
        if (parts.length >= 2) {
          const imageId = parseInt(parts[1]);
          if (!isNaN(imageId)) {
            artworkId = imageId;
            console.log(`成功解析复合ID: ${id} -> ${artworkId}`);
          }
        }
      }
    }
  } catch (e) {
    console.error("ID解析错误:", e);
  }

  // 如果无法解析有效ID，使用默认ID (1)
  if (!artworkId) {
    console.warn(`无法解析有效的作品ID: ${id}，将使用默认ID`);
    artworkId = 1;
  }

  console.log(`ArtworkPage: URL路径参数=${id}, 解析后ID=${artworkId}`);

  // 获取作品详情
  const { data: artwork, error, isLoading } = useQuery({
    queryKey: ['artwork', artworkId],
    queryFn: () => {
      console.log(`正在请求作品数据，ID=${artworkId}`);
      return fetchArtworkById(artworkId);
    },
    enabled: !!artworkId,
    staleTime: 1000 * 60 * 5, // 5分钟内不重新获取
  });

  // 获取分享URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, [id]);

  // 处理问答选择
  const handleQuizAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  // 提交问答答案
  const handleQuizSubmit = () => {
    setShowResults(true);
    toast({
      title: "答案已提交",
      description: `您答对了 ${quizAnswers.filter((answer, index) => answer === MOCK_QUIZ[index].correctAnswer).length} 道题目。`,
    });
  };

  // 处理缩放变化
  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  // 处理下载
  const handleDownload = () => {
    if (artwork?.imageUrl) {
      const a = document.createElement('a');
      a.href = artwork.imageUrl;
      a.download = `${artwork.title || 'artwork'}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "下载开始",
        description: "图片已开始下载。",
      });
    }
  };

  // 处理收藏
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "已取消收藏" : "已添加到收藏",
      description: isLiked ? "已从您的收藏中移除" : "已添加到您的收藏列表",
    });
  };

  // 处理分享
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: artwork?.title || "艺术品详情",
          text: artwork?.description || "查看这件精彩的艺术品",
          url: shareUrl
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "链接已复制",
          description: "作品链接已复制到剪贴板。",
        });
      }
    } catch (error) {
      console.error("分享失败:", error);
    }
  };

  // 加载中状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">正在加载作品详情...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : `无法加载作品 (ID: ${id})`;
    
    console.log(`显示错误信息: ${errorMessage}`);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => setLocation('/')}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            {id ? `找不到ID为 ${id} 的作品` : '作品ID无效或缺失'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => setLocation('/')}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 页面标题和导航面包屑 */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-2">
          <button onClick={() => setLocation('/')} className="hover:underline">首页</button>
          <span className="mx-2">/</span>
          <button onClick={() => setLocation('/category/all')} className="hover:underline">作品集</button>
          <span className="mx-2">/</span>
          <span className="font-medium text-foreground">{artwork.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：作品图片/视频区域 */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-0 relative group">
              {/* 作品图片 */}
              <div className="relative overflow-hidden" style={{ transform: `scale(${zoomLevel / 100})` }}>
                <AspectRatio ratio={artwork.aspect_ratio ? parseFloat(artwork.aspect_ratio.toString()) : 4/3}>
                  <img 
                    src={artwork.imageUrl || "https://placehold.co/800x600?text=图片无法加载"} 
                    alt={artwork.title} 
                    className="object-cover w-full h-full transition-all duration-300"
                  />
                </AspectRatio>
              </div>

              {/* 悬浮操作区域 */}
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="bg-black/60 hover:bg-black/80 text-white rounded-full h-10 w-10"
                  onClick={handleLike}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="bg-black/60 hover:bg-black/80 text-white rounded-full h-10 w-10"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="bg-black/60 hover:bg-black/80 text-white rounded-full h-10 w-10"
                  onClick={handleDownload}
                >
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="p-4 bg-muted/30">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <ZoomOut className="h-4 w-4" />
                  <Slider
                    value={[zoomLevel]}
                    min={50}
                    max={150}
                    step={10}
                    className="w-32"
                    onValueChange={handleZoomChange}
                  />
                  <ZoomIn className="h-4 w-4" />
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{Math.floor(Math.random() * 10000)}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>{artwork.likes || 0}</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* 视频播放器 (如果有视频) */}
          {artwork.videoUrl && (
            <Card className="overflow-hidden shadow-md">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  作品视频介绍
                </h3>
                <VideoPlayer videoUrl={artwork.videoUrl} />
              </CardContent>
            </Card>
          )}

          {/* 相关作品推荐 */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">相关推荐</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MOCK_RELATED_ARTWORKS.map((item) => (
                  <div key={item.id} className="group cursor-pointer" onClick={() => setLocation(`/artwork/${item.id}`)}>
                    <div className="overflow-hidden rounded-md mb-2">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="text-sm font-medium truncate">{item.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{item.artist}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：作品信息区域 */}
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardContent className="p-6">
              {/* 作品标题和作者 */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
                {artwork.isPremium && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 mb-2">
                    会员专享
                  </Badge>
                )}
                <div className="flex items-center mt-3">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="https://placehold.co/100" alt="艺术家" />
                    <AvatarFallback>艺术家</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">梵高</div>
                    <div className="text-sm text-muted-foreground">荷兰印象派画家</div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />
              
              {/* 作品信息列表 */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">创作时间</div>
                    <div className="text-sm text-muted-foreground">1888年-1889年</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Tag className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">艺术流派</div>
                    <div className="text-sm text-muted-foreground">印象派</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Eye className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">尺寸</div>
                    <div className="text-sm text-muted-foreground">92.1 cm × 73 cm</div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* 标签 */}
              <div className="mb-6">
                <div className="text-sm font-medium mb-2">标签</div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">印象派</Badge>
                  <Badge variant="outline">梵高</Badge>
                  <Badge variant="outline">向日葵</Badge>
                  <Badge variant="outline">静物</Badge>
                  <Badge variant="outline">油画</Badge>
                </div>
              </div>

              {/* 作品详情切换选项卡 */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="info" className="flex items-center justify-center">
                    <Info className="h-4 w-4 mr-1" />
                    <span>描述</span>
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 mr-1" />
                    <span>问答</span>
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>评论</span>
                  </TabsTrigger>
                </TabsList>

                {/* 作品描述 */}
                <TabsContent value="info" className="mt-4">
                  <div className="space-y-4 text-sm leading-relaxed">
                    <p>{artwork.description || "暂无详细描述"}</p>
                    <p>
                      《向日葵》是荷兰后印象派画家文森特·梵高创作的一系列静物油画，以向日葵为主题。
                      梵高绘制了两组《向日葵》系列画，第一组是在巴黎期间（1887年）创作的，
                      第二组是在法国南部阿尔勒期间（1888年-1889年）所作，以后者尤为著名。
                    </p>
                    <p>
                      向日葵对梵高具有特殊的象征意义，代表着光明、生命力和希望。
                      在阿尔勒时期，梵高将这些作品挂在他的黄色小屋里，准备迎接即将到来的画家好友保罗·高更。
                      这些向日葵画作被认为是梵高艺术生涯中最具标志性的作品之一。
                    </p>
                  </div>
                </TabsContent>

                {/* 问答内容 */}
                <TabsContent value="quiz" className="mt-4">
                  {!showResults ? (
                    <div className="space-y-6">
                      {MOCK_QUIZ.map((quiz, questionIndex) => (
                        <div key={questionIndex} className="space-y-3 border-b pb-4 last:border-b-0">
                          <h3 className="font-medium text-base">
                            {questionIndex + 1}. {quiz.question}
                          </h3>
                          <div className="grid gap-2">
                            {quiz.options.map((option, optionIndex) => (
                              <button
                                key={optionIndex}
                                onClick={() => handleQuizAnswerSelect(questionIndex, optionIndex)}
                                className={`text-left px-3 py-2 border rounded-md text-sm ${
                                  quizAnswers[questionIndex] === optionIndex
                                    ? 'bg-primary/10 border-primary'
                                    : 'hover:bg-muted'
                                }`}
                              >
                                {String.fromCharCode(65 + optionIndex)}. {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      <Button 
                        onClick={handleQuizSubmit} 
                        disabled={quizAnswers.length !== MOCK_QUIZ.length}
                        className="w-full"
                      >
                        提交答案
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 bg-muted/50">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">您的得分: {quizAnswers.filter((answer, index) => answer === MOCK_QUIZ[index].correctAnswer).length} / {MOCK_QUIZ.length}</h3>
                        <p className="text-sm text-muted-foreground">
                          感谢参与问答！通过这些问题，您可以更深入地了解这件艺术品的背景和特点。
                        </p>
                      </div>
                      <div className="space-y-4">
                        {MOCK_QUIZ.map((quiz, questionIndex) => (
                          <div key={questionIndex} className="space-y-2 border-b pb-3 last:border-b-0">
                            <h4 className="font-medium text-sm">{questionIndex + 1}. {quiz.question}</h4>
                            <div className="grid gap-2">
                              {quiz.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`text-sm px-3 py-1.5 rounded-md ${
                                    quiz.correctAnswer === optionIndex
                                      ? 'bg-green-100 text-green-800'
                                      : quizAnswers[questionIndex] === optionIndex && quiz.correctAnswer !== optionIndex
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-muted/50'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optionIndex)}. {option}
                                  {quiz.correctAnswer === optionIndex && ' ✓'}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={() => {
                          setQuizAnswers([]);
                          setShowResults(false);
                        }}
                        variant="outline"
                        className="mt-4"
                      >
                        重新答题
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* 评论区 */}
                <TabsContent value="comments" className="mt-4">
                  <CommentSection artworkId={artworkId} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
