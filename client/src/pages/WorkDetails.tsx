import { FC } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import React, { useState } from "react";
import CommentSection from '@/components/comment-section';

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
      question: "蒙娜丽莎的微笑是怎样产生的？",
      type: "yes_no",
      answer: "NO",
      explanation: "这是一种视觉错觉，由达芬奇的sfumato绘画技巧造成的。"
    },
    {
      id: 5,
      question: "蒙娜丽莎的背景是什么？",
      type: "yes_no",
      answer: "YES",
      explanation: "背景是朦胧的山峦和河流，增加了画面的神秘感。"
    }
  ]
};

const WorkDetails: FC = () => {
  const params = useParams<{ id: string }>();
  const artwork = STATIC_ARTWORK;
  const [zoom, setZoom] = useState(1);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const toggleComments = (commentId: number) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({...prev, [questionId]: answer}));
  };

  const handleSubmit = () => {
    const totalQuestions = artwork.faqs.length;
    let correctAnswers = 0;
    artwork.faqs.forEach(faq => {
      if (userAnswers[faq.id] === faq.answer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers * 10); //Score is now 10 points per correct answer.
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      <section className="mb-8 px-4 pt-4">
        <div className="relative w-full h-[80vh] bg-black rounded-2xl overflow-hidden">
          {/* SVIP Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-[#EB9800] text-white px-3 py-1 rounded-full font-medium">
              SVIP
            </div>
          </div>

          {/* Image Container */}
          <div className="relative w-full h-full">
            <img 
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />

            {/* Controls Overlay */}
            <div className="absolute bottom-4 w-full px-4 flex justify-center">
              {/* Zoom Controls */}
              <div className="flex flex-col items-center gap-2">
                {/* Zoom Value Display */}
                <div className="bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                  {zoom}x
                </div>
                {/* Zoom Slider */}
                <div className="bg-black/50 rounded-full px-6 py-3 flex items-center gap-4">
                  <button className="text-white">-</button>
                  <input
                    type="range"
                    min="1"
                    max="300"
                    value={zoom * 100}
                    onChange={(e) => setZoom(Number(e.target.value) / 100)}
                    className="w-48"
                  />
                  <button className="text-white">+</button>
                </div>
              </div>

              {/* Fullscreen Button */}
              <button className="absolute right-8 bottom-16 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors">
                <Icons.maximize className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl text-white mt-4">
          达芬奇密码在线破解！高清《蒙娜丽莎》带你揭开艺术史上的最大谜团
        </h1>
      </section>

      {/* Description Section */}
      <section className="mb-8 px-4">
        <h2 className="text-2xl text-white mb-4">作品介绍</h2>
        <p className="text-lg text-white/80 leading-relaxed">
          {artwork.description}
        </p>
      </section>

      <div className="w-full h-px bg-gray-800" />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-2xl text-white mb-6">《蒙娜丽莎的20个秘密》</h2>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={artwork.videoThumbnail}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
              <Icons.play className="w-16 h-16 text-white" />
            </button>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl text-white mb-6">趣味问答</h2>
          <div className="space-y-6">
            {artwork.faqs.map((faq) => (
              <div key={faq.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl text-white mb-4">{faq.question}</h3>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleAnswer(faq.id, 'YES')}
                    variant="outline"
                    className={`w-32 border-2 touch-manipulation ${
                      userAnswers[faq.id] === 'YES' 
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'border-gray-600 text-gray-400 hover:bg-transparent focus:bg-transparent'
                    }`}
                  >
                    YES
                  </Button>
                  <Button
                    onClick={() => handleAnswer(faq.id, 'NO')}
                    variant="outline"
                    className={`w-32 border-2 touch-manipulation ${
                      userAnswers[faq.id] === 'NO' 
                        ? 'bg-red-500 text-white border-red-500' 
                        : 'border-gray-600 text-gray-400 hover:bg-transparent focus:bg-transparent'
                    }`}
                  >
                    NO
                  </Button>
                </div>
                {submitted && (
                  <div className={`mt-4 ${userAnswers[faq.id] === faq.answer ? 'text-green-400' : 'text-red-400'}`}>
                    <p>{userAnswers[faq.id] === faq.answer ? '✓ 回答正确' : '✗ 回答错误'}</p>
                    <p className="text-white/80 mt-2">{faq.explanation}</p>
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col items-center gap-4 mt-8">
              <Button
                onClick={handleSubmit}
                disabled={submitted || Object.keys(userAnswers).length !== artwork.faqs.length}
                className="w-48 bg-blue-600 text-white hover:bg-blue-700 font-medium text-lg py-6"
              >
                提交答案
              </Button>
              {submitted && (
                <div className="text-2xl text-white">
                  得分: <span className="text-green-400">{score}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="my-8 border-t border-gray-800"></div>

        <section className="mb-16">
          <h2 className="text-2xl text-white mb-6">评论区</h2>
          <div className="space-y-6">
            {/* Comment 1 */}
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <img src="/src/assets/design/avatar/001.png" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-white font-medium">艺术爱好者</h3>
                    <span className="text-gray-400 text-sm">2024-01-15</span>
                  </div>
                  <p className="text-gray-200 mt-2">这幅画真的太震撼了，每次看都能发现新的细节。达芬奇的技法真是让人叹为观止。</p>
                  <button 
                    className="text-blue-400 text-sm mt-2"
                    onClick={() => toggleComments(1)}
                  >
                    {expandedComments.has(1) ? '收起回复' : '展开 3 条回复'}
                  </button>
                  <div className={`${expandedComments.has(1) ? 'block' : 'hidden'} mt-4 space-y-4 pl-4 border-l border-gray-700`}>
                    <div className="flex items-start gap-3">
                      <img src="/src/assets/design/avatar/002.png" className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="flex gap-2">
                          <h4 className="text-white">美术老师</h4>
                          <span className="text-gray-400 text-sm">2024-01-15</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">确实，尤其是她的眼神，太迷人了。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment 2 */}
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <img src="/src/assets/design/avatar/003.png" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-white font-medium">历史研究者</h3>
                    <span className="text-gray-400 text-sm">2024-01-14</span>
                  </div>
                  <p className="text-gray-200 mt-2">从艺术史的角度来看，这幅画对后世的影响无可估量。</p>
                  <button 
                    className="text-blue-400 text-sm mt-2"
                    onClick={() => toggleComments(2)}
                  >
                    {expandedComments.has(2) ? '收起回复' : '展开 5 条回复'}
                  </button>
                  <div className={`${expandedComments.has(2) ? 'block' : 'hidden'} mt-4 space-y-4 pl-4 border-l border-gray-700`}>
                    <div className="flex items-start gap-3">
                      <img src="/src/assets/design/avatar/004.png" className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="flex gap-2">
                          <h4 className="text-white">艺术史专家</h4>
                          <span className="text-gray-400 text-sm">2024-01-14</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">完全同意，这幅画开创了肖像画的新纪元。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Comment 3 to 6 */}
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <img src="/src/assets/design/avatar/005.png" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-white font-medium">摄影师小王</h3>
                    <span className="text-gray-400 text-sm">2024-01-13</span>
                  </div>
                  <p className="text-gray-200 mt-2">光影处理太妙了，作为一名摄影师，我从中学到了很多。</p>
                  <button className="text-blue-400 text-sm mt-2" onClick={() => toggleComments(3)}>
                    {expandedComments.has(3) ? '收起回复' : '展开 2 条回复'}
                  </button>
                  <div className={`${expandedComments.has(3) ? 'block' : 'hidden'} mt-4 space-y-4 pl-4 border-l border-gray-700`}>
                    <div className="flex items-start gap-3">
                      <img src="/src/assets/design/avatar/006.png" className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="flex gap-2">
                          <h4 className="text-white">光影大师</h4>
                          <span className="text-gray-400 text-sm">2024-01-13</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">sfumato技法的运用确实高超。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <img src="/src/assets/design/avatar/007.png" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-white font-medium">艺术学院学生</h3>
                    <span className="text-gray-400 text-sm">2024-01-12</span>
                  </div>
                  <p className="text-gray-200 mt-2">正在临摹这幅画，细节真的太多了，每天都有新发现。</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <img src="/src/assets/design/avatar/008.png" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-white font-medium">色彩研究员</h3>
                    <span className="text-gray-400 text-sm">2024-01-11</span>
                  </div>
                  <p className="text-gray-200 mt-2">色彩的层次感非常丰富，尤其是背景的渐变处理。</p>
                  <button className="text-blue-400 text-sm mt-2" onClick={() => toggleComments(5)}>
                    {expandedComments.has(5) ? '收起回复' : '展开 4 条回复'}
                  </button>
                  <div className={`${expandedComments.has(5) ? 'block' : 'hidden'} mt-4 space-y-4 pl-4 border-l border-gray-700`}>
                    <div className="flex items-start gap-3">
                      <img src="/src/assets/design/avatar/001.png" className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="flex gap-2">
                          <h4 className="text-white">油画爱好者</h4>
                          <span className="text-gray-400 text-sm">2024-01-11</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">请问这种效果要怎么才能画出来呢？</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <img src="/src/assets/design/avatar/002.png" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-white font-medium">博物馆讲解员</h3>
                    <span className="text-gray-400 text-sm">2024-01-10</span>
                  </div>
                  <p className="text-gray-200 mt-2">每次讲解这幅画时，都能感受到游客们的惊叹。</p>
                  <button className="text-blue-400 text-sm mt-2" onClick={() => toggleComments(6)}>
                    {expandedComments.has(6) ? '收起回复' : '展开 6 条回复'}
                  </button>
                  <div className={`${expandedComments.has(6) ? 'block' : 'hidden'} mt-4 space-y-4 pl-4 border-l border-gray-700`}>
                    <div className="flex items-start gap-3">
                      <img src="/src/assets/design/avatar/003.png" className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="flex gap-2">
                          <h4 className="text-white">游客</h4>
                          <span className="text-gray-400 text-sm">2024-01-10</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">上周听了您的讲解，收获很大！</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="my-8 border-t border-gray-800"></div>

        <section className="flex justify-center mb-16">
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-white/90 px-12 py-6"
            onClick={() => window.open(artwork.imageUrl, '_blank')}
          >
            <Icons.download className="w-6 h-6 mr-2" />
            下载原图
          </Button>
        </section>
      </div>
    </div>
  );
};

export default WorkDetails;