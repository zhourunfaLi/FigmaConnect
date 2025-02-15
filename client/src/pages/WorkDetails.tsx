import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icons from "@/components/icons";

const STATIC_ARTWORK = {
  id: 1,
  title: "蒙娜丽莎",
  artist: "达芬奇",
  imageUrl: "/artwork/monalisa.jpg",
  videoUrl: "https://example.com/video.mp4",
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
  ]
};

const WorkDetails: FC = () => {
  const params = useParams<{ id: string }>();
  const artwork = STATIC_ARTWORK;
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

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
        </section>

        {/* Art Quiz Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-[#E8E6E1]">
            <h2 className="text-2xl font-serif mb-6 text-center">艺术趣味问答</h2>
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

        {/* Comments Section */}
        <section className="mb-20">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-[#E8E6E1]">
            <h3 className="text-2xl font-serif mb-8 text-center">艺术评论</h3>

            {/* Comments List */}
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
                  <p className="text-gray-800 font-serif leading-relaxed mb-4">{comment.content}</p>
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

            {/* Comment Input */}
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
                <Button className="bg-[#8B4513] hover:bg-[#6F2F0A] font-serif">
                  发表评论
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Download Button */}
        <section className="mt-12 mb-20 flex justify-center">
          <Button 
            size="lg"
            className="bg-[#8B4513] hover:bg-[#6F2F0A] text-white rounded-full px-12 py-6 shadow-lg flex items-center gap-2 text-base font-serif"
            onClick={() => window.open(artwork.imageUrl, '_blank')}
          >
            <Icons.download className="w-6 h-6" />
            下载原图
          </Button>
        </section>
      </div>
    </div>
  );
};

export default WorkDetails;