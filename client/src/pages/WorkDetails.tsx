import { FC, useState } from "react";
import { useParams } from "wouter";
import Icons from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VideoPlayer from "@/components/video-player";

const STATIC_ARTWORK = {
  id: 1,
  title: "蒙娜丽莎",
  artist: "达芬奇", 
  imageUrl: "/src/assets/design/works-01.png",
  videoUrl: "https://example.com/video.mp4",
  description: "《蒙娜丽莎》（Mona Lisa）是意大利文艺复兴时期画家列奥纳多·达·芬奇创作的油画，现收藏于法国卢浮宫博物馆。该画作主要表现了女性的典雅和恬静的典型形象，塑造了资本主义上升时期一位城市有产阶级的妇女形象。《蒙娜丽莎》代表了文艺复兴时期的美学方向；该作品折射出来的女性的深邃与高尚的思想品质，反映了文艺复兴时期人们对于女性美的审美理念和审美追求。",
  createTime: "2024-02-14",
  dimensions: "77 cm × 53 cm",
  medium: "油画",
  faqs: [
    {
      id: 1,
      question: "蒙娜丽莎是否微笑？",
      type: "yes_no",
      answer: "YES",
      explanation: "蒙娜丽莎的微笑是这幅画最著名的特征之一。"
    },
    {
      id: 2,
      question: "画中人物是否有眉毛？",
      type: "yes_no", 
      answer: "NO",
      explanation: "X光扫描显示原画上确实没有眉毛。"
    }
  ],
  isPremium: true
};

const WorkDetails: FC = () => {
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const params = useParams<{ id: string }>();
  const artwork = STATIC_ARTWORK;

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    const correctAnswers = artwork.faqs.reduce((acc, faq) => {
      if (userAnswers[faq.id] === faq.answer) {
        acc += 1;
      }
      return acc;
    }, 0);
    setScore((correctAnswers / artwork.faqs.length) * 100);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 作品展示区 */}
        <section className="mb-12">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="mt-6">
            <h1 className="text-3xl font-serif mb-2">{artwork.title}</h1>
            <p className="text-gray-600 italic">by {artwork.artist}</p>
          </div>

          {/* 作品信息区 */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-[#E8E6E1]">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Icons.calendar className="w-5 h-5 text-[#8B4513]" />
                  <span className="text-gray-600">创作时间：{artwork.createTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.ruler className="w-5 h-5 text-[#8B4513]" />
                  <span className="text-gray-600">尺寸：{artwork.dimensions}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Icons.paintBucket className="w-5 h-5 text-[#8B4513]" />
                  <span className="text-gray-600">媒介：{artwork.medium}</span>
                </div>
              </div>
            </div>
            <p className="mt-6 text-gray-700 leading-relaxed">{artwork.description}</p>
          </div>
        </section>

        {/* 视频展示区 */}
        {artwork.videoUrl && (
          <section className="mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#E8E6E1]">
              <h2 className="text-2xl font-serif mb-6">创作视频</h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <video
                  src={artwork.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* 趣味问答区 */}
        <section className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">趣味问答</h2>
            <div className="space-y-8">
              {artwork.faqs.map((faq) => (
                <div key={faq.id} className="bg-[#FAF9F6] p-6 rounded-lg">
                  <p className="text-lg font-medium mb-4 font-serif">{faq.question}</p>
                  <div className="flex gap-4 justify-center">
                    {["YES", "NO"].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswerChange(faq.id, option)}
                        className={`px-6 py-2 rounded-full font-serif transition-all ${
                          userAnswers[faq.id] === option
                            ? "bg-[#8B4513] text-white"
                            : "bg-[#E8E6E1] hover:bg-[#D3CEC4]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {submitted && (
                    <div className="mt-4 p-4 bg-[#E8E6E1] rounded-lg font-serif">
                      <p className="text-[#8B4513]">{faq.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-4 mt-8">
              <button
                onClick={handleSubmit}
                disabled={submitted || Object.keys(userAnswers).length !== artwork.faqs.length}
                className="px-12 py-3 bg-[#8B4513] text-white rounded-full font-serif transition-all hover:bg-[#6F2F0A] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交答案
              </button>
              {submitted && (
                <div className="text-xl font-serif text-[#8B4513]">
                  你的得分: <span>{score}</span> 分
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 评论区 */}
        <section className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">评论区</h3>
            <div className="space-y-8">
              {[
                {
                  id: 1,
                  user: { id: 1, name: "艺术爱好者", avatar: "/src/assets/design/avatar/001.png" },
                  content: "这幅画真的让人印象深刻，特别是那神秘的微笑！",
                  likes: 12,
                  replies: []
                }
              ].map((comment) => (
                <div key={comment.id} className="bg-[#FAF9F6] p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="w-12 h-12 rounded-full border-2 border-[#8B4513]"
                    />
                    <div>
                      <h4 className="font-serif text-lg">{comment.user.name}</h4>
                      <p className="text-gray-600 text-sm">艺术鉴赏家</p>
                    </div>
                  </div>
                  <p className="text-gray-800 font-serif leading-relaxed mb-4">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-[#8B4513] transition-colors">
                      <Icons.thumbsUp className="w-5 h-5" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-[#8B4513] transition-colors">
                      <Icons.messageCircle className="w-5 h-5" />
                      <span>回复</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 评论输入框 */}
            <div className="mt-8 bg-[#FAF9F6] p-6 rounded-lg">
              <textarea
                placeholder="分享你的艺术见解..."
                className="w-full p-4 border border-[#E8E6E1] rounded-lg font-serif mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                rows={4}
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <button className="text-gray-600 hover:text-[#8B4513] transition-colors">
                    <Icons.image className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-[#8B4513] transition-colors">
                    <Icons.atSign className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-[#8B4513] transition-colors">
                    <Icons.smile className="w-5 h-5" />
                  </button>
                </div>
                <button className="px-6 py-2 bg-[#8B4513] text-white rounded-full font-serif hover:bg-[#6F2F0A] transition-colors">
                  发表评论
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 下载按钮 */}
        <section className="mt-12 mb-20 flex justify-center">
          <button 
            className="bg-[#8B4513] hover:bg-[#6F2F0A] text-white rounded-full px-12 py-6 shadow-lg flex items-center gap-2 text-base font-serif transition-colors"
            onClick={() => window.open(artwork.imageUrl, '_blank')}
          >
            <Icons.download className="w-6 h-6" />
            下载原图
          </button>
        </section>
      </div>
    </div>
  );
};

export default WorkDetails;