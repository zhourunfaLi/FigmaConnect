
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { type Artwork } from "@shared/schema";
import VideoPlayer from "@/components/video-player";
import CommentSection from "@/components/comment-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, ZoomIn, ZoomOut, Download, ThumbsUp, ThumbsDown, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// 模拟的艺术品知识问答
const MOCK_QUIZ = [
  {
    question: "这幅作品是在艺术家心情愉悦时创作的？",
    answer: false,
    explanation: "这幅作品是艺术家在精神极度紧张的时期创作的，反映了他内心的挣扎。"
  },
  {
    question: "这幅作品首次展出时就获得了广泛赞誉？",
    answer: false,
    explanation: "首次展出时遭到了严厉的批评，直到艺术家去世多年后才获得认可。"
  },
  {
    question: "这幅作品中使用的黄色颜料是艺术家自己调制的？",
    answer: true,
    explanation: "艺术家确实使用了一种特殊配方的黄色颜料，这使得作品具有独特的视觉效果。"
  },
  {
    question: "作品的构图受到了东方艺术的影响？",
    answer: true,
    explanation: "艺术家受到了日本浮世绘的启发，这影响了作品的空间构成和色彩运用。"
  },
  {
    question: "这幅作品曾经被盗窃过？",
    answer: true,
    explanation: "在1990年代，这幅作品确实被盗过，后来在一次秘密行动中被找回。"
  }
];

// 模拟的评论数据
const MOCK_COMMENTS = [
  {
    id: 1,
    user: {
      name: "艺术爱好者",
      avatar: "https://api.dicebear.com/7.x/micah/svg?seed=art1"
    },
    content: "这幅作品的色彩运用令人震撼，特别是那种强烈的黄色对比，展现了艺术家独特的视角和表达方式。",
    timestamp: "2023-05-15",
    likes: 24,
    replies: [
      {
        id: 11,
        user: {
          name: "色彩研究者",
          avatar: "https://api.dicebear.com/7.x/micah/svg?seed=color1"
        },
        content: "确实如此，这种黄色是特殊颜料调制的，现在很难复制出完全相同的效果。",
        timestamp: "2023-05-15",
        likes: 8
      },
      {
        id: 12,
        user: {
          name: "艺术史学者",
          avatar: "https://api.dicebear.com/7.x/micah/svg?seed=history1"
        },
        content: "这种色彩运用在当时是极其前卫的，打破了传统绘画的规范。",
        timestamp: "2023-05-16",
        likes: 12
      }
    ]
  },
  {
    id: 2,
    user: {
      name: "博物馆常客",
      avatar: "https://api.dicebear.com/7.x/micah/svg?seed=museum1"
    },
    content: "每次看到这幅作品，都能发现新的细节。特别是背景中的那些细微笔触，展现了艺术家对细节的极致追求。",
    timestamp: "2023-05-20",
    likes: 17,
    replies: [
      {
        id: 21,
        user: {
          name: "绘画技法研究者",
          avatar: "https://api.dicebear.com/7.x/micah/svg?seed=tech1"
        },
        content: "是的，使用放大镜观察原作，可以看到许多肉眼难以察觉的精细笔触，这些细节构成了作品的灵魂。",
        timestamp: "2023-05-21",
        likes: 9
      }
    ]
  },
  {
    id: 3,
    user: {
      name: "艺术教师",
      avatar: "https://api.dicebear.com/7.x/micah/svg?seed=teacher1"
    },
    content: "我经常用这幅作品向学生讲解情感如何通过艺术表达。作品中蕴含的那种强烈的情感张力，至今仍然能够触动观者的心灵。",
    timestamp: "2023-06-05",
    likes: 32,
    replies: []
  }
];

export default function ArtworkPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [expandedCommentId, setExpandedCommentId] = useState<number | null>(null);

  // 改进ID处理逻辑
  let artworkId = 1; // 默认ID
  
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
    } else {
      console.log("无法解析有效的作品ID: " + id + "，将使用默认ID");
    }
  } catch (error) {
    console.error("ID解析错误:", error);
  }

  // 获取作品数据
  const { data: artwork, isLoading, error } = useQuery({
    queryKey: ["artwork", artworkId],
    queryFn: async () => {
      console.log("正在请求作品数据，ID=" + artworkId);
      const response = await fetch(`/api/artworks/${artworkId}`);
      console.log("收到响应: 状态=" + response.status);
      if (!response.ok) {
        throw new Error("Failed to fetch artwork");
      }
      const data = await response.json();
      console.log("成功获取作品数据:", data);
      return data as Artwork;
    },
  });

  // 模拟的艺术品额外信息
  const artworkDetails = {
    artist: "文森特·梵高",
    year: "1888年",
    size: "92.1 × 73 厘米",
    museum: "荷兰阿姆斯特丹国家博物馆",
    materials: "油彩、画布",
    technique: "后印象派",
    description: "《向日葵》是梵高最著名的作品之一，他共创作了两组向日葵系列，第一组作于1887年巴黎，描绘了放在地面上的向日葵；第二组则作于1888年阿尔勒，描绘了花瓶中的向日葵。这幅画是第二组中的代表作，展示了梵高对黄色和金色这两种'阳光的颜色'的偏爱。画中的向日葵有的盛开，有的凋谢，象征着生命的循环。梵高希望用这幅画来装饰他的黄房子，为他的朋友高更的到来做准备。这幅作品以其鲜明的色彩对比和强烈的情感表达成为现代艺术的经典之作。"
  };

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const handleQuizAnswer = (index: number, answer: boolean) => {
    const newAnswers = [...quizAnswers];
    newAnswers[index] = answer;
    setQuizAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    if (quizAnswers.length < MOCK_QUIZ.length) {
      toast({
        title: "请回答所有问题",
        description: "在提交前，请确保您已回答所有问题。",
        variant: "destructive",
      });
      return;
    }

    setSubmittedQuiz(true);
    
    // 计算得分
    const correctAnswers = quizAnswers.filter((answer, index) => answer === MOCK_QUIZ[index].answer).length;
    const score = correctAnswers * 10;
    
    toast({
      title: `您的得分: ${score}分`,
      description: `共${MOCK_QUIZ.length}题，答对${correctAnswers}题`,
    });
  };

  const handleDownloadImage = () => {
    if (!artwork) return;
    
    const link = document.createElement('a');
    link.href = artwork.imageUrl;
    link.download = `${artwork.title || 'artwork'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "图片下载已开始",
      description: "图片将保存到您的下载文件夹。",
    });
  };

  const toggleCommentReplies = (commentId: number) => {
    if (expandedCommentId === commentId) {
      setExpandedCommentId(null);
    } else {
      setExpandedCommentId(commentId);
    }
  };

  useEffect(() => {
    // 重置问答状态当作品ID改变时
    setQuizAnswers([]);
    setSubmittedQuiz(false);
  }, [artworkId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">正在加载作品信息...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-8">
        <AlertDescription>
          加载作品信息时出错。请稍后再试。
        </AlertDescription>
      </Alert>
    );
  }

  if (!artwork) {
    return (
      <Alert className="m-8">
        <AlertDescription>
          未找到作品信息。
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-2 py-6">
      {/* 1. 作品展示互动区 */}
      <section className="mb-10">
        <Card>
          <CardContent className="p-6">
            <div className="relative mb-4" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center top', transition: 'transform 0.3s ease' }}>
              <AspectRatio ratio={4/3} className="bg-muted overflow-hidden rounded-md">
                <img 
                  src={artwork.imageUrl || "https://placehold.co/800x600"} 
                  alt={artwork.title} 
                  className="object-cover w-full h-full" 
                />
              </AspectRatio>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Slider
                  value={[zoomLevel]}
                  min={50}
                  max={200}
                  step={5}
                  className="w-[200px]"
                  onValueChange={handleZoomChange}
                />
                <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                缩放: {zoomLevel}%
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 2. 基础信息区 */}
      <section className="mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{artwork.title}</CardTitle>
            <CardDescription>基本信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">艺术家:</span>
                  <span>{artworkDetails.artist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">创作年代:</span>
                  <span>{artworkDetails.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">尺寸:</span>
                  <span>{artworkDetails.size}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">收藏地点:</span>
                  <span>{artworkDetails.museum}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">材质:</span>
                  <span>{artworkDetails.materials}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">风格:</span>
                  <span>{artworkDetails.technique}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. 作品介绍区 */}
      <section className="mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">作品简介</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-7 text-justify">{artworkDetails.description}</p>
          </CardContent>
        </Card>
      </section>

      {/* 4. 视频讲解区 */}
      {(artwork.videoUrl || true) && (
        <section className="mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">视频讲解</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoPlayer 
                url={artwork.videoUrl || "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"} 
                title={`${artwork.title} - 艺术鉴赏`}
              />
            </CardContent>
          </Card>
        </section>
      )}

      {/* 5. 趣味问答区 */}
      <section className="mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">艺术小知识问答</CardTitle>
            <CardDescription>回答以下问题，每答对一题可获得10分！</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOCK_QUIZ.map((quiz, index) => (
                <div key={index} className="border rounded-lg p-4 bg-muted/30">
                  <p className="font-medium mb-3">{index + 1}. {quiz.question}</p>
                  <div className="flex gap-4 mb-2">
                    <Button
                      variant={quizAnswers[index] === true ? "default" : "outline"}
                      size="sm"
                      disabled={submittedQuiz}
                      onClick={() => handleQuizAnswer(index, true)}
                    >
                      是
                    </Button>
                    <Button
                      variant={quizAnswers[index] === false ? "default" : "outline"}
                      size="sm"
                      disabled={submittedQuiz}
                      onClick={() => handleQuizAnswer(index, false)}
                    >
                      否
                    </Button>
                  </div>
                  {submittedQuiz && (
                    <div className={cn(
                      "mt-2 p-2 rounded text-sm",
                      quizAnswers[index] === quiz.answer 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    )}>
                      <p className="font-medium">
                        {quizAnswers[index] === quiz.answer ? "✓ 回答正确!" : "✗ 回答错误!"}
                      </p>
                      <p className="mt-1">{quiz.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!submittedQuiz && (
              <Button 
                className="mt-6 w-full"
                onClick={handleSubmitQuiz}
                disabled={quizAnswers.length < MOCK_QUIZ.length}
              >
                提交答案
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 6. 用户评论区 */}
      <section className="mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">用户评论</CardTitle>
            <CardDescription>共 {MOCK_COMMENTS.length} 条评论</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOCK_COMMENTS.map(comment => (
                <div key={comment.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>{comment.user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{comment.user.name}</h4>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> 
                          <span>{comment.likes}</span>
                        </div>
                        {comment.replies.length > 0 && (
                          <button 
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                            onClick={() => toggleCommentReplies(comment.id)}
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>
                              {comment.replies.length} 回复
                              {expandedCommentId === comment.id ? 
                                <ChevronUp className="inline w-3 h-3 ml-1" /> : 
                                <ChevronDown className="inline w-3 h-3 ml-1" />
                              }
                            </span>
                          </button>
                        )}
                      </div>
                      
                      {expandedCommentId === comment.id && comment.replies.length > 0 && (
                        <div className="ml-6 mt-3 space-y-3 pl-3 border-l">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="flex items-start gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={reply.user.avatar} />
                                <AvatarFallback>{reply.user.name.slice(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <h4 className="text-xs font-medium">{reply.user.name}</h4>
                                  <span className="text-[10px] text-muted-foreground">{reply.timestamp}</span>
                                </div>
                                <p className="text-xs">{reply.content}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="w-3 h-3" />
                                    <span>{reply.likes}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <CommentSection artworkId={artworkId} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 7. 原图图片下载区 */}
      <section className="mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">高清图片下载</CardTitle>
            <CardDescription>下载艺术作品的高分辨率图片</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-center mb-6">
              <p className="mb-2">图片分辨率: 4096 x 3072px</p>
              <p className="mb-4">格式: JPG, 无水印</p>
              <Button 
                variant="default" 
                size="lg" 
                className="gap-2"
                onClick={handleDownloadImage}
              >
                <Download className="w-4 h-4" />
                下载高清原图
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground text-center flex justify-center">
            仅供个人艺术鉴赏和学习研究使用，不得用于商业目的
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
