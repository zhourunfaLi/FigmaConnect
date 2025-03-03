import React, { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Maximize, Minimize, Download } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";

// 模拟评论数据
const commentsData = [
  {
    id: 1,
    author: "张三",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=John",
    content: "这幅作品真是太美了，特别是色彩的运用令人印象深刻。",
    timestamp: "2小时前",
    likes: 12,
    replies: [
      {
        id: 101,
        author: "李四",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Emily",
        content: "我也很喜欢这种色彩的表达方式，非常有感染力。",
        timestamp: "1小时前",
        likes: 3
      }
    ]
  },
  {
    id: 2,
    author: "王五",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Michael",
    content: "向日葵给人带来希望和温暖，这幅作品真实地捕捉到了这种精神。",
    timestamp: "昨天",
    likes: 24,
    replies: [
      {
        id: 201,
        author: "赵六",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Sophia",
        content: "同意！每次看到向日葵都会让我感到愉悦。",
        timestamp: "16小时前",
        likes: 8
      },
      {
        id: 202,
        author: "孙七",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=James",
        content: "梵高的向日葵系列真的传达了很多情感。",
        timestamp: "12小时前",
        likes: 5
      }
    ]
  },
  {
    id: 3,
    author: "钱八",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=David",
    content: "构图方面有些地方可以改进，但整体来说是一幅不错的作品。",
    timestamp: "3天前",
    likes: 7,
    replies: []
  }
];

// 模拟互动题
const quizData = {
  question: "梵高的《向日葵》系列创作于哪个年代？",
  options: [
    { id: "A", text: "1880年代" },
    { id: "B", text: "1890年代" },
    { id: "C", text: "1870年代" },
    { id: "D", text: "1860年代" }
  ],
  correctAnswer: "A",
  explanation: "梵高的《向日葵》系列主要创作于1888-1889年，属于1880年代。这一系列作品是梵高在阿尔勒期间创作的，共有多幅，展现了不同状态下的向日葵，是他最著名的作品之一。"
};

export default function ArtworkPage() {
  const [zoom, setZoom] = useState(100);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { toast } = useToast();

  // 使用 useQuery 获取作品数据
  const { data: artwork } = useQuery({
    queryKey: ['artwork', 1],
    queryFn: async () => {
      return {
        id: 1,
        title: "向日葵",
        artist: "文森特·梵高",
        year: "1888",
        medium: "油画",
        dimensions: "92.1 × 73 cm",
        location: "英国国家美术馆",
        description: "《向日葵》是荷兰后印象派画家文森特·梵高创作的一系列静物油画。这些作品因其大胆的用色、构图和情感表达而闻名。梵高创作了两组《向日葵》系列画作，第一组描绘的是躺在地上的花朵，第二组则是插在花瓶中的向日葵。",
        imageUrl: "https://placehold.co/600x800/orange/white?text=向日葵"
      };
    }
  });

  if (!artwork) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  const handleZoomChange = (newZoom: number[]) => {
    setZoom(newZoom[0]);
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowAnswer(true);
  };

  const handleDownload = () => {
    toast({
      title: "下载开始",
      description: "原图正在下载中，请稍候...",
    });
    // 实际应用中这里会触发真实的下载逻辑
  };

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      {/* 1. 作品展示区 - 设置固定宽高比的框架 */}
      <div className="relative mx-auto mb-6 w-full max-w-xl">
        <div className="overflow-hidden rounded-md shadow-md">
          <AspectRatio ratio={3/4} className="bg-slate-100">
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transition: "transform 0.3s ease"
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={artwork?.imageUrl || "https://placehold.co/600x800/orange/white?text=向日葵"}
                alt={artwork?.title || "向日葵"}
                className="object-contain w-full h-full"
              />
            </div>
          </AspectRatio>
        </div>

        {/* 缩放控制滑块 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 items-center bg-black/40 backdrop-blur-sm p-2 rounded-full w-4/5 max-w-xs">
          <Minimize className="h-4 w-4 text-white" />
          <Slider
            value={[zoom]}
            min={50}
            max={200}
            step={5}
            onValueChange={handleZoomChange}
            className="mx-2"
          />
          <Maximize className="h-4 w-4 text-white" />
          <span className="ml-2 text-xs text-white w-12 text-center">{zoom}%</span>
        </div>
      </div>

      {/* 2. 基础信息区 - 更紧凑的布局 */}
      <div className="w-full mb-4">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{artwork?.title}</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col">
              <p className="text-gray-500">艺术家</p>
              <p>{artwork?.artist}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-500">年代</p>
              <p>{artwork?.year}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-500">材质</p>
              <p>{artwork?.medium}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-500">尺寸</p>
              <p>{artwork?.dimensions}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-500">收藏地</p>
              <p>{artwork?.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 视频讲解区 */}
      <div className="w-full mb-4 p-4">
        <h3 className="text-lg font-bold mb-2">《色彩与情感的交响：梵高向日葵背后的故事》</h3>
        <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
          <p className="text-gray-500">视频讲解加载中...</p>
        </div>
      </div>

      {/* 4. 标签页内容区 */}
      <Tabs defaultValue="detail" className="w-full px-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detail">详细介绍</TabsTrigger>
          <TabsTrigger value="quiz">互动问答</TabsTrigger>
          <TabsTrigger value="comments">评论</TabsTrigger>
        </TabsList>

        {/* 详细介绍内容 */}
        <TabsContent value="detail">
          <Card>
            <CardContent className="pt-4">
              <p>{artwork?.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 互动问答内容 */}
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">互动问题</CardTitle>
              <CardDescription>{quizData.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {quizData.options.map((option) => (
                  <Button
                    key={option.id}
                    variant={selectedOption === option.id
                      ? (option.id === quizData.correctAnswer ? "default" : "destructive")
                      : "outline"
                    }
                    className="justify-start"
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={showAnswer}
                  >
                    {option.id}. {option.text}
                  </Button>
                ))}
              </div>

              {showAnswer && (
                <div className="mt-4 p-3 bg-slate-100 rounded-md">
                  <p className="font-medium">正确答案: {quizData.correctAnswer}</p>
                  <p className="mt-2 text-sm">{quizData.explanation}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              {!showAnswer ? (
                <Button onClick={() => setShowAnswer(true)}>查看答案</Button>
              ) : (
                <Button variant="outline" onClick={() => {
                  setShowAnswer(false);
                  setSelectedOption(null);
                }}>重新回答</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 评论内容 */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">用户评论</CardTitle>
              <CardDescription>共 {commentsData.length} 条评论</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commentsData.map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatarUrl} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="mt-1 text-sm">{comment.content}</p>
                        <div className="flex items-center mt-2 text-xs">
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            👍 {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            回复
                          </Button>
                        </div>

                        {/* 二级评论 */}
                        {comment.replies.length > 0 && (
                          <div className="ml-4 mt-3 space-y-3 pl-2 border-l">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={reply.avatarUrl} />
                                  <AvatarFallback>{reply.author[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-xs">{reply.author}</span>
                                    <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                  </div>
                                  <p className="mt-1 text-xs">{reply.content}</p>
                                  <div className="flex items-center mt-1 text-xs">
                                    <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">
                                      👍 {reply.likes}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">
                                      回复
                                    </Button>
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
            </CardContent>
            <CardFooter>
              <Button className="w-full">添加评论</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 5. 下载原图区域 - 底部固定区域 */}
      <div className="w-full mt-6 p-4 bg-slate-100 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">获取高清原图</h3>
            <p className="text-sm text-gray-500">分辨率: 4800 × 3600px, 24MB</p>
          </div>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            下载原图
          </Button>
        </div>
      </div>
    </div>
  );
}