
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { type Artwork } from "@shared/schema";
import VideoPlayer from "@/components/video-player";
import CommentSection from "@/components/comment-section";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Share2, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// 模拟评论数据
const MOCK_COMMENTS = [
  {
    id: 1,
    username: "张振宇房哥",
    avatar: "https://placehold.co/40x40",
    content: "巴菲特之所以在股市能赚钱是因为他有保险公司源源不断的资金流来补仓，如果他敢来大 A 我们就让他变巴韭特多少打",
    likes: 20,
    replies: [
      {
        id: 11,
        username: "张振宇房哥",
        avatar: "https://placehold.co/20x20",
        content: "你想每个人都有一台这钱你还赚得到吗?你说是不是这样。",
        likes: 20
      },
      {
        id: 12,
        username: "观山听水99",
        avatar: "https://placehold.co/20x20",
        content: "电脑只能执行人的思维，不能左右人的思维，而思维方式因人而异，，，",
        likes: 20
      }
    ]
  },
  {
    id: 2,
    username: "观山听水99",
    avatar: "https://placehold.co/40x40",
    content: "请教大神们一个实际问题，如果这台个人电脑用于炒股，且有了自己的模型，请问，怎么和交易软件对接?",
    likes: 20,
    replies: []
  },
  {
    id: 3,
    username: "武夷山施家茶业",
    avatar: "https://placehold.co/40x40",
    content: "目前我还不知道怎么用这些给我的茶叶增加销量的?有没有学习的地方",
    likes: 20,
    replies: []
  },
  {
    id: 4,
    username: "武夷山施家茶业",
    avatar: "https://placehold.co/40x40",
    content: "建一个双色球中奖大模型，问他下次买什么号码国",
    likes: 20,
    replies: []
  }
];

// 问答题目
const QUIZ_QUESTIONS = [
  {
    question: "1.《蒙娜丽莎》是达芬奇唯一一幅女性肖像画吗？",
    options: ["假", "真"],
    correctAnswer: 0
  },
  {
    question: "2.《蒙娜丽莎》的背景是真实的风景吗？",
    options: ["假", "真"],
    correctAnswer: 1
  },
  {
    question: "3.《蒙娜丽莎》的微笑是因为她牙齿不好看吗？",
    options: ["假", "真"],
    correctAnswer: 0
  },
  {
    question: "4《蒙娜丽莎》曾被偷走过吗？",
    options: ["假", "真"], 
    correctAnswer: 1
  },
  {
    question: "5.《蒙娜丽莎》现在收藏于法国卢浮宫吗？",
    options: ["假", "真"],
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
  const [expandedComments, setExpandedComments] = useState<number[]>([]);

  // 从URL路径解析作品ID
  const urlPath = window.location.pathname;
  const pathSegments = urlPath.split('/').filter(Boolean);
  const idFromPath = pathSegments.length > 1 && pathSegments[0] === 'artwork' ? pathSegments[1] : null;
  console.log(`解析URL路径: ${urlPath}, 提取ID: ${idFromPath}`);

  let artworkId: number | null = null;
  if (idFromPath && !isNaN(Number(idFromPath))) {
    artworkId = Number(idFromPath);
    console.log(`成功解析数字ID: ${artworkId}`);
  }

  console.log(`ArtworkPage: URL路径=${urlPath}, 解析后ID=${artworkId}`);

  // 获取作品数据
  const { data: artwork, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['artwork', artworkId],
    queryFn: async () => {
      console.log(`正在请求作品数据，ID=${artworkId}`);
      if (!artworkId) {
        throw new Error("无效的作品ID");
      }
      
      const apiUrl = `/api/artworks/${artworkId}`;
      console.log(`发送API请求: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      console.log(`收到响应: 状态=${response.status}`);
      
      if (!response.ok) {
        throw new Error(`找不到ID为 ${artworkId} 的作品`);
      }
      
      const data = await response.json();
      console.log(`成功获取作品数据:`, data);
      return data as Artwork;
    },
    enabled: !!artworkId,
    retry: 1
  });

  if (isError) {
    console.log(`显示错误信息: ${error instanceof Error ? error.message : '未知错误'}`);
    console.error('作品请求异常: ', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : '作品加载失败，请稍后再试'}
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <p className="text-gray-500 mb-4">
            可能是网络问题或者服务器没有响应。
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

  if (!artwork && !isLoading) {
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

  // 处理缩放级别变化
  const handleZoomChange = (newLevel: number) => {
    setZoomLevel(Math.max(50, Math.min(200, newLevel)));
  };

  // 切换评论展开状态
  const toggleCommentExpansion = (commentId: number) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter(id => id !== commentId));
    } else {
      setExpandedComments([...expandedComments, commentId]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-[#EEEAE2]">
      {/* 作品展示区域 */}
      <div className="w-full max-w-[390px] mx-auto">
        {/* 返回首页按钮 */}
        <div className="mb-4 flex items-center">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="text-black"
          >
            <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.70831 18.9946C7.70831 16.9734 7.70831 15.9628 8.13144 15.0745C8.55457 14.1861 9.34921 13.5284 10.9385 12.213L12.4802 10.937C15.3528 8.55946 16.7891 7.37067 18.5 7.37067C20.2109 7.37067 21.6472 8.55946 24.5198 10.937L26.0615 12.213C27.6507 13.5284 28.4454 14.1861 28.8685 15.0745C29.2916 15.9628 29.2916 16.9734 29.2916 18.9946V25.3071C29.2916 28.1141 29.2916 29.5177 28.3886 30.3897C27.4855 31.2617 26.032 31.2617 23.125 31.2617H13.875C10.968 31.2617 9.51449 31.2617 8.6114 30.3897C7.70831 29.5177 7.70831 28.1141 7.70831 25.3071V18.9946Z" stroke="#1C1C1C" strokeWidth="2"/>
              <path d="M22.3541 31.2617V23.3298C22.3541 22.7775 21.9064 22.3298 21.3541 22.3298H15.6458C15.0935 22.3298 14.6458 22.7775 14.6458 23.3298V31.2617" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>

        {/* 作品展示部分 */}
        <div className="rounded-lg overflow-hidden mb-4 relative">
          {isLoading ? (
            <Skeleton className="w-full aspect-[4/3]" />
          ) : (
            <div className="relative">
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-black/70 text-white">SVIP</Badge>
              </div>
              <div className="absolute top-2 right-2 z-10 flex space-x-2">
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Heart className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
              </div>
              <div 
                className="w-full overflow-hidden rounded-lg"
                style={{ 
                  height: 'auto', 
                  maxHeight: '500px',
                  transition: 'transform 0.3s ease-in-out',
                }}
              >
                <img
                  src={artwork?.imageUrl || 'https://placehold.co/374x477'}
                  alt={artwork?.title || "作品图片"}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                />
              </div>
              
              {/* 全屏按钮 */}
              <button className="absolute bottom-16 right-4 p-2 bg-black/30 rounded-full">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.17114 3.12305H6.06419C4.64998 3.12305 3.94287 3.12305 3.50353 3.56239C3.06419 4.00173 3.06419 4.70883 3.06419 6.12305V8.32812" stroke="#F8F8FA" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8.17114 21.8613H6.06419C4.64998 21.8613 3.94287 21.8613 3.50353 21.422C3.06419 20.9826 3.06419 20.2755 3.06419 18.8613V16.6562" stroke="#F8F8FA" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16.3423 3.12305H18.4492C19.8635 3.12305 20.5706 3.12305 21.0099 3.56239C21.4492 4.00173 21.4492 4.70883 21.4492 6.12305V8.32812" stroke="#F8F8FA" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16.3423 21.8613H18.4492C19.8635 21.8613 20.5706 21.8613 21.0099 21.422C21.4492 20.9826 21.4492 20.2755 21.4492 18.8613V16.6562" stroke="#F8F8FA" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              {/* 缩放控制器 */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[324px] flex flex-col items-center">
                <div className="bg-[#C1AB09] text-white px-4 py-1 rounded-full mb-1 text-sm">
                  {(zoomLevel / 100).toFixed(1)} X
                </div>
                <div className="w-full flex items-center">
                  <button 
                    className="w-6 h-6 bg-[#C1AB09] rounded-full border-4 border-[#E2EDF8] flex items-center justify-center"
                    onClick={() => handleZoomChange(zoomLevel - 10)}
                  >
                    <div className="w-2 h-0.5 bg-white"></div>
                  </button>
                  
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={zoomLevel}
                    onChange={(e) => handleZoomChange(Number(e.target.value))}
                    className="flex-grow mx-2 h-2 rounded appearance-none bg-[#D5D1AE]"
                    style={{
                      background: `linear-gradient(to right, #C1AB09 0%, #C1AB09 ${(zoomLevel - 50) / 150 * 100}%, #D5D1AE ${(zoomLevel - 50) / 150 * 100}%, #D5D1AE 100%)`,
                    }}
                  />
                  
                  <button 
                    className="w-6 h-6 bg-[#C1AB09] rounded-full border-4 border-[#E2EDF8] flex items-center justify-center"
                    onClick={() => handleZoomChange(zoomLevel + 10)}
                  >
                    <div className="relative">
                      <div className="w-2 h-0.5 bg-white"></div>
                      <div className="w-2 h-0.5 bg-white absolute top-0 left-0 transform rotate-90"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 作品标题 */}
        <h1 className="text-[15px] mb-4 text-[#090909] leading-6">
          {isLoading ? <Skeleton className="h-6 w-full" /> : artwork?.title || "达芬奇密码在线破解！高清《蒙娜丽莎》带你揭开艺术史上的最大谜团"}
        </h1>

        {/* 视频播放器部分 */}
        {artwork?.videoUrl && (
          <div className="mb-6">
            <div className="relative w-full bg-[#171A1F] rounded-lg overflow-hidden mb-2">
              <VideoPlayer 
                videoUrl={artwork.videoUrl} 
                thumbnailUrl="https://placehold.co/374x211"
              />
            </div>
            <h2 className="text-[15px] text-[#090909] leading-6">《蒙娜丽莎的20个秘密》</h2>
          </div>
        )}

        {/* 作品信息部分 */}
        <div className="mb-6">
          <div className="border-t border-[#B0B0B0] pt-6 pb-2">
            <h2 className="text-[16px] text-[#747472] mb-4">《蒙娜丽莎》</h2>
            <p className="text-[15px] text-[#090909] leading-6 whitespace-pre-line">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </>
              ) : (
                artwork?.description || 
                `《蒙娜丽莎》（Mona Lisa）是意大利文艺复兴时期画家列奥纳多·达·芬奇创作的油画，现收藏于法国卢浮宫博物馆。该画作主要表现了女性的典雅和恬静的典型形象，塑造了资本主义上升时期一位城市有产阶级的妇女形象。《蒙娜丽莎》代表了文艺复兴时期的美学方向；该作品折射出来的女性的深邃与高尚的思想品质，反映了文艺复兴时期人们对于女性美的审美理念和审美追求。
\n每年到卢浮宫鉴赏《蒙娜丽莎》作品的人数，大约有600万左右。 [2]1952年，德国发行首枚《蒙娜丽莎》邮票。 [3]
\n当地时间2024年1月28日，两名女性在法国巴黎卢浮宫博物馆向《蒙娜丽莎》泼洒灌装汤料，以表达对法国农业政策的不满，画作因在钢化玻璃罩内展出而未受损坏。`
              )}
            </p>
          </div>
        </div>

        {/* 问答部分 */}
        <div className="mb-6 border-t border-b border-[#D9D9D9] py-4">
          <h2 className="text-[15px] text-[#747472] mb-4">趣闻问答</h2>
          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((question, index) => (
              <div key={index} className="py-2 border-b border-[#D9D9D9] last:border-b-0">
                <div className="flex justify-between items-center">
                  <p className="text-[15px] text-black">{question.question}</p>
                  <div className="flex items-center space-x-3">
                    <span className="text-[#B0B0B0]">{question.options[0]}</span>
                    <div className="relative w-[42px] h-[18px]">
                      <div className="absolute w-full h-full bg-[#FF9500] rounded-full"></div>
                      <div className={`absolute right-0 w-[19px] h-[18px] bg-[#4D9FFF] rounded-full border-2 border-[#F9F9F9] shadow-md`}></div>
                    </div>
                    <span className="text-[#B0B0B0]">{question.options[1]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <button className="flex items-center space-x-2 bg-[#2280EF] text-white px-6 py-2 rounded-full">
              <div className="w-6 h-6 bg-[#EEEAE2] border-2 border-[#161616] rounded flex items-center justify-center">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.25 7.29904C9.25 6.72169 9.25 5.27831 8.25 4.70096L3.75 2.10289C2.75 1.52554 1.5 2.24722 1.5 3.40192V8.59808C1.5 9.75277 2.75 10.4745 3.75 9.89711L8.25 7.29904Z" fill="white" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
              <span>提交</span>
            </button>
          </div>
        </div>

        {/* 评论部分 */}
        <div className="mb-6">
          <div className="flex flex-col items-center border-t border-[#B0B0B0] pt-4 mb-4">
            <span className="text-[15px]">516条评论</span>
          </div>

          <div className="space-y-4">
            {MOCK_COMMENTS.map((comment) => (
              <div key={comment.id} className="mb-4">
                <div className="flex gap-2">
                  <img src={comment.avatar} alt={comment.username} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="text-[14px] text-[#B0B0B0]">{comment.username}</p>
                    <div className="mt-2">
                      <p className="text-[15px] text-black mb-1">{comment.content}</p>
                      <div className="flex justify-end items-center gap-4 text-[13px] text-[#747472]">
                        <span>回复</span>
                        <div className="flex items-center gap-1">
                          <Heart size={16} />
                          <span>{comment.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M7.99107 5.01388C6.71343 4.22054 4.93104 4.42294 3.90469 5.7458L3.64689 6.07807C2.43395 7.64141 2.60908 9.87082 4.05126 11.2256L9.8451 16.6683C9.896 16.7161 9.93594 16.7536 9.971 16.7853C9.98168 16.795 9.99131 16.8036 10 16.8112C10.0087 16.8036 10.0184 16.795 10.0291 16.7853C10.0641 16.7536 10.1041 16.7161 10.1549 16.6683L15.9488 11.2256C17.391 9.87083 17.5661 7.64141 16.3532 6.07806L16.0954 5.74579C14.9925 4.32433 13.0167 4.19617 11.7313 5.20853L11.1126 4.42293C12.8068 3.08863 15.4213 3.24572 16.8854 5.1328L17.1432 5.46507C18.6724 7.43594 18.4516 10.2465 16.6335 11.9544L10.8396 17.3971L10.8267 17.4093C10.7382 17.4924 10.6476 17.5776 10.5632 17.6426C10.4679 17.716 10.3419 17.7952 10.1766 17.8277L10.0872 17.3726L10.1765 17.8277C10.06 17.8506 9.94007 17.8506 9.8235 17.8277L9.91979 17.337L9.8235 17.8277C9.6581 17.7952 9.53214 17.716 9.4369 17.6426C9.35248 17.5776 9.26183 17.4924 9.17339 17.4093L9.16043 17.3971L3.36658 11.9544C1.54846 10.2465 1.32768 7.43594 2.85681 5.46507L3.1146 5.1328C4.62018 3.19228 7.34225 3.08067 9.03005 4.54067L9.39149 4.85332L9.09548 5.22852L8.46703 6.02509C8.12975 6.4526 7.9105 6.73239 7.77855 6.95841C7.65376 7.17215 7.6537 7.26155 7.66388 7.31709C7.67405 7.37263 7.70581 7.4562 7.89826 7.61181C8.10178 7.77637 8.40598 7.96025 8.87292 8.24041L9.29203 8.49188L9.32109 8.50931C9.71842 8.74768 10.0597 8.95245 10.3094 9.15286C10.5764 9.36722 10.8011 9.62439 10.883 9.98862C10.9649 10.3528 10.872 10.6815 10.7224 10.9895C10.5826 11.2775 10.3618 11.6087 10.1047 11.9942L10.0859 12.0224L9.58274 12.7771L8.75069 12.2224L9.25387 11.4677C9.535 11.046 9.71645 10.7718 9.82282 10.5527C9.92287 10.3467 9.91945 10.2616 9.90741 10.208C9.89536 10.1544 9.86202 10.0761 9.6834 9.93268C9.49347 9.78022 9.21212 9.61012 8.77754 9.34937L8.35842 9.09791L8.32803 9.07967C7.89996 8.82286 7.53416 8.60341 7.26951 8.38942C6.98755 8.16143 6.75155 7.88645 6.68025 7.49731C6.60895 7.10816 6.73213 6.76737 6.91495 6.45423C7.08654 6.16031 7.35078 5.82543 7.65999 5.43353L7.68195 5.40571L7.99107 5.01388Z" fill="#747472"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 展开按钮或评论内容 */}
                {comment.replies.length > 0 && (
                  <>
                    {expandedComments.includes(comment.id) ? (
                      <>
                        <div className="ml-12 mt-4 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-2">
                              <img src={reply.avatar} alt={reply.username} className="w-5 h-5 rounded-full" />
                              <div className="flex-1">
                                <p className="text-[14px] text-[#B0B0B0]">{reply.username}</p>
                                <p className="text-[15px] text-black mb-1">{reply.content}</p>
                                <div className="flex justify-end items-center gap-4 text-[13px] text-[#747472]">
                                  <span>回复</span>
                                  <div className="flex items-center gap-1">
                                    <Heart size={16} />
                                    <span>{reply.likes}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M7.26439 4.35248C6.193 3.73018 4.73373 3.91636 3.88656 5.00827L3.66372 5.29549C2.63668 6.61922 2.78497 8.50694 4.00611 9.65407L9.01435 14.3588C9.04873 14.3911 9.07698 14.4176 9.10185 14.4405C9.12671 14.4176 9.15496 14.3911 9.18934 14.3588L14.1976 9.65407C15.4187 8.50694 15.567 6.61922 14.54 5.29548L14.3171 5.00827C13.3883 3.81111 11.7238 3.70229 10.6404 4.55556L10.0216 3.76996C11.5138 2.59475 13.8171 2.7325 15.1072 4.39527L15.3301 4.68249C16.6733 6.41375 16.4793 8.88263 14.8823 10.3829L9.87402 15.0876L9.86188 15.099C9.78634 15.17 9.7057 15.2458 9.62999 15.3041C9.5435 15.3708 9.42491 15.446 9.26749 15.4769C9.1581 15.4984 9.04559 15.4984 8.9362 15.4769C8.77878 15.446 8.66019 15.3708 8.57371 15.3041C8.49799 15.2458 8.41735 15.17 8.34181 15.099L8.32967 15.0876L3.32144 10.3829C1.72435 8.88263 1.53041 6.41376 2.87364 4.68249L3.26868 4.98899L2.87364 4.68249L3.09648 4.39527C4.42308 2.68543 6.8211 2.58773 8.30775 3.87372L8.66919 4.18637L8.37318 4.56156L7.96604 5.07763C7.6559 5.47073 7.45431 5.72786 7.33001 5.93585C7.21175 6.13373 7.20706 6.21792 7.21279 6.26749C7.21533 6.28939 7.2193 6.31109 7.2247 6.33246C7.23691 6.38084 7.27114 6.45791 7.45187 6.601C7.64184 6.75141 7.9215 6.92037 8.35086 7.17798L8.37749 7.19396C8.74305 7.41327 9.05719 7.60173 9.29011 7.78489C9.53825 7.98001 9.75217 8.2123 9.84825 8.54125C9.86592 8.60173 9.87976 8.66327 9.88968 8.72549C9.94367 9.0639 9.84978 9.36542 9.70905 9.64798C9.57696 9.91322 9.37374 10.218 9.13725 10.5727L9.12003 10.5985L8.79755 11.0823L7.9655 10.5276L8.28798 10.0438C8.54654 9.65601 8.71343 9.40397 8.81392 9.20219C8.90897 9.01132 8.90985 8.93116 8.90217 8.88303C8.89886 8.86229 8.89425 8.84178 8.88836 8.82162C8.87469 8.77483 8.83959 8.70276 8.67198 8.57096C8.49478 8.43162 8.23606 8.27529 7.83637 8.03548L7.80852 8.01877C7.41476 7.78254 7.07817 7.58061 6.83113 7.38501C6.56904 7.17751 6.34397 6.92916 6.25512 6.57725C6.23894 6.51314 6.22701 6.44803 6.21941 6.38235C6.17773 6.0218 6.30013 5.70979 6.47162 5.42284C6.63327 5.15237 6.87641 4.84422 7.16084 4.48373L7.18095 4.45824L7.26439 4.35248Z" fill="#747472"/>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center mt-2 ml-12">
                          <div className="h-px w-6 bg-black"></div>
                          <button 
                            className="flex items-center gap-2 text-[#747472] ml-4"
                            onClick={() => toggleCommentExpansion(comment.id)}
                          >
                            <span>收起</span>
                            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.9707 5.98535L5.98541 1.00006L1.00012 5.98535" stroke="black"/>
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center mt-2 ml-12">
                        <div className="h-px w-6 bg-black"></div>
                        <button 
                          className="flex items-center gap-2 text-[#747472] ml-4"
                          onClick={() => toggleCommentExpansion(comment.id)}
                        >
                          <span>展开更多</span>
                          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5.98529 5.98529L10.9706 1" stroke="black"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* 查看更多按钮 */}
          <div className="flex justify-center mt-4">
            <button className="flex items-center space-x-2 bg-[#2280EF] text-white px-6 py-2 rounded-full">
              <div className="w-6 h-6 bg-[#EEEAE2] border-2 border-[#161616] rounded flex items-center justify-center">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.25 7.29904C9.25 6.72169 9.25 5.27831 8.25 4.70096L3.75 2.10289C2.75 1.52554 1.5 2.24722 1.5 3.40192V8.59808C1.5 9.75277 2.75 10.4745 3.75 9.89711L8.25 7.29904Z" fill="white" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
              <span>看更多评论</span>
            </button>
          </div>

          {/* 评论输入框 */}
          <div className="mt-4">
            <div className="w-full bg-[#D9D9D9] rounded-full flex items-center px-4 py-2">
              <input 
                type="text" 
                placeholder="写评论..." 
                className="flex-grow bg-transparent focus:outline-none"
              />
              <div className="flex space-x-3">
                <button>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#222222" strokeWidth="2"/>
                    <path d="M3 10.5L5.8055 7.6945C6.68783 6.81217 8.1538 6.94435 8.86408 7.97026L10.7664 10.718C11.4311 11.6781 12.7735 11.8669 13.6773 11.1275L16.0991 9.14601C16.8944 8.49536 18.0533 8.55318 18.7798 9.27975L21 11.5" stroke="#222222" strokeWidth="2"/>
                    <circle cx="16" cy="6" r="2" fill="#222222"/>
                  </svg>
                </button>
                <button>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="#33363F" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4" stroke="#33363F" strokeWidth="2"/>
                    <path d="M17 9V13.5C17 14.8807 18.1193 16 19.5 16V16C20.8807 16 22 14.8807 22 13.5V12" stroke="#33363F" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="#33363F" strokeWidth="2"/>
                    <circle cx="8" cy="9" r="1" fill="#33363F" stroke="#33363F" strokeWidth="0.5"/>
                    <circle cx="14" cy="9" r="1" fill="#33363F" stroke="#33363F" strokeWidth="0.5"/>
                    <path d="M8 12H12C13.1046 12 14 12.8954 14 14V14" stroke="#33363F" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 下载按钮 */}
        <div className="border-t border-[#B0B0B0] pt-4 pb-8 flex justify-center">
          <button className="flex items-center space-x-2 bg-[#EB9800] text-white px-6 py-2 rounded-full">
            <div className="w-6 h-6 bg-[#EEEAE2] border-2 border-[#161616] rounded flex items-center justify-center">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.25 7.29904C9.25 6.72169 9.25 5.27831 8.25 4.70096L3.75 2.10289C2.75 1.52554 1.5 2.24722 1.5 3.40192V8.59808C1.5 9.75277 2.75 10.4745 3.75 9.89711L8.25 7.29904Z" fill="white" stroke="black" strokeWidth="2"/>
              </svg>
            </div>
            <span>下载原图</span>
          </button>
        </div>

        {/* 分享栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 z-50">
          <div className="flex justify-between items-center max-w-[390px] mx-auto">
            <button className="bg-[#109F1C] text-white px-4 py-1 rounded-full flex items-center">
              <div className="mr-2">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="8" cy="6.5" rx="8" ry="6.5" fill="#D9D9D9"/>
                  <circle cx="5" cy="5" r="1" fill="#109F1C"/>
                  <circle cx="9" cy="5" r="1" fill="#109F1C"/>
                  <path d="M0.0741 5.05951L2.80859 0.39341L4.66898 2.20696L0.0741 5.05951Z" fill="#D9D9D9"/>
                  <ellipse cx="17" cy="8" rx="7" ry="6" fill="#D9D9D9" stroke="#109F1C"/>
                  <circle cx="15" cy="6" r="1" fill="#109F1C"/>
                  <circle cx="19" cy="6" r="1" fill="#109F1C"/>
                  <path d="M4.85727 5.15602L0.381179 2.12045L2.3132 0.383415L4.85727 5.15602Z" fill="#D9D9D9"/>
                </svg>
              </div>
              分享
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.8343 7.73216C12.752 5.44433 13.2109 4.30042 13.9999 4.30042C14.789 4.30042 15.2478 5.44433 16.1656 7.73216L16.2083 7.8387C16.7267 9.13121 16.986 9.77747 17.5143 10.1703C18.0426 10.5631 18.7362 10.6252 20.1232 10.7494L20.374 10.7719C22.6441 10.9752 23.7792 11.0768 24.022 11.799C24.2649 12.5211 23.422 13.288 21.7361 14.8218L21.1734 15.3337C20.32 16.1102 19.8933 16.4984 19.6944 17.0072C19.6573 17.1021 19.6265 17.1994 19.6021 17.2983C19.4713 17.8287 19.5963 18.3919 19.8462 19.5183L19.924 19.8689C20.3833 21.939 20.6129 22.974 20.212 23.4204C20.0621 23.5873 19.8674 23.7074 19.6511 23.7664C19.0722 23.9244 18.2503 23.2546 16.6065 21.9152C15.5272 21.0357 14.9875 20.5959 14.3678 20.497C14.1241 20.4581 13.8758 20.4581 13.632 20.497C13.0124 20.5959 12.4727 21.0357 11.3934 21.9152C9.7496 23.2546 8.92771 23.9244 8.34881 23.7664C8.13249 23.7074 7.93776 23.5873 7.78793 23.4204C7.38697 22.974 7.61661 21.939 8.0759 19.8689L8.15369 19.5183C8.4036 18.3919 8.52855 17.8287 8.39782 17.2983C8.37344 17.1994 8.34259 17.1021 8.30549 17.0072C8.10661 16.4984 7.6799 16.1102 6.82647 15.3337L6.26381 14.8218C4.57793 13.288 3.73498 12.5211 3.97786 11.799C4.22073 11.0768 5.35579 10.9752 7.62591 10.7719L7.87667 10.7494C9.26374 10.6252 9.95727 10.5631 10.4856 10.1703C11.0139 9.77747 11.2732 9.13121 11.7916 7.8387L11.8343 7.73216Z" stroke="#33363F" strokeWidth="2"/>
                </svg>
                <span className="ml-2 text-sm">655</span>
              </div>
              
              <div className="flex items-center">
                <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.69811 12.2685L11.7957 20.3014C12.128 20.6309 12.2941 20.7957 12.5 20.7957C12.7059 20.7957 12.872 20.6309 13.2043 20.3014L21.3019 12.2685C23.4269 10.1605 23.688 6.81434 21.9158 4.40218L21.3992 3.6991C19.1979 0.703013 14.5848 1.18723 13.0536 4.5751C12.8383 5.05152 12.1617 5.05152 11.9464 4.5751C10.4152 1.18723 5.80206 0.703009 3.60078 3.6991L3.08422 4.40218C1.31196 6.81433 1.5731 10.1605 3.69811 12.2685Z" stroke="#33363F" strokeWidth="2"/>
                </svg>
                <span className="ml-2 text-sm">6587</span>
              </div>
              
              <div className="flex items-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="18.6667" height="18.6667" x="1.66669" y="1.66669" rx="9" stroke="#33363F" strokeWidth="2"/>
                  <path d="M11.5 12.8333L16.5 12.8333" stroke="#33363F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 9.5H10.5" stroke="#33363F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="ml-2 text-sm">988</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
