import React, { useState, useEffect } from "react";
import { useParams } from "wouter";
import { ArrowLeft, Download, Heart, MessageSquare, Share, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function ArtworkPage() {
  const params = useParams();
  const [artworkId, setArtworkId] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<(boolean | undefined)[]>([
    undefined, undefined, undefined, undefined, undefined
  ]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false); // Added fullscreen state
  const { toast } = useToast();

  // 模拟数据
  const artwork = {
    id: 1,
    title: "向日葵",
    artist: "文森特·梵高",
    year: "1889",
    medium: "油画",
    dimensions: "95 × 73 cm",
    description: "这是一幅美丽的向日葵油画", // Removed "梵高的经典作品"
    imageUrl: "https://placehold.co/400x600",
    likeCount: 1256,
    viewCount: 3890,
    shareCount: 546,
  };

  // 模拟问答数据
  const question = {
    text: "这幅画中的向日葵象征着什么？",
    correctAnswer: "生命力与希望",
    options: ["生命力与希望", "忧郁与孤独", "财富与繁荣", "自然与和平"]
  };

  // 模拟评论数据
  const comments = [
    {
      id: 1,
      author: "艺术爱好者",
      avatar: "https://i.pravatar.cc/40?img=1",
      content: "这幅画的色彩对比太震撼了，梵高真的是色彩大师！",
      time: "2天前",
      likes: 43,
      replies: [
        {
          id: 101,
          author: "色彩研究者",
          avatar: "https://i.pravatar.cc/40?img=4",
          content: "没错，他用黄色和蓝色的对比创造出强烈的视觉冲击力。",
          time: "1天前",
          likes: 12
        }
      ]
    },
    {
      id: 2,
      author: "历史学家",
      avatar: "https://i.pravatar.cc/40?img=2",
      content: "这幅作品创作于梵高去世前不久，充满了他对生命的热爱。",
      time: "3天前",
      likes: 28,
      replies: [
        {
          id: 102,
          author: "艺术史专家",
          avatar: "https://i.pravatar.cc/40?img=5",
          content: "是的，这是他晚期作品的一个代表。当时他的精神状态已经不稳定，但创作激情依然高涨。",
          time: "2天前",
          likes: 19
        },
        {
          id: 103,
          author: "熊猫人",
          avatar: "https://i.pravatar.cc/40?img=6",
          content: "那段时期他创作了许多不朽的作品，真的很令人惊叹。",
          time: "1天前",
          likes: 7
        }
      ]
    },
    {
      id: 3,
      author: "新手学画",
      avatar: "https://i.pravatar.cc/40?img=3",
      content: "每次看这幅画，都能感受到向日葵的生命力，太有感染力了。",
      time: "4天前",
      likes: 16,
      replies: []
    }
  ];

  // 解析URL参数
  useEffect(() => {
    console.log("ArtworkPage: URL路径参数=" + params.id, "解析后ID=" + (params.id ? parseInt(params.id) : 1));

    // 如果URL中有ID则使用，否则默认为1
    const id = params.id ? parseInt(params.id) : 1;
    setArtworkId(id);

    // 监听全屏状态变化
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [params]);

  // 增加/减少缩放
  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  // 处理问题回答
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  return (
    <div className="pb-20">
      {/* 顶部导航栏 */}
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" className="mr-2 p-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-lg font-medium">艺术品详情</h1>
      </div>

      {/* 内容区域 - 所有区域使用8px左右边距 */}
      <div className="space-y-6 px-2">
        {/* 作品展示区 */}
        <div className="mt-4 relative">
          <div className="relative mx-auto overflow-hidden" style={{ aspectRatio: '0.75', maxWidth: '100%', border: '1px solid #eee', borderRadius: '8px' }}>
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-contain transform-gpu"
              style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-1/2 transform -translate-x-1/2"
            onClick={() => {
              const element = document.documentElement;
              if (!isFullscreen) {
                if (element.requestFullscreen) {
                  element.requestFullscreen();
                }
              } else {
                if (document.exitFullscreen) {
                  document.exitFullscreen();
                }
              }
              setIsFullscreen(!isFullscreen);
            }}
          >
            <Maximize size={24} /> {/* Use Maximize icon */}
          </Button>

          {/* 放大缩小控制条 - 位于图片底部居中 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full p-2 w-48 flex items-center gap-2">
            <span className="text-white text-xs">-</span>
            <Slider
              value={[zoom]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={handleZoomChange}
              className="flex-1"
            />
            <span className="text-white text-xs">+</span>
          </div>
        </div>

        {/* 作品信息区 - 小字号，每行两个信息 */}
        <div className="mt-2 px-2">
          <h2 className="text-xl font-bold mb-2">{artwork.title}</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">艺术家</span>
              <span>{artwork.artist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">年代</span>
              <span>{artwork.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">材质</span>
              <span>{artwork.medium}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">尺寸</span>
              <span>{artwork.dimensions}</span>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-700">{artwork.description}</p>

          <div className="flex justify-between mt-3">
            <Button
              variant="ghost"
              size="sm"
              className={cn("flex items-center gap-1", isLiked && "text-red-500")}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart size={16} className={isLiked ? "fill-red-500" : ""} />
              <span>{isLiked ? artwork.likeCount + 1 : artwork.likeCount}</span>
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <MessageSquare size={16} />
              <span>{comments.length}</span>
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Share size={16} />
              <span>{artwork.shareCount}</span>
            </Button>
          </div>
        </div>

        {/* 视频讲解区 - 印象深刻的标题 */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-bold mb-2">揭秘梵高的内心世界：向日葵背后的故事</h3>
          <div className="aspect-video bg-gray-200 flex items-center justify-center rounded">
            <p className="text-gray-500">视频讲解占位符</p>
          </div>
        </div>

        {/* 互动问答区 */}
        <div className="artwork-section-container space-y-2">
          <h3 className="text-xl font-bold">趣味问答区</h3>
          <div className="space-y-4">
            {!quizSubmitted ? (
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium mb-4">请回答以下5道关于艺术的有趣问题，选择"是"或"否"：</p>

                <div className="space-y-6">
                  {[
                    "向日葵在一天中会跟随太阳的移动而转动吗？",
                    "梵高一生中只卖出过一幅画作吗？",
                    "《蒙娜丽莎》是世界上最小的著名画作吗？",
                    "毕加索年轻时曾烧掉自己的画作来取暖吗？",
                    "《最后的晚餐》由达芬奇完成于15世纪末吗？"
                  ].map((question, index) => (
                    <div key={index} className="bg-background p-3 rounded-md">
                      <p className="font-medium mb-2">问题{index + 1}：{question}</p>
                      <div className="flex space-x-4 justify-center mt-2">
                        <Button
                          variant={quizAnswers[index] === true ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newAnswers = [...quizAnswers];
                            newAnswers[index] = true;
                            setQuizAnswers(newAnswers);
                          }}
                        >
                          是
                        </Button>
                        <Button
                          variant={quizAnswers[index] === false ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newAnswers = [...quizAnswers];
                            newAnswers[index] = false;
                            setQuizAnswers(newAnswers);
                          }}
                        >
                          否
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => {
                      // 检查是否已回答所有问题
                      if (!quizAnswers.includes(undefined)) {
                        setQuizSubmitted(true);
                        // 计算得分 - 正确答案是 [true, true, false, true, true]
                        const correctAnswers = [true, true, false, true, true];
                        let score = 0;
                        correctAnswers.forEach((answer, index) => {
                          if (answer === quizAnswers[index]) {
                            score += 10;
                          }
                        });
                        setQuizScore(score);
                      } else {
                        // 提示用户回答所有问题
                        toast({
                          title: "请回答所有问题",
                          description: "提交前请确保回答了所有5个问题",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    提交答案
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-muted p-4 rounded-lg">
                <div className="mb-4 text-center">
                  <h4 className="text-lg font-semibold">您的得分: {quizScore}/50</h4>
                  <p className="text-sm text-muted-foreground">答对一题得10分</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      question: "向日葵在一天中会跟随太阳的移动而转动吗？",
                      answer: true,
                      explanation: "是的，向日葵确实会跟随太阳移动！这种现象被称为\"向日性\"，是向日葵茎部对光的反应。"
                    },
                    {
                      question: "梵高一生中只卖出过一幅画作吗？",
                      answer: true,
                      explanation: "是的，梵高生前只卖出过一幅画《红色葡萄园》，售价400法郎，约合现在的2000美元。"
                    },
                    {
                      question: "《蒙娜丽莎》是世界上最小的著名画作吗？",
                      answer: false,
                      explanation: "否，《蒙娜丽莎》的尺寸为77×53厘米，并不是最小的著名画作。"
                    },
                    {
                      question: "毕加索年轻时曾烧掉自己的画作来取暖吗？",
                      answer: true,
                      explanation: "是的，据传毕加索在巴黎贫困的日子里，曾经烧掉自己的一些画作来取暖。"
                    },
                    {
                      question: "《最后的晚餐》由达芬奇完成于15世纪末吗？",
                      answer: true,
                      explanation: "是的，《最后的晚餐》由达芬奇于1495-1498年间创作完成，正好是15世纪末。"
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-background p-3 rounded-md">
                      <p className="font-medium">问题{index + 1}：{item.question}</p>
                      <div className="flex items-center mt-2">
                        <Badge
                          variant={quizAnswers[index] === item.answer ? "default" : "destructive"}
                          className="mr-2"
                        >
                          {quizAnswers[index] === item.answer ? "✓ 正确" : "✗ 错误"}
                        </Badge>
                        <p className="text-sm">
                          您的回答: <span className="font-medium">{quizAnswers[index] ? "是" : "否"}</span>
                        </p>
                      </div>
                      <p className="mt-2 text-sm">
                        <span className="font-medium">正确答案: {item.answer ? "是" : "否"}</span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.explanation}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers([undefined, undefined, undefined, undefined, undefined]);
                    setQuizScore(0);
                  }}>
                    重新作答
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 评论区 - 二级评论 */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-4">评论 ({comments.length})</h3>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-2">
                {/* 主评论 */}
                <div className="flex gap-3">
                  <img src={comment.avatar} alt={comment.author} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{comment.author}</h4>
                      <span className="text-xs text-gray-500">{comment.time}</span>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-xs text-gray-500 flex items-center gap-1">
                        <Heart size={12} /> {comment.likes}
                      </button>
                      <button className="text-xs text-gray-500">回复</button>
                    </div>
                  </div>
                </div>

                {/* 二级评论 */}
                {comment.replies.length > 0 && (
                  <div className="ml-12 mt-2 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3 pt-2">
                        <img src={reply.avatar} alt={reply.author} className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium">{reply.author}</h4>
                            <span className="text-xs text-gray-500">{reply.time}</span>
                          </div>
                          <p className="mt-1 text-xs">{reply.content}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <button className="text-xs text-gray-500 flex items-center gap-1">
                              <Heart size={10} /> {reply.likes}
                            </button>
                            <button className="text-xs text-gray-500">回复</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 下载原图区域 - 底部区域而非悬浮 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">下载原图</h3>
          <p className="text-sm text-gray-600 mb-4">高清无水印版本，适合学习和研究</p>
          <Button className="w-full flex items-center justify-center gap-2">
            <Download size={16} />
            下载原图 (12.5MB)
          </Button>
        </div>
      </div>
    </div>
  );
}