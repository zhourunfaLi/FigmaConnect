import React, { useState, useEffect } from "react";
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

// 问答题目
const mockQuizQuestions = [
  {
    id: 1,
    question: "这幅画是梵高在精神病院时期创作的吗？",
    correctAnswer: true,
    answerText: "是的，梵高确实在圣雷米精神病院时期创作了部分向日葵作品。"
  },
  {
    id: 2,
    question: "《向日葵》系列共有12幅作品？",
    correctAnswer: false,
    answerText: "不是，梵高的《向日葵》系列大约有7幅完整保存下来的作品，而非12幅。"
  },
  {
    id: 3,
    question: "梵高的《向日葵》曾被纳粹德国列为\"堕落艺术\"？",
    correctAnswer: true,
    answerText: "是的，在纳粹统治时期，梵高的作品包括《向日葵》确实被列为\"堕落艺术\"。"
  },
  {
    id: 4,
    question: "梵高在生前卖出了大部分《向日葵》系列作品？",
    correctAnswer: false,
    answerText: "不是，梵高生前只卖出了一幅画作，《向日葵》系列在他生前几乎没有售出。"
  },
  {
    id: 5,
    question: "《向日葵》的原作现存于伦敦国家美术馆？",
    correctAnswer: true,
    answerText: "是的，《向日葵》的一幅原作确实收藏于伦敦国家美术馆。"
  }
];

// 模拟作品基本信息
const mockArtworkInfo = {
  artist: "文森特·梵高",
  year: "1888年",
  size: "92.1厘米 × 73厘米",
  museum: "伦敦国家美术馆"
};

// 模拟评论数据
const mockComments = [
  {
    id: 1,
    username: "艺术爱好者",
    avatar: "https://i.pravatar.cc/100?img=1",
    content: "这是梵高最具标志性的作品之一，色彩非常震撼。",
    date: "2023-06-15",
    likes: 24
  },
  {
    id: 2,
    username: "美术学生",
    avatar: "https://i.pravatar.cc/100?img=2",
    content: "向日葵系列展现了梵高对黄色的痴迷，每一笔都充满活力。",
    date: "2023-06-12",
    likes: 15
  },
  {
    id: 3,
    username: "历史研究者",
    avatar: "https://i.pravatar.cc/100?img=3",
    content: "这幅画创作于1888年，是梵高在法国阿尔勒时期的作品。当时梵高希望用这些向日葵装饰他的黄房子，为高更的到来做准备。",
    date: "2023-06-10",
    likes: 32
  }
];

export default function ArtworkPage() {
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const [artworkId, setArtworkId] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: boolean }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});

  // 设置作品ID
  useEffect(() => {
    console.log("ArtworkPage: URL路径参数=" + id, "解析后ID=" + artworkId);
    if (id) {
      setArtworkId(parseInt(id));
    }
  }, [id]);

  // 获取作品数据
  const { data: artwork, isLoading } = useQuery({
    queryKey: [`/api/artworks/${artworkId}`],
    enabled: !!artworkId,
    onSuccess: (data) => {
      console.log("成功获取作品数据:", data);
    }
  });

  // 增加/减少缩放
  const handleZoomChange = (amount: number) => {
    setZoom((prev) => {
      const newZoom = prev + amount;
      return Math.max(50, Math.min(200, newZoom));
    });
  };

  // 切换评论展开/折叠
  const toggleCommentExpand = (commentId: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // 回答问题
  const handleAnswer = (questionId: number, answer: boolean) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // 提交问答
  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);

    // 计算正确答案数量
    const correctAnswers = mockQuizQuestions.filter(
      (q) => userAnswers[q.id] === q.correctAnswer
    ).length;

    toast({
      title: "问答结果",
      description: `你答对了 ${correctAnswers}/${mockQuizQuestions.length} 个问题！`,
    });
  };

  // 下载图片
  const handleDownloadImage = () => {
    const downloadUrl = artwork?.imageUrl || "https://placehold.co/600x800";

    if (downloadUrl) {
      const a = document.createElement("a");
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
      <div className="min-h-screen px-2 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="w-full h-64 bg-gray-300 rounded-md"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 作品详情界面
  return (
    <div className="min-h-screen px-2">
      {/* 1. 作品展示互动区 */}
      <div className="w-full mb-4 relative">
        <div 
          style={{ transform: `scale(${zoom / 100})`, transition: "transform 0.3s ease" }}
          className="flex justify-center"
        >
          <AspectRatio 
            ratio={16/9} 
            className="bg-muted overflow-hidden rounded-md max-w-3xl"
          >
            <img
              src={artwork?.imageUrl || "https://placehold.co/600x400/orange/white?text=向日葵"}
              alt={artwork?.title || "向日葵"}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>

        {/* 缩放控制组放置在底部居中 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-sm p-2 rounded-full">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleZoomChange(-10)}
            className="text-white hover:bg-white/20"
          >
            <Minimize className="h-4 w-4 mr-1" /> 缩小
          </Button>
          <span className="flex items-center px-2 text-sm text-white">{zoom}%</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleZoomChange(10)}
            className="text-white hover:bg-white/20"
          >
            <Maximize className="h-4 w-4 mr-1" /> 放大
          </Button>
        </div>
      </div>

      {/* 2. 基础信息区 */}
      <div className="w-full mb-4">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{artwork?.title || "向日葵"}</h2>
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
        </div>
      </div>

      {/* 3. 视频讲解区占位符 */}
      <div className="w-full mb-4 bg-gray-200 rounded-md">
        <div className="p-4 text-center h-40 flex items-center justify-center">
          <p className="text-gray-500">视频讲解区（占位符）</p>
        </div>
      </div>

      {/* 4. 作品介绍区 */}
      <div className="w-full mb-4">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">作品简介</h3>
          <div className="text-gray-700">
            <p className="mb-3">
              {artwork?.description || "这是梵高最著名的作品之一，创作于1888年8月。梵高用厚重的颜料和大胆的笔触描绘了盛开的向日葵，象征着生命力和热情。"}
            </p>
            <p className="mb-3">
              梵高总共创作了几个向日葵系列，其中最著名的是在阿尔勒期间创作的七幅作品。这些画作最初是用来装饰他的黄房子的，为他的朋友高更的到来做准备。梵高对黄色的运用达到了前所未有的程度，他用不同色调的黄色创造出充满活力的构图。
            </p>
            <p>
              这幅作品体现了梵高对日本浮世绘的热爱，以及他独特的表现主义风格。向日葵后来成为梵高的标志性象征，代表了他短暂而辉煌的艺术生涯。
            </p>
          </div>
        </div>
      </div>

      {/* 5. 互动问答区 */}
      <div className="w-full mb-4">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">艺术知识问答</h3>
          <div className="space-y-4">
            {mockQuizQuestions.map((question) => (
              <div key={question.id} className="space-y-2">
                <p className="font-medium">{question.question}</p>
                <div className="flex gap-2">
                  <Button 
                    variant={userAnswers[question.id] === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAnswer(question.id, true)}
                    disabled={quizSubmitted}
                    className={
                      quizSubmitted && question.correctAnswer === true
                        ? "bg-green-500 hover:bg-green-600"
                        : quizSubmitted && userAnswers[question.id] === true && question.correctAnswer === false
                        ? "bg-red-500 hover:bg-red-600"
                        : ""
                    }
                  >
                    是
                  </Button>
                  <Button
                    variant={userAnswers[question.id] === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAnswer(question.id, false)}
                    disabled={quizSubmitted}
                    className={
                      quizSubmitted && question.correctAnswer === false
                        ? "bg-green-500 hover:bg-green-600"
                        : quizSubmitted && userAnswers[question.id] === false && question.correctAnswer === true
                        ? "bg-red-500 hover:bg-red-600"
                        : ""
                    }
                  >
                    否
                  </Button>
                </div>

                {/* 显示正确答案文字 */}
                {quizSubmitted && (
                  <div className="text-sm mt-1 text-gray-700 bg-gray-100 p-2 rounded">
                    <p><strong>答案:</strong> {question.answerText}</p>
                  </div>
                )}
              </div>
            ))}

            <Button 
              onClick={handleSubmitQuiz} 
              disabled={Object.keys(userAnswers).length !== mockQuizQuestions.length || quizSubmitted}
              className="mt-4"
            >
              提交答案
            </Button>
          </div>
        </div>
      </div>

      {/* 6. 用户评论区 */}
      <div className="w-full mb-4">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">用户评论</h3>
          <div className="space-y-4">
            {mockComments.map((comment) => (
              <div key={comment.id} className="border-b pb-3">
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
                    <div className="mt-1">
                      {comment.content.length > 100 && !expandedComments[comment.id] ? (
                        <>
                          <span>{comment.content.slice(0, 100)}...</span>
                          <button
                            onClick={() => toggleCommentExpand(comment.id)}
                            className="text-blue-500 text-sm ml-1"
                          >
                            展开
                          </button>
                        </>
                      ) : comment.content.length > 100 ? (
                        <>
                          <span>{comment.content}</span>
                          <button
                            onClick={() => toggleCommentExpand(comment.id)}
                            className="text-blue-500 text-sm ml-1"
                          >
                            收起
                          </button>
                        </>
                      ) : (
                        <span>{comment.content}</span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      👍 {comment.likes}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. 相关推荐区 */}
      <div className="w-full mb-4">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">相关作品</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="cursor-pointer">
                <div className="aspect-[3/4] bg-gray-200 rounded-md overflow-hidden">
                  <img 
                    src={`https://placehold.co/300x400?text=相关作品${item}`}
                    alt={`相关作品${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="mt-2 text-sm font-medium">相关艺术作品 {item}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-3 flex justify-center space-x-4">
        <Button onClick={handleDownloadImage} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" /> 下载图片
        </Button>
      </div>
    </div>
  );
}