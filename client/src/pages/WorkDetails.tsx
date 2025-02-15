import { FC } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import React, { useState } from "react";

const STATIC_ARTWORK = {
  id: 1,
  title: "蒙娜丽莎",
  imageUrl: "/src/assets/design/works-01.png",
  description: "《蒙娜丽莎》是意大利文艺复兴时期画家列奥纳多·达·芬奇于1503年至1506年创作的一幅肖像画，是世界上最著名的画作之一。这幅油画以一位神秘优雅的年轻女子为主题，其面部表情充满深意，特别是那若隐若现的微笑成为了艺术史上最令人着迷的谜团之一。",
  videoTitle: "《蒙娜丽莎的20个秘密》", 
  videoThumbnail: "/src/assets/design/works-02.png",
  faqs: [
    {
      id: 1,
      question: "蒙娜丽莎的眼睛会跟随观众移动？",
      type: "yes_no",
      answer: "YES",
      explanation: "这是一种视觉错觉,画中人物的眼睛似乎会跟随观众移动。"
    },
    {
      id: 2,
      question: "蒙娜丽莎原画上有眉毛？",
      type: "yes_no", 
      answer: "NO",
      explanation: "X光扫描显示原画上确实没有眉毛。"
    },
    {
      id: 3,
      question: "达芬奇曾将画作卖给法国国王？",
      type: "yes_no",
      answer: "YES",
      explanation: "达芬奇在1516年将画作卖给了法国国王弗朗索瓦一世。"
    },
    {
      id: 4,
      question: "蒙娜丽莎的背景是虚构的？",
      type: "yes_no",
      answer: "NO",
      explanation: "背景描绘的是托斯卡纳地区的真实风景。"
    }
  ]
};

const WorkDetails: FC = () => {
  const params = useParams<{ id: string }>();
  const artwork = STATIC_ARTWORK;
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({...prev, [questionId]: answer}));
  };

  // 本地验证逻辑
  const handleSubmit = () => {
    const totalQuestions = artwork.faqs.length;
    let correctAnswers = 0;

    // 验证每个问题的答案
    artwork.faqs.forEach(faq => {
      if (userAnswers[faq.id] === faq.answer) {
        correctAnswers++;
      }
    });

    // 计算分数(每题25分)
    setScore(Math.floor((correctAnswers / totalQuestions) * 100));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#EEEAE2] py-[102px]">
      <div className="mx-auto w-full max-w-[374px] md:max-w-[600px] lg:max-w-[800px] px-[8px] flex flex-col gap-8">
        {/* Works Show Section */}
        <section className="relative">
          <div className="relative w-full h-auto aspect-[0.7]">
            <div className="relative w-full h-[477px] rounded-xl overflow-hidden">
              <img 
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute left-[14px] top-[12px] text-white text-[14px] leading-[22px] shadow-text">
                SVIP
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[12px] w-[324px]">
                <button className="absolute -top-[33px] right-0 text-white">
                  <Icons.maximize className="w-6 h-6" />
                </button>
                <div className="relative">
                  <input 
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    defaultValue="2.4"
                    className="w-full h-[10px] bg-[#D5D1AE] rounded-[5px]"
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="bg-[#C1AB09] text-white px-5 py-1 rounded-full text-[14px]">
                      2.4 X
                    </div>
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#C1AB09] mx-auto" />
                  </div>
                </div>
              </div>
            </div>
            <h1 className="mt-3 text-[15px] leading-6">
              达芬奇密码在线破解！高清《蒙娜丽莎》带你揭开艺术史上的最大谜团
            </h1>
          </div>
        </section>

        {/* Video Section */}
        <section>
          <div className="relative w-full aspect-[16/9] bg-[#171A1F] rounded-xl overflow-hidden">
            <img
              src={artwork.videoThumbnail}
              alt="Video thumbnail"
              className="w-full h-full object-cover rounded-xl opacity-70"
            />
            <Button 
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-red-500 text-red-500"
            >
              <Icons.play className="h-6 w-6" />
            </Button>
            <div className="absolute bottom-0 w-full h-[36px] flex items-center px-4 bg-black/50">
              <Icons.play className="h-4 w-4 text-white" />
              <Icons.skipForward className="ml-4 h-4 w-4 text-white" />
              <Icons.volume2 className="ml-4 h-4 w-4 text-white" />
              <span className="ml-4 text-white text-xs">1:11 / 2:58</span>
              <div className="flex-1 mx-4">
                <div className="relative h-[2px] bg-red-100">
                  <div className="absolute left-0 top-0 h-full w-1/3 bg-red-500" />
                  <div className="absolute left-1/3 top-[-5px] w-3 h-3 rounded-full bg-white shadow" />
                </div>
              </div>
              <Icons.settings className="h-4 w-4 text-white" />
              <Icons.maximize className="ml-4 h-4 w-4 text-white" />
            </div>
          </div>
          <h2 className="mt-3 text-[15px] leading-6">{artwork.videoTitle}</h2>
        </section>

        {/* Work Info Section */}
        <section>
          <div className="border-t border-[#B0B0B0] pt-6">
            <h3 className="text-[#747472] text-base">{artwork.title}</h3>
            <p className="mt-4 text-[15px] leading-6">
              {artwork.description}
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="border-t border-[#B0B0B0] pt-6">
            <h3 className="text-[#747472] text-base mb-4">趣味问答</h3>
            {artwork.faqs.map((faq) => (
              <div key={faq.id} className="mb-6 bg-white rounded-xl p-4 shadow-sm">
                <h4 className="text-[15px] font-medium mb-3">{faq.question}</h4>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleAnswer(faq.id, 'YES')}
                    className={`px-6 py-2 rounded-full transition-all ${
                      userAnswers[faq.id] === 'YES'
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white border border-gray-200 hover:bg-blue-50'
                    }`}
                  >
                    YES
                  </button>
                  <button 
                    onClick={() => handleAnswer(faq.id, 'NO')}
                    className={`px-6 py-2 rounded-full transition-all ${
                      userAnswers[faq.id] === 'NO'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 hover:bg-blue-50'
                    }`}
                  >
                    NO
                  </button>
                </div>
                {submitted && (
                  <div className={`mt-3 text-[14px] leading-6 ${userAnswers[faq.id] === faq.answer ? 'text-green-600' : 'text-red-600'}`}>
                    {userAnswers[faq.id] === faq.answer ? '✓ 回答正确' : '✗ 回答错误'}
                    <p className="text-[#747472] mt-1">{faq.explanation}</p>
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col items-center gap-4 mt-8">
              <button
                onClick={handleSubmit}
                disabled={submitted || Object.keys(userAnswers).length !== artwork.faqs.length}
                className="px-8 py-3 bg-blue-500 text-white rounded-full transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交答案
              </button>
              {submitted && (
                <div className="text-lg font-medium">
                  你的得分: <span className="text-blue-500">{score}</span> 分
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Comments Section */}
        <section>
          <div className="border-t border-[#B0B0B0] pt-6">
            <h3 className="text-[#747472] text-base mb-4">评论区</h3>
            <div className="flex gap-4 items-start mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src="https://api.dicebear.com/7.x/avatars/svg?seed=current-user" 
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <textarea 
                  className="w-full p-3 rounded-lg border border-[#B0B0B0] bg-white mb-2"
                  placeholder="写下你的评论..."
                  rows={3}
                />
                <Button>发布评论</Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {[
                {
                  id: 1,
                  user: { id: 1, name: "艺术爱好者", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=user1" },
                  content: "这幅画真的让人印象深刻，特别是那神秘的微笑！",
                  likes: 12,
                  replies: [
                    {
                      id: 2,
                      user: { id: 2, name: "美术老师", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=user2" },
                      content: "同意！达芬奇的渐变技法(sfumato)在这里展现得淋漓尽致。",
                      likes: 8,
                    }
                  ],
                  createdAt: "2024-02-10T10:00:00Z"
                },
                {
                  id: 3,
                  user: { id: 3, name: "历史研究者", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=user3" },
                  content: "画作背后的历史故事同样引人入胜，值得深入了解。",
                  likes: 5,
                  replies: [],
                  createdAt: "2024-02-09T15:30:00Z"
                }
              ].map(comment => (
                <div key={comment.id} className="bg-white rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[15px] leading-6 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className="flex items-center gap-1 hover:text-blue-500">
                          <Icons.thumbsUp className="w-4 h-4" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-500">
                          <Icons.messageCircle className="w-4 h-4" />
                          <span>回复</span>
                        </button>
                      </div>

                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                <img 
                                  src={reply.user.avatar}
                                  alt={reply.user.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{reply.user.name}</span>
                                </div>
                                <p className="text-[14px] leading-6 mb-2">{reply.content}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <button className="flex items-center gap-1 hover:text-blue-500">
                                    <Icons.thumbsUp className="w-4 h-4" />
                                    <span>{reply.likes}</span>
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
        </section>
      </div>
    </div>
  );
};

export default WorkDetails;