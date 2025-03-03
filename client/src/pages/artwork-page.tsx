
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Maximize, Minimize, Download, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 模拟用户评论数据
const mockComments = [
  {
    id: 1,
    username: "艺术爱好者",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "这幅作品的用色真是令人惊叹，特别是那种对比度。",
    date: "2023-05-15",
    replies: [
      {
        id: 11,
        username: "色彩研究员",
        avatar: "https://i.pravatar.cc/150?img=5",
        content: "完全同意！梵高的色彩运用一直是研究的热点。",
        date: "2023-05-16",
      }
    ]
  },
  {
    id: 2,
    username: "历史学家",
    avatar: "https://i.pravatar.cc/150?img=2",
    content: "这幅作品创作于艺术家生命的最后阶段，反映了他当时的心理状态。",
    date: "2023-05-10",
    replies: []
  },
  {
    id: 3,
    username: "博物馆策展人",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "我们博物馆最近展出了类似的作品，吸引了大量观众。这种艺术风格始终有其独特魅力。",
    date: "2023-04-28",
    replies: [
      {
        id: 31,
        username: "艺术学生",
        avatar: "https://i.pravatar.cc/150?img=6",
        content: "请问展览持续到什么时候？我很想亲眼看看！",
        date: "2023-04-29",
      },
      {
        id: 32,
        username: "博物馆策展人",
        avatar: "https://i.pravatar.cc/150?img=3",
        content: "展览将持续到下个月底，欢迎您来参观！",
        date: "2023-04-30",
      }
    ]
  },
  {
    id: 4,
    username: "技术分析师",
    avatar: "https://i.pravatar.cc/150?img=4",
    content: "从技术角度看，这幅作品的笔触非常有特点，展现了艺术家独特的表现手法。",
    date: "2023-04-20",
    replies: []
  }
];

// 模拟问答题目
const mockQuizQuestions = [
  {
    id: 1,
    question: "这幅画是梵高在精神病院时期创作的吗？",
    correctAnswer: true
  },
  {
    id: 2,
    question: "《向日葵》系列共有12幅作品？",
    correctAnswer: false
  },
  {
    id: 3,
    question: "梵高的《向日葵》曾被纳粹德国列为"堕落艺术"？",
    correctAnswer: true
  },
  {
    id: 4,
    question: "梵高在生前卖出了大部分《向日葵》系列作品？",
    correctAnswer: false
  },
  {
    id: 5,
    question: "《向日葵》的原作现存于伦敦国家美术馆？",
    correctAnswer: true
  }
];

// 模拟作品基本信息
const mockArtworkInfo = {
  artist: "文森特·梵高",
  year: "1888年",
  size: "92.1厘米 × 73厘米",
  museum: "伦敦国家美术馆"
};

export default function ArtworkPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [artworkId, setArtworkId] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: boolean }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});

  // 解析URL参数获取作品ID
  useEffect(() => {
    console.log("ArtworkPage: URL路径参数=" + id, "解析后ID=" + artworkId);
    const parsedId = id ? parseInt(id, 10) : 1;
    if (!isNaN(parsedId)) {
      setArtworkId(parsedId);
    } else {
      console.log("无法解析有效的作品ID: " + id + "，将使用默认ID");
    }
  }, [id]);

  // 获取作品数据
  const { data: artwork, isLoading } = useQuery(
    [`/api/artworks/${artworkId}`],
    {
      enabled: !!artworkId,
      onSuccess: (data) => {
        console.log("成功获取作品数据:", data);
      },
    }
  );

  // 增加/减少缩放
  const handleZoomChange = (amount: number) => {
    setZoom(prevZoom => {
      const newZoom = prevZoom + amount;
      return Math.min(Math.max(50, newZoom), 200);
    });
  };

  // 处理问答答案选择
  const handleAnswerSelect = (questionId: number, answer: boolean) => {
    if (!quizSubmitted) {
      setUserAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    }
  };

  // 提交问答答案
  const handleQuizSubmit = () => {
    if (Object.keys(userAnswers).length < mockQuizQuestions.length) {
      toast({
        title: "请回答所有问题",
        description: "在提交前，请确保您已回答所有问题。",
        variant: "destructive",
      });
      return;
    }
    setQuizSubmitted(true);
    
    // 计算分数
    const correctCount = mockQuizQuestions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
    const score = correctCount * 10;
    
    toast({
      title: "问答完成！",
      description: `您的得分：${score}分（共50分）`,
    });
  };

  // 重置问答
  const handleQuizReset = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  // 处理评论展开/收起
  const toggleComment = (commentId: number) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // 处理下载原图
  const handleDownload = () => {
    if (artwork) {
      // 在实际应用中，这里应该是高分辨率原图的URL
      const downloadUrl = artwork.imageUrl || "https://placehold.co/1200x1800";
      
      // 创建一个临时链接
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `artwork-${artworkId}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "开始下载",
        description: "原图正在下载中...",
      });
    }
  };

  // 加载状态显示
  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="w-full h-64 bg-gray-300 rounded-md"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 作品详情界面
  return (
    <div className="min-h-screen p-8">
      {/* 1. 作品展示互动区 */}
      <Card className="w-full mb-6">
        <CardContent className="p-6">
          <div 
            style={{ transform: `scale(${zoom / 100})`, transition: "transform 0.3s ease" }}
            className="flex justify-center"
          >
            <AspectRatio 
              ratio={16/9} 
              className="bg-muted overflow-hidden rounded-md max-w-3xl"
            >
              <img 
                src={artwork?.imageUrl || "https://placehold.co/400x600"} 
                alt={artwork?.title || "作品图片"} 
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleZoomChange(-10)}
              disabled={zoom <= 50}
            >
              <Minimize className="h-4 w-4 mr-1" /> 缩小
            </Button>
            <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full" 
                style={{ width: `${zoom/2}%` }}
              ></div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleZoomChange(10)}
              disabled={zoom >= 200}
            >
              <Maximize className="h-4 w-4 mr-1" /> 放大
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* 2. 基础信息区 */}
      <Card className="w-full mb-6">
        <CardContent className="p-6">
          <h2 className="text-3xl font-bold mb-4">{artwork?.title || "向日葵"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">艺术家</p>
              <p className="font-medium">{mockArtworkInfo.artist}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">创作年份</p>
              <p className="font-medium">{mockArtworkInfo.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">尺寸</p>
              <p className="font-medium">{mockArtworkInfo.size}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">收藏于</p>
              <p className="font-medium">{mockArtworkInfo.museum}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 3. 作品介绍区 */}
      <Card className="w-full mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-3">作品简介</h3>
          <div className="text-gray-700">
            <p className="mb-3">
              {artwork?.description || "这是梵高最著名的作品之一。梵高创作了《向日葵》系列，这是艺术史上最著名的系列作品之一。"}
            </p>
            <p className="mb-3">
              梵高的《向日葵》系列是为了装饰他在阿尔的黄房子而创作的，其中最著名的是现存于伦敦国家美术馆的那一幅。这些作品以其明亮的黄色和大胆的笔触而闻名，表现了梵高对生命和希望的热爱。
            </p>
            <p>
              值得注意的是，梵高创作《向日葵》系列时使用了当时新研发的铬黄颜料，这种颜料在当时是非常昂贵的。随着时间的推移，一些作品中的黄色已经褪色，变成了棕色或橄榄绿色。
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* 4. 视频讲解区 */}
      {artwork?.videoUrl && (
        <Card className="w-full mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">视频讲解</h3>
            <div className="aspect-video">
              <iframe 
                src={artwork.videoUrl} 
                className="w-full h-full rounded-md"
                allowFullScreen
                title={`${artwork.title} 视频讲解`}
              ></iframe>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 5. 趣味问答区 */}
      <Card className="w-full mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-3">艺术知识问答</h3>
          <p className="mb-4 text-sm text-gray-600">回答以下问题，测试您对这幅作品的了解。每题10分，满分50分。</p>
          
          <div className="space-y-4">
            {mockQuizQuestions.map((question) => (
              <div key={question.id} className="border p-4 rounded-md">
                <p className="font-medium mb-2">{question.question}</p>
                <div className="flex space-x-4">
                  <Button
                    variant={userAnswers[question.id] === true ? "default" : "outline"}
                    onClick={() => handleAnswerSelect(question.id, true)}
                    disabled={quizSubmitted}
                    className={quizSubmitted && question.correctAnswer === true ? "border-green-500 border-2" : ""}
                  >
                    是
                  </Button>
                  <Button
                    variant={userAnswers[question.id] === false ? "default" : "outline"}
                    onClick={() => handleAnswerSelect(question.id, false)}
                    disabled={quizSubmitted}
                    className={quizSubmitted && question.correctAnswer === false ? "border-green-500 border-2" : ""}
                  >
                    否
                  </Button>
                  
                  {quizSubmitted && (
                    <span className={`text-sm mt-2 ${userAnswers[question.id] === question.correctAnswer ? "text-green-600" : "text-red-600"}`}>
                      {userAnswers[question.id] === question.correctAnswer ? "✓ 正确" : "✗ 错误"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex space-x-4">
            {!quizSubmitted ? (
              <Button onClick={handleQuizSubmit}>提交答案</Button>
            ) : (
              <Button onClick={handleQuizReset} variant="outline">重新答题</Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 6. 用户评论区 */}
      <Card className="w-full mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-3">用户评论</h3>
          
          <div className="space-y-4">
            {mockComments.map((comment) => (
              <div key={comment.id} className="border rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <img
                    src={comment.avatar}
                    alt={comment.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{comment.username}</h4>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                    
                    {comment.replies && comment.replies.length > 0 && (
                      <Collapsible open={expandedComments[comment.id]}>
                        <CollapsibleTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => toggleComment(comment.id)}
                          >
                            {expandedComments[comment.id] ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" /> 收起回复
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" /> 查看回复 ({comment.replies.length})
                              </>
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-2 pl-6 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="border-t pt-3">
                                <div className="flex items-start space-x-2">
                                  <img
                                    src={reply.avatar}
                                    alt={reply.username}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <div>
                                    <div className="flex items-center">
                                      <h5 className="font-medium text-sm">{reply.username}</h5>
                                      <span className="text-xs text-gray-500 ml-2">{reply.date}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm mt-1">{reply.content}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* 7. 原图图片下载区 */}
      <Card className="w-full mb-6">
        <CardContent className="p-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-3">原图下载</h3>
          <p className="text-gray-600 mb-4">下载高清原图，保存艺术珍品。</p>
          
          <Button onClick={handleDownload} className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            下载原图
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
