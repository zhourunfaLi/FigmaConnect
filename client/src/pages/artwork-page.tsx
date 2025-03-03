import React, { useState } from "react";
import { ArrowLeft, Heart, Share2, MessageSquare, Download, Maximize } from "lucide-react";
import { useParams, useLocation } from "wouter";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function ArtworkPage() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const id = params?.id || "1";
  const [scale, setScale] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  console.log("ArtworkPage: URL路径参数=" + params?.id, "解析后ID=" + id);

  // 模拟的艺术品数据
  const artwork = {
    id: id,
    title: "向日葵",
    artist: "文森特·梵高",
    year: "1889",
    medium: "油画",
    dimensions: "95 × 73 cm",
    location: "伦敦国家美术馆",
    description:
      "《向日葵》是荷兰后印象派画家文森特·梵高创作的一系列静物油画作品。这些作品以向日葵为主题，色彩鲜艳，充满活力，是梵高艺术生涯中最具代表性的作品之一。",
    imageUrl: "/src/assets/design/img/artwork-detail.jpg",
    likes: 4287,
    comments: 362,
  };

  // 模拟问答题数据
  const quizzes = [
    {
      id: 1,
      question: "梵高一生中卖出了超过100幅画作？",
      answer: false,
      explanation: "梵高生前只卖出过一幅画作《红色葡萄园》。"
    },
    {
      id: 2,
      question: "梵高曾赠送自己的耳朵给一位女性作为礼物？",
      answer: false,
      explanation: "梵高确实割下了自己的耳朵，但并非作为礼物赠送，而是在精神崩溃期间自残行为。"
    },
    {
      id: 3,
      question: "《向日葵》系列作品中最著名的版本保存在英国？",
      answer: true,
      explanation: "最著名的《向日葵》版本现存于伦敦国家美术馆。"
    },
    {
      id: 4,
      question: "梵高是在37岁时自杀身亡的？",
      answer: true,
      explanation: "梵高于1890年7月，37岁时开枪自杀，两天后因伤势过重去世。"
    },
    {
      id: 5,
      question: "梵高创作了超过2000幅艺术作品？",
      answer: true,
      explanation: "梵高在短短10年的艺术生涯中创作了约2100幅作品，包括900多幅画作和1100多幅素描。"
    }
  ];

  // 模拟评论数据
  const comments = [
    {
      id: 1,
      user: "艺术爱好者",
      avatar: "/src/assets/design/img/avatar-1.jpg",
      content: "这幅画的色彩运用真是让人震撼，梵高的黄色系总是能带给人强烈的情感冲击。",
      time: "2天前",
      likes: 24,
      replies: [
        {
          id: 101,
          user: "色彩研究者",
          avatar: "/src/assets/design/img/avatar-3.jpg",
          content: "完全同意！梵高的黄色不仅仅是色彩，更是一种情感的表达。他使用的铬黄在当时是一种新颜料。",
          time: "1天前",
          likes: 12
        }
      ]
    },
    {
      id: 2,
      user: "历史学家",
      avatar: "/src/assets/design/img/avatar-2.jpg",
      content: "这幅画创作于梵高在阿尔勒的时期，当时他的精神状态相对稳定，创作力极为旺盛。",
      time: "3天前",
      likes: 18,
      replies: [
        {
          id: 102,
          user: "梵高传记作者",
          avatar: "/src/assets/design/img/avatar-4.jpg",
          content: "有趣的观点！事实上，向日葵系列是梵高为迎接高更到访而创作的，他希望用这些充满阳光的画作装饰他们共同的工作室。",
          time: "2天前",
          likes: 15
        }
      ]
    },
    {
      id: 3,
      user: "现代艺术家",
      avatar: "/src/assets/design/img/avatar-5.jpg",
      content: "每次看到这幅作品，都能感受到新的启发。梵高的笔触技法至今仍影响着无数艺术家，包括我自己。",
      time: "5天前",
      likes: 31,
      replies: []
    }
  ];

  // 处理答案选择
  const handleAnswerSelect = (questionId: number, answer: boolean) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

  // 提交答案
  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < quizzes.length) {
      alert("请回答所有问题后再提交！");
      return;
    }

    let newScore = 0;
    quizzes.forEach(quiz => {
      if (selectedAnswers[quiz.id] === quiz.answer) {
        newScore += 10;
      }
    });

    setScore(newScore);
    setSubmitted(true);
  };

  // 放大缩小控制
  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  // 全屏显示图片
  const handleFullScreen = () => {
    const img = document.querySelector(".artwork-image") as HTMLImageElement;
    if (img) {
      const fullscreenImg = document.createElement("div");
      fullscreenImg.style.position = "fixed";
      fullscreenImg.style.top = "0";
      fullscreenImg.style.left = "0";
      fullscreenImg.style.width = "100vw";
      fullscreenImg.style.height = "100vh";
      fullscreenImg.style.backgroundColor = "rgba(0,0,0,0.9)";
      fullscreenImg.style.display = "flex";
      fullscreenImg.style.justifyContent = "center";
      fullscreenImg.style.alignItems = "center";
      fullscreenImg.style.zIndex = "9999";

      const imgElement = document.createElement("img");
      imgElement.src = artwork.imageUrl;
      imgElement.style.maxHeight = "90vh";
      imgElement.style.maxWidth = "90vw";
      imgElement.style.objectFit = "contain";

      const closeBtn = document.createElement("button");
      closeBtn.innerText = "×";
      closeBtn.style.position = "absolute";
      closeBtn.style.top = "20px";
      closeBtn.style.right = "20px";
      closeBtn.style.backgroundColor = "transparent";
      closeBtn.style.color = "white";
      closeBtn.style.border = "none";
      closeBtn.style.fontSize = "40px";
      closeBtn.style.cursor = "pointer";

      closeBtn.onclick = () => {
        document.body.removeChild(fullscreenImg);
      };

      fullscreenImg.appendChild(imgElement);
      fullscreenImg.appendChild(closeBtn);
      document.body.appendChild(fullscreenImg);
    }
  };

  return (
    <div className="pb-20 px-0 pt-0 bg-[#EEEAE2] font-serif">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-10 bg-[#EEEAE2] p-4 flex justify-between items-center border-b border-[#D9D4C5]">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center text-sm font-medium text-[#363532] hover:text-[#795C34] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </button>
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-sm text-[#363532] hover:text-[#BF4342] transition-colors">
            <Heart className="h-4 w-4 mr-1 text-[#BF4342]" />
            收藏
          </button>
          <button className="flex items-center text-sm text-[#363532] hover:text-[#BF4342] transition-colors">
            <Share2 className="h-4 w-4 mr-1 text-[#BF4342]" />
            分享
          </button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="px-[8px]">
        {/* 作品展示区 */}
        <div className="relative mb-6 mt-6 bg-white rounded-md overflow-hidden flex justify-center shadow-sm border border-[#D9D4C5]">
          <div className="relative artwork-frame" style={{ width: '100%', height: 'auto', aspectRatio: '0.75', maxWidth: '500px', position: 'relative' }}>
            <button 
              onClick={handleFullScreen} 
              className="absolute top-2 right-2 z-10 bg-[#EEEAE2]/80 hover:bg-[#EEEAE2] p-1.5 rounded-full shadow-sm transition-all"
            >
              <Maximize className="h-5 w-5 text-[#363532]" />
            </button>
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="artwork-image w-full h-full object-contain transform"
              style={{ transform: `scale(${scale})` }}
            />
            <div className="absolute bottom-3 left-0 right-0 px-6 z-10">
              <Slider
                defaultValue={[1]}
                min={0.5}
                max={2}
                step={0.1}
                value={[scale]}
                onValueChange={handleScaleChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* 作品基本信息 */}
        <div className="mb-6 px-2 bg-white rounded-md p-4 shadow-sm border border-[#D9D4C5]">
          <h1 className="text-2xl font-serif font-bold text-[#363532]">{artwork.title}</h1>
          <div className="mt-3 text-sm text-[#363532]">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <span className="text-[#666460]">艺术家：</span>
                <span className="font-medium">{artwork.artist}</span>
              </div>
              <div>
                <span className="text-[#666460]">创作年份：</span>
                <span className="font-medium">{artwork.year}</span>
              </div>
              <div>
                <span className="text-[#666460]">类型：</span>
                <span className="font-medium">{artwork.medium}</span>
              </div>
              <div>
                <span className="text-[#666460]">尺寸：</span>
                <span className="font-medium">{artwork.dimensions}</span>
              </div>
              <div>
                <span className="text-[#666460]">收藏地：</span>
                <span className="font-medium">{artwork.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 作品描述 */}
        <div className="mb-6 p-5 bg-white rounded-md shadow-sm border border-[#D9D4C5]">
          <h2 className="text-lg font-serif font-semibold mb-2 text-[#363532]">作品描述</h2>
          <p className="text-sm text-[#363532] leading-relaxed">{artwork.description}</p>
        </div>

        {/* 视频讲解区 */}
        <div className="mb-6 rounded-md overflow-hidden shadow-sm border border-[#D9D4C5]">
          <h2 className="text-lg font-serif font-semibold mb-2 p-3 bg-white text-[#363532]">穿越时空的杰作：梵高向日葵的故事</h2>
          <div className="bg-[#D9D4C5] aspect-video flex items-center justify-center">
            <p className="text-[#666460]">视频讲解区（尚未实现）</p>
          </div>
        </div>

        {/* 互动问答区 */}
        <div className="mb-6 p-5 bg-white rounded-md shadow-sm border border-[#D9D4C5]">
          <h2 className="text-lg font-serif font-semibold mb-2 text-[#363532]">趣味问答</h2>
          <p className="text-sm text-[#666460] mb-4">测试你对这幅艺术品的了解（5道题，每题10分）</p>

          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="border border-[#D9D4C5] rounded-md p-4 bg-[#F7F5F0]">
                <p className="font-medium mb-3 text-[#363532]">{quiz.question}</p>
                <div className="flex justify-center space-x-6">
                  <Button
                    variant={selectedAnswers[quiz.id] === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAnswerSelect(quiz.id, true)}
                    disabled={submitted}
                    className={`w-20 ${selectedAnswers[quiz.id] === true ? "bg-[#9F8772] hover:bg-[#795C34]" : "text-[#363532] border-[#D9D4C5]"}`}
                  >
                    是
                  </Button>
                  <Button
                    variant={selectedAnswers[quiz.id] === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAnswerSelect(quiz.id, false)}
                    disabled={submitted}
                    className={`w-20 ${selectedAnswers[quiz.id] === false ? "bg-[#9F8772] hover:bg-[#795C34]" : "text-[#363532] border-[#D9D4C5]"}`}
                  >
                    否
                  </Button>
                </div>

                {submitted && (
                  <div className="mt-3 text-sm p-3 rounded-md bg-[#EEEAE2]">
                    <p className={selectedAnswers[quiz.id] === quiz.answer ? "text-[#588157]" : "text-[#BF4342]"}>
                      {quiz.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!submitted ? (
            <Button onClick={handleSubmit} className="w-full mt-4 bg-[#795C34] hover:bg-[#6A4F2D] text-white">
              提交答案
            </Button>
          ) : (
            <div className="mt-4 text-center p-4 bg-[#F7F5F0] rounded-md border border-[#D9D4C5]">
              <p className="font-bold text-[#363532]">你的得分: {score} / 50</p>
            </div>
          )}
        </div>

        {/* 评论区 */}
        <div className="mb-6 bg-white p-5 rounded-md shadow-sm border border-[#D9D4C5]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-serif font-semibold text-[#363532]">评论 ({comments.length})</h2>
            <button className="text-sm text-[#BF4342] hover:text-[#795C34] font-medium">添加评论</button>
          </div>

          <div className="space-y-5">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-[#D9D4C5] pb-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    className="w-10 h-10 rounded-full border border-[#D9D4C5]"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-[#363532]">{comment.user}</h3>
                      <span className="text-xs text-[#666460]">{comment.time}</span>
                    </div>
                    <p className="text-sm mt-2 text-[#363532] leading-relaxed">{comment.content}</p>
                    <div className="flex items-center space-x-5 mt-3">
                      <button className="text-xs text-[#666460] hover:text-[#BF4342] flex items-center transition-colors">
                        <Heart className="h-3 w-3 mr-1 text-[#BF4342]" />
                        {comment.likes}
                      </button>
                      <button className="text-xs text-[#666460] hover:text-[#BF4342] flex items-center transition-colors">
                        <MessageSquare className="h-3 w-3 mr-1 text-[#BF4342]" />
                        回复
                      </button>
                    </div>

                    {/* 回复 */}
                    {comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-[#D9D4C5] space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-2">
                            <img
                              src={reply.avatar}
                              alt={reply.user}
                              className="w-7 h-7 rounded-full border border-[#D9D4C5]"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="text-xs font-medium text-[#363532]">{reply.user}</h4>
                                <span className="text-xs text-[#666460]">{reply.time}</span>
                              </div>
                              <p className="text-xs mt-1 text-[#363532] leading-relaxed">{reply.content}</p>
                              <div className="flex items-center mt-2">
                                <button className="text-xs text-[#666460] hover:text-[#BF4342] flex items-center transition-colors">
                                  <Heart className="h-3 w-3 mr-1 text-[#BF4342]" />
                                  {reply.likes}
                                </button>
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
        </div>

        {/* 下载原图区域 */}
        <div className="mb-6 p-5 bg-white rounded-md shadow-sm flex flex-col items-center border border-[#D9D4C5]">
          <h2 className="text-lg font-serif font-semibold mb-2 text-[#363532]">下载高清原图</h2>
          <p className="text-sm text-[#666460] mb-4">获取这幅艺术作品的高分辨率图像</p>
          <Button className="flex items-center bg-[#795C34] hover:bg-[#6A4F2D] text-white border-none">
            <Download className="h-4 w-4 mr-2" />
            下载原图 (15MB)
          </Button>
        </div>
      </div>
    </div>
  );
}