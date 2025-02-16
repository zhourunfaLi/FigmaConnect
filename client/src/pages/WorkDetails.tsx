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

  const handleSubmit = () => {
    const totalQuestions = artwork.faqs.length;
    let correctAnswers = 0;
    artwork.faqs.forEach(faq => {
      if (userAnswers[faq.id] === faq.answer) {
        correctAnswers++;
      }
    });
    setScore(Math.floor((correctAnswers / totalQuestions) * 100));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh]">
        <img 
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{artwork.title}</h1>
          <p className="text-lg max-w-2xl leading-relaxed">{artwork.description}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Video Section */}
        <section className="mb-16">
          <h2 className="text-2xl text-white mb-6">视频解析</h2>
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

        {/* Quiz Section */}
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
                    className={`w-32 ${userAnswers[faq.id] === 'YES' ? 'bg-white text-black' : ''}`}
                  >
                    YES
                  </Button>
                  <Button
                    onClick={() => handleAnswer(faq.id, 'NO')}
                    variant="outline"
                    className={`w-32 ${userAnswers[faq.id] === 'NO' ? 'bg-white text-black' : ''}`}
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
                className="w-48"
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

        {/* Download Button */}
        <section className="flex justify-center">
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