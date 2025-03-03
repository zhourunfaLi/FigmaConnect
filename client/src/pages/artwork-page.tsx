import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { type Artwork } from "@shared/schema";
import VideoPlayer from "@/components/video-player";
import CommentSection from "@/components/comment-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ZoomIn, ZoomOut, Download, Info, Video, MessageSquare, HelpCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

// 模拟的艺术品知识问答
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
  const [setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState("info");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  // 从URL路径解析作品ID
  const urlPath = window.location.pathname;
  const pathSegments = urlPath.split('/').filter(Boolean);
  const idFromPath = pathSegments.length > 1 && pathSegments[0] === 'artwork' ? pathSegments[1] : null;

  // 解析作品ID的逻辑
  let artworkId: number | null = null;

  try {
    if (idFromPath) {
      console.log(`解析URL路径: ${urlPath}, 提取ID: ${idFromPath}`);

      // 尝试直接解析为数字ID
      const parsedId = parseInt(idFromPath);
      if (!isNaN(parsedId)) {
        artworkId = parsedId;
        console.log(`成功解析数字ID: ${artworkId}`);
      } 
      // 如果是复合ID格式（如"art-17-0"）
      else if (idFromPath.includes('-')) {
        const parts = idFromPath.split('-');
        if (parts.length > 1) {
          const imageId = parseInt(parts[1]);
          if (!isNaN(imageId)) {
            artworkId = imageId;
            console.log(`成功解析复合ID: ${idFromPath} -> ${artworkId}`);
          }
        }
      }
    }

    // 如果ID解析失败，标记错误状态而不是立即返回
    if (artworkId === null) {
      console.warn(`无法解析有效的作品ID: ${idFromPath}，将使用默认ID`);
      // 不再自动重定向，而是使用一个可能存在的ID或显示错误
      artworkId = 9; // 使用一个可能存在的ID，避免立即重定向
    }
  } catch (err) {
    console.error("ID解析过程中出错:", err);
    artworkId = 9; // 出错时使用默认ID
  }

  console.log(`ArtworkPage: URL路径=${urlPath}, 解析后ID=${artworkId}`);


  // 如果ID无效，在所有hooks之后再处理重定向
  if (artworkId === null || artworkId === undefined || isNaN(artworkId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            无法加载作品，请检查作品ID.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 获取作品数据
  const { data: artwork, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['artwork', artworkId],
    queryFn: async () => {
      console.log(`正在请求作品数据，ID=${artworkId}`);

      try {
        // 验证ID是否有效
        if (!artworkId || artworkId <= 0 || isNaN(Number(artworkId))) {
          throw new Error(`无效的作品ID: ${artworkId}`);
        }

        const apiUrl = `/api/artworks/${artworkId}`;
        console.log(`发送API请求: ${apiUrl}`);

        const response = await fetch(apiUrl);
        console.log(`收到响应: 状态=${response.status}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`找不到ID为 ${artworkId} 的作品`);
          }
          throw new Error(`获取作品失败: HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // 验证返回的数据
        if (!data || !data.id) {
          throw new Error(`返回的作品数据无效`);
        }

        console.log(`成功获取作品数据:`, data);
        return data;
      } catch (err: any) {
        console.error(`作品请求异常:`, {
          message: err.message,
          stack: err.stack
        });
        throw err;
      }
    },
    retry: false, // 不自动重试，避免重复错误
    staleTime: 1000 * 60 * 10, // 10分钟内不重新请求
    onError: (err: any) => {
      console.error(`作品查询错误:`, {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
    }
  });

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const handleDownload = () => {
    if (!artwork) return;

    if (artwork.isPremium && !user.isPremium) {
      toast({
        title: "仅限高级会员",
        description: "此作品需要高级会员才能下载原图",
        variant: "destructive"
      });
      return;
    }

    // 实际下载逻辑
    const link = document.createElement('a');
    link.href = artwork?.imageUrl || '';
    link.download = `${artwork?.title || 'artwork'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "下载开始",
      description: "原图已开始下载",
    });
  };

  const handleQuizSubmit = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuizAnswers([]);
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    // 确保错误信息正确显示
    const errorMessage = error instanceof Error 
      ? error.message 
      : `无法加载作品 (ID: ${idFromPath})`;

    console.log(`显示错误信息: ${errorMessage}`);

    return (
      <div className="flex items-center justify-center min-h-[70vh] p-4">
        <div className="text-center max-w-md p-6 bg-gray-50 rounded-lg shadow">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {errorMessage}
          </h2>
          <p className="text-gray-600 mb-6">
            可能是作品已被删除或移动，或者服务器暂时无法响应。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button onClick={() => refetch()} className="w-full sm:w-auto">
              重试加载
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation('/')} 
              className="w-full sm:w-auto"
            >
              返回首页
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            {idFromPath ? `找不到ID为 ${idFromPath} 的作品` : '作品ID无效或缺失'}
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
    <div className="container mx-auto px-4 py-8"> {/* Minimal UI change based on incomplete instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左侧作品区域 */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <AspectRatio ratio={4/3} className="overflow-hidden bg-muted">
                  <div style={{ transform: `scale(${zoomLevel / 100})`, transition: "transform 0.2s" }} className="h-full w-full">
                    <img 
                      src={artwork.imageUrl} 
                      alt={artwork.title} 
                      className="h-full w-full object-cover rounded-xl" {/* Added rounded corners */}
                    />
                  </div>
                </AspectRatio>

                {/* 缩放控制 */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 p-2 bg-white/80 rounded-lg">
                  <ZoomOut className="h-4 w-4" />
                  <Slider
                    value={[zoomLevel]}
                    min={50}
                    max={200}
                    step={10}
                    className="w-32"
                    onValueChange={handleZoomChange}
                  />
                  <ZoomIn className="h-4 w-4" />
                </div>
              </div>

              {/* 下载按钮 */}
              <div className="mt-4 flex justify-end">
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  下载图片
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 视频播放 */}
          {artwork.videoUrl && (
            <Card>
              <CardContent className="p-6">
                <VideoPlayer videoUrl={artwork.videoUrl} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* 右侧信息区域 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-lg text-[#090909] font-normal mb-4">{artwork.title}</h1> {/* Adjusted heading size */}
            <p className="text-muted-foreground mt-2">{artwork.isPremium && "会员专享"}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="info" className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                <span>信息</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                <span>视频</span>
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>评论</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="border rounded-md p-4 mt-2">
              <h3 className="text-lg font-semibold mb-2">作品详情</h3>
              <p className="text-muted-foreground">{artwork.description}</p>

              {/* 知识互动区 */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">艺术知识互动</h3>
                </div>

                {!showResults ? (
                  <div className="space-y-4">
                    {MOCK_QUIZ.map((quiz, quizIndex) => (
                      <div key={quizIndex} className="border rounded-md p-3">
                        <h4 className="font-medium mb-2">{quiz.question}</h4>
                        <div className="space-y-2">
                          {quiz.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center">
                              <input
                                type="radio"
                                id={`quiz-${quizIndex}-${optionIndex}`}
                                name={`quiz-${quizIndex}`}
                                checked={quizAnswers[quizIndex] === optionIndex}
                                onChange={() => {
                                  const newAnswers = [...quizAnswers];
                                  newAnswers[quizIndex] = optionIndex;
                                  setQuizAnswers(newAnswers);
                                }}
                                className="mr-2"
                              />
                              <label htmlFor={`quiz-${quizIndex}-${optionIndex}`}>{option}</label>
                            </div>
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
                        感谢参与问答！通过这些问题，您可以更深入地了解这件艺术品
                      </p>
                    </div>

                    <Button variant="outline" onClick={resetQuiz} className="w-full">
                      重新作答
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="video">
              {artwork.videoUrl ? (
                <div className="border rounded-md p-4 mt-2">
                  <h3 className="text-lg font-semibold mb-2">相关视频</h3>
                  <p className="text-muted-foreground mb-4">观看详细解说和创作过程</p>
                  <VideoPlayer videoUrl={artwork.videoUrl} />
                </div>
              ) : (
                <div className="border rounded-md p-4 mt-2 text-center">
                  <p className="text-muted-foreground">该作品暂无视频内容</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="comments">
              <div className="border rounded-md p-4 mt-2">
                <CommentSection artworkId={parseInt(String(artworkId))} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}