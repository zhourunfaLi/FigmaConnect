
import { FC } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

// 静态作品数据
const STATIC_ARTWORK = {
  id: 1,
  title: "蒙娜丽莎",
  imageUrl: "/src/assets/design/works-01.png",
  description: "《蒙娜丽莎》是意大利文艺复兴时期画家列奥纳多·达·芬奇于1503年至1506年创作的一幅肖像画，是世界上最著名的画作之一。这幅油画以一位神秘优雅的年轻女子为主题，其面部表情充满深意，特别是那若隐若现的微笑成为了艺术史上最令人着迷的谜团之一。",
  videoTitle: "《蒙娜丽莎的20个秘密》",
  videoThumbnail: "/src/assets/design/works-02.png",
  faqs: [
    {
      question: "为什么蒙娜丽莎如此著名？",
      answer: "蒙娜丽莎之所以成为世界上最著名的艺术品，不仅因为它精湛的艺术技法，更因为画中女子神秘的微笑和目光。达芬奇运用特殊的渐变技法(sfumato)创造出柔和的轮廓，使得观众从不同角度观看时，会感受到不同的表情变化。"
    },
    {
      question: "画中人物是谁？",
      answer: "关于画中人物的身份一直存在争议。最广为接受的说法是她是佛罗伦萨丝绸商人弗朗切斯科·德尔·焦孔多的妻子丽莎·格拉尔迪尼。这也是'蒙娜丽莎'这个名字的由来，'蒙娜'在意大利语中是'夫人'的意思。"
    },
    {
      question: "画作的尺寸有多大？",
      answer: "与很多人的想象不同，《蒙娜丽莎》的实际尺寸并不大，画作高77厘米，宽53厘米，是一幅相对小巧的油画，采用意大利白杨木为画板。"
    }
  ]
};

const WorkDetails: FC = () => {
  const params = useParams<{ id: string }>();
  const artwork = STATIC_ARTWORK;

  return (
    <div className="w-full min-h-screen bg-[#EEEAE2]">
      <div className="mx-auto w-full max-w-[374px] md:max-w-[600px] lg:max-w-[800px] px-[8px]">
        {/* Works Show Section */}
        <section className="mt-[102px] relative">
          <div className="relative w-full h-auto aspect-[0.7] mx-auto">
            <div className="relative w-full h-[477px] rounded-xl overflow-hidden">
              {/* Main Image */}
              <img 
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover"
            />

            {/* SVIP Badge */}
            <div className="absolute left-[14px] top-[12px] text-white text-[14px] leading-[22px] shadow-text">
              SVIP
            </div>

            {/* Zoom Slider */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[12px] w-[324px]">
              
            {/* Fullscreen Button */}
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

          {/* Title */}
          <h1 className="mt-3 text-[15px] leading-6">
            达芬奇密码在线破解！高清《蒙娜丽莎》带你揭开艺术史上的最大谜团
          </h1>
          </div>
        </section>

        {/* Video Section */}
        <section className="mt-[32px] max-w-[374px] md:max-w-[600px] lg:max-w-[800px] mx-auto">
          <div className="relative w-full aspect-[4/3] bg-[#171A1F] rounded-xl overflow-hidden">
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
            
            {/* Video Controls */}
            <div className="absolute bottom-0 w-full h-[36px] flex items-center px-4">
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
        <section className="mt-[16px]">
          <div className="border-t border-[#B0B0B0] pt-6">
            <h3 className="text-[#747472] text-base">{artwork.title}</h3>
            <p className="mt-4 text-[15px] leading-6">
              {artwork.description}
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-[16px] border-t border-[#D9D9D9]">
          <h3 className="mt-4 text-[#747472] text-[15px]">趣闻问答</h3>
          {artwork.faqs.map((faq, index) => (
            <div key={index} className="mt-6">
              <h4 className="font-medium mb-3">{faq.question}</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name={`faq-${index}`} className="w-4 h-4 text-blue-600" />
                  <span>是</span>
                </label>
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name={`faq-${index}`} className="w-4 h-4 text-blue-600" />
                  <span>否</span>
                </label>
              </div>
              <div className="mt-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                {faq.answer}
              </div>
            </div>
          ))}
        </section>

        {/* Comments Section */}
        <section className="mt-[16px] border-t border-[#B0B0B0] pt-4 pb-20">
          <h3 className="text-center text-[15px]">516条评论</h3>
        </section>
      </div>
    </div>
  );
}

export default WorkDetails;
