import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type Artwork } from "@shared/schema";
import VideoPlayer from "@/components/video-player";
import CommentSection from "@/components/comment-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ZoomIn, ZoomOut, Download, Info, Video, MessageSquare, HelpCircle } from "lucide-react";
import { useState } from "react";
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
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState("info");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  // 提取有效的数字ID
  const extractNumericId = (id: string | undefined): number | null => {
    if (!id) {
      console.error('URL参数中没有ID');
      return null;
    }

    console.log(`开始处理ID: ${id}, 类型: ${typeof id}`);

    // 处理复合格式的ID，如 "art-12-15"
    if (typeof id === 'string' && id.includes('-')) {
      const parts = id.split('-');
      if (parts.length >= 2) {
        const numericPart = parseInt(parts[1]);
        if (!isNaN(numericPart)) {
          console.log(`从复合ID "${id}" 提取出数字ID: ${numericPart}`);
          return numericPart;
        }
      }
    }

    // 尝试直接将ID转为数字
    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      console.log(`将ID "${id}" 直接转换为数字: ${numericId}`);
      return numericId;
    }

    console.error(`无法从 "${id}" 提取有效的数字ID`);
    return null;
  };

  const numericId = extractNumericId(id);
  console.log(`ArtworkPage: 接收到的原始ID=${id}, 处理后的数字ID=${numericId}`);

  const { data: artwork, isLoading, isError, error } = useQuery<Artwork>({
    queryKey: ["artwork", numericId],
    queryFn: async () => {
      console.log(`尝试获取作品，原始ID: ${id}, 处理后ID: ${numericId}`);

      if (!numericId) {
        console.error('作品ID无效:', id);
        throw new Error("作品ID无效");
      }

      // 确保使用数字ID发送请求
      const apiUrl = `/api/artworks/${numericId}`;
      console.log(`发送API请求: ${apiUrl}`);
      const res = await fetch(apiUrl);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("找不到作品");
        }
        if (res.status === 403) {
          throw new Error("此作品需要高级会员才能查看");
        }
        throw new Error("获取作品失败");
      }
      console.log("获取到的作品数据:", await res.clone().json());
      return res.json();
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
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {(error as Error).message || "Failed to load artwork"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            找不到作品
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                      className="h-full w-full object-cover" 
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
            <h1 className="text-3xl font-bold">{artwork.title}</h1>
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
                <CommentSection artworkId={parseInt(String(numericId))} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}