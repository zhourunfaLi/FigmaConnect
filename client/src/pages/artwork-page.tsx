import React, { useState } from "react";
import { ArrowLeft, Heart, Share2, MessageSquare, Download, Maximize, PlayCircle } from "lucide-react";
import { useParams, useLocation } from "wouter";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth"; 

export default function ArtworkPage() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const id = params?.id || "1";
  const [scale, setScale] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [commentText, setCommentText] = useState(""); 
  const { user } = useAuth(); 


  console.log("ArtworkPage: URL路径参数=" + params?.id, "解析后ID=" + id);

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

  const handleAnswerSelect = (questionId: number, answer: boolean) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

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

  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

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
    <div className="pb-20 px-0 pt-0 bg-[#EEEAE2] font-serif art-container">
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

      <div className="px-[8px]">
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

        <div className="my-4 px-2">
          <div className="bg-[#F0E6DD] rounded-sm p-3 flex justify-center items-center h-[90px] border border-[#D8B4A0]/30">
            <div className="text-[#594D5B] text-sm flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <span>Google AdSense 广告位</span>
            </div>
          </div>
        </div>

        <div className="px-2 bg-white rounded-sm p-4 shadow-sm border-l-4 border border-[#D8B4A0]/40 border-l-[#957186]">
          <h1 className="text-2xl art-title font-bold text-[#3A3238] tracking-wide">{artwork.title}</h1>
          <div className="mt-3 text-sm text-[#5D5055]">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <span className="text-[#957186]">艺术家：</span>
                <span className="font-medium">{artwork.artist}</span>
              </div>
              <div>
                <span className="text-[#957186]">创作年份：</span>
                <span className="font-medium">{artwork.year}</span>
              </div>
              <div>
                <span className="text-[#957186]">类型：</span>
                <span className="font-medium">{artwork.medium}</span>
              </div>
              <div>
                <span className="text-[#957186]">尺寸：</span>
                <span className="font-medium">{artwork.dimensions}</span>
              </div>
              <div>
                <span className="text-[#957186]">位置：</span>
                <span className="font-medium">{artwork.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 px-2 bg-white rounded-sm p-4 shadow-sm border border-[#D8B4A0]/30">
          <h2 className="text-lg font-serif font-bold text-[#363532] mb-2">作品描述</h2>
          <p className="text-sm text-[#363532] leading-relaxed">
            {artwork.description}
          </p>
        </div>

        <div className="mb-6 px-2 bg-white rounded-sm p-4 shadow-sm border border-[#D8B4A0]/30">
          <h2 className="text-lg art-title font-bold text-[#594D5B] mb-3 border-b border-[#D8B4A0]/20 pb-2">视频讲解</h2>
          <div className="aspect-video bg-[#F0E6DD] rounded-sm overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F0E6DD] to-[#E6DED3]">
              <div className="text-[#957186] flex flex-col items-center">
                <PlayCircle size={40} className="mb-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
                <span className="text-sm font-medium tracking-wide">视频内容加载中</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 px-2 bg-white rounded-sm p-5 shadow-sm border border-[#D8B4A0]/30">
          <h2 className="text-lg art-title font-bold text-[#594D5B] mb-3 border-b border-[#D8B4A0]/20 pb-2">趣味问答</h2>
          <p className="text-sm text-[#5D5055] mb-4 italic">回答以下关于该艺术品的趣味问题，测试你的艺术知识。</p>

          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="pb-3 border-b border-[#F0E6DD] last:border-0">
                <p className="text-sm font-medium text-[#3A3238] mb-2 tracking-wide">{quiz.question}</p>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedAnswers[quiz.id] === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAnswerSelect(quiz.id, true)}
                    disabled={submitted}
                    className={`px-5 py-1.5 rounded-sm text-sm transition-all duration-200 ${
                      selectedAnswers[quiz.id] === true
                        ? "bg-[#957186] text-white shadow-md"
                        : "bg-[#F0E6DD] text-[#594D5B] hover:bg-[#E6DED3]"
                    }`}
                  >
                    是
                  </Button>
                  <Button
                    variant={selectedAnswers[quiz.id] === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAnswerSelect(quiz.id, false)}
                    disabled={submitted}
                    className={`px-5 py-1.5 rounded-sm text-sm transition-all duration-200 ${
                      selectedAnswers[quiz.id] === false
                        ? "bg-[#957186] text-white shadow-md"
                        : "bg-[#F0E6DD] text-[#594D5B] hover:bg-[#E6DED3]"
                    }`}
                  >
                    否
                  </Button>
                </div>

                {submitted && (
                  <div className="mt-2 text-sm">
                    <span className={selectedAnswers[quiz.id] === quiz.answer ? "text-[#4A7A5A]" : "text-[#9A4F50]"}>
                      {quiz.explanation}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!submitted ? (
            <Button onClick={handleSubmit} className="w-full mt-4 bg-[#594D5B] hover:bg-[#614C50] text-white">
              提交答案
            </Button>
          ) : (
            <div className="mt-4 text-center p-4 bg-[#F0E6DD] rounded-sm border border-[#D8B4A0]/30">
              <p className="font-bold text-[#594D5B]">你的得分: {score} / 50</p>
            </div>
          )}
        </div>


        <div className="mb-6 px-2 bg-white rounded-sm p-5 shadow-sm border border-[#D8B4A0]/30">
          <h2 className="text-lg art-title font-bold text-[#594D5B] mb-3 border-b border-[#D8B4A0]/20 pb-2">评论 ({comments.length})</h2>
          <div className="space-y-5">
            {comments.map((comment, index) => (
              <div key={comment.id} className="border-b border-[#F0E6DD] pb-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    className="w-10 h-10 rounded-full border border-[#D8B4A0]/30"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-[#594D5B]">{comment.user}</h3>
                      <span className="text-xs text-[#957186]/80">{comment.time}</span>
                    </div>
                    <p className="text-sm mt-2 text-[#5D5055] leading-relaxed">{comment.content}</p>
                    <div className="flex items-center space-x-5 mt-3">
                      <button className="text-xs text-[#957186]/80 hover:text-[#BF4342] flex items-center transition-colors">
                        <Heart className="h-3 w-3 mr-1 text-[#BF4342]" />
                        {comment.likes}
                      </button>
                      <button className="text-xs text-[#957186]/80 hover:text-[#BF4342] flex items-center transition-colors">
                        <MessageSquare className="h-3 w-3 mr-1 text-[#BF4342]" />
                        回复
                      </button>
                    </div>

                    {comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-[#D8B4A0]/20 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-2">
                            <img
                              src={reply.avatar}
                              alt={reply.user}
                              className="w-7 h-7 rounded-full border border-[#D8B4A0]/30"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="text-xs font-medium text-[#594D5B]">{reply.user}</h4>
                                <span className="text-xs text-[#957186]/80">{reply.time}</span>
                              </div>
                              <p className="text-xs mt-1 text-[#5D5055] leading-relaxed">{reply.content}</p>
                              <div className="flex items-center mt-2">
                                <button className="text-xs text-[#957186]/80 hover:text-[#BF4342] flex items-center transition-colors">
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
          <div className="mt-4">
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition art-input"
              rows={3}
              placeholder="发表评论..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
            <button className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition btn-art">发布评论</button>
          </div>
          <div className="mt-6 p-4 bg-white rounded-sm shadow-sm border border-[#D8B4A0]/30">
            <div className="border border-dashed border-[#D8B4A0]/30 p-4 text-center bg-[#F0E6DD]">
              <p className="text-[#594D5B] mb-2 text-sm tracking-wide">谷歌广告位</p>
              <div className="h-[150px] flex items-center justify-center bg-[#F0E6DD]/50">
                <span className="text-[#957186]/80">Google AdSense</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 p-5 bg-white rounded-sm shadow-sm flex flex-col items-center border border-[#D8B4A0]/30">
          <h2 className="text-lg font-serif font-semibold mb-2 text-[#363532]">下载高清原图</h2>
          <p className="text-sm text-[#666460] mb-4">获取这幅艺术作品的高分辨率图像</p>
          <Button className="flex items-center bg-[#594D5B] hover:bg-[#614C50] text-white border-none btn-art">
            <Download className="h-4 w-4 mr-2" />
            下载原图 (15MB)
          </Button>
        </div>
      </div>
    </div>
  );
}