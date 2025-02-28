
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

// 模拟的趣味问答数据
const MOCK_QUIZ = [
  {
    question: "这幅作品创作于哪一年？",
    options: ["1889年", "1890年", "1899年", "1900年"],
    correctAnswer: 1
  },
  {
    question: "这幅作品使用了什么技法？",
    options: ["油画", "水彩", "版画", "素描"],
    correctAnswer: 0
  },
  {
    question: "这幅作品描绘了什么场景？",
    options: ["城市风光", "山水景色", "人物肖像", "静物写生"],
    correctAnswer: 2
  }
];

export default function ArtworkPage() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { data: artwork, isError, error, isLoading } = useQuery<Artwork>({
    queryKey: [`/api/artworks/${id}`],
    enabled: id > 0,
    retry: false,
  });

  const handleDownload = () => {
    if (!user) {
      toast({
        title: "需要登录",
        description: "请先登录以下载原图",
        variant: "destructive"
      });
      return;
    }

    if (artwork?.isPremium && !user.isPremium) {
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
      <Card>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>

          <div className="mb-8">
            <div className="relative mb-4">
              <AspectRatio ratio={4/3}>
                <div 
                  className="w-full h-full overflow-auto bg-gray-100 rounded-lg"
                  style={{ position: 'relative' }}
                >
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-contain transition-transform duration-200 ease-out"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: '0 0',
                      maxWidth: 'none',
                      maxHeight: 'none'
                    }}
                  />
                </div>
              </AspectRatio>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <ZoomOut className="w-4 h-4 text-gray-500" />
                  <Slider
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                    min={1}
                    max={4}
                    step={0.1}
                    className="w-48"
                  />
                  <ZoomIn className="w-4 h-4 text-gray-500" />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  下载原图
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="details" className="flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">作品介绍</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-1" disabled={!artwork.videoUrl}>
                  <Video className="w-4 h-4" />
                  <span className="hidden sm:inline">视频讲解</span>
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">趣味问答</span>
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">评论讨论</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <h2 className="text-2xl font-bold mb-4">作品介绍</h2>
                <p className="text-lg text-muted-foreground">
                  {artwork.description}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-medium">艺术家</h3>
                    <p className="text-muted-foreground">Vincent van Gogh</p>
                  </div>
                  <div>
                    <h3 className="font-medium">创作年份</h3>
                    <p className="text-muted-foreground">1889</p>
                  </div>
                  <div>
                    <h3 className="font-medium">材质</h3>
                    <p className="text-muted-foreground">油画</p>
                  </div>
                  <div>
                    <h3 className="font-medium">尺寸</h3>
                    <p className="text-muted-foreground">73.7 × 92.1 cm</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="video" className="mt-6">
                <h2 className="text-2xl font-bold mb-4">视频讲解</h2>
                {artwork.videoUrl ? (
                  <VideoPlayer url={artwork.videoUrl} />
                ) : (
                  <Alert>
                    <AlertDescription>
                      暂无视频讲解
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="quiz" className="mt-6">
                <h2 className="text-2xl font-bold mb-4">趣味问答</h2>
                <div className="space-y-6">
                  {MOCK_QUIZ.map((quiz, quizIndex) => (
                    <div key={quizIndex} className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">{quiz.question}</h3>
                      <div className="space-y-2">
                        {quiz.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className={`p-3 border rounded-md cursor-pointer transition-colors ${
                              quizAnswers[quizIndex] === optionIndex 
                                ? 'bg-primary text-primary-foreground' 
                                : 'hover:bg-muted'
                            } ${
                              showResults && optionIndex === quiz.correctAnswer
                                ? 'bg-green-100 border-green-500'
                                : ''
                            } ${
                              showResults && quizAnswers[quizIndex] === optionIndex && optionIndex !== quiz.correctAnswer
                                ? 'bg-red-100 border-red-500'
                                : ''
                            }`}
                            onClick={() => {
                              if (!showResults) {
                                const newAnswers = [...quizAnswers];
                                newAnswers[quizIndex] = optionIndex;
                                setQuizAnswers(newAnswers);
                              }
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end gap-4">
                    {showResults ? (
                      <Button onClick={resetQuiz}>重新作答</Button>
                    ) : (
                      <Button 
                        onClick={handleQuizSubmit}
                        disabled={quizAnswers.length !== MOCK_QUIZ.length}
                      >
                        提交答案
                      </Button>
                    )}
                  </div>
                  
                  {showResults && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-2">得分: {
                        quizAnswers.filter((answer, index) => answer === MOCK_QUIZ[index].correctAnswer).length
                      } / {MOCK_QUIZ.length}</h3>
                      <p className="text-sm text-muted-foreground">
                        感谢参与问答！通过这些问题，您可以更深入地了解这件艺术品。
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-6">
                <h2 className="text-2xl font-bold mb-4">评论讨论</h2>
                <CommentSection artworkId={artwork.id} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
