import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface ArtworkDetails {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
}

const WorkDetails: FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // 获取作品详情数据
  const { data: artwork, isLoading } = useQuery<ArtworkDetails>({
    queryKey: ['/api/artworks', id],
    enabled: !!id
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!artwork) {
    return <div>Artwork not found</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#EEEAE2]">
      <div className="mx-auto max-w-[390px] px-2">
        {/* Works Show Section */}
        <section className="mt-[102px] relative">
          <div className="relative w-[374px] h-[537px]">
            {/* Main Image */}
            <img 
              src={artwork?.imageUrl || "https://placehold.co/374x477"} 
              alt={artwork?.title}
              className="w-[374px] h-[477px] rounded-xl object-cover"
            />

            {/* SVIP Badge */}
            <div className="absolute left-[14px] top-[12px] text-white text-[14px] leading-[22px] shadow-text">
              SVIP
            </div>

            {/* Fullscreen Button */}
            <button className="absolute right-[50px] bottom-[93px] text-white">
              <Icons.maximize className="w-6 h-6" />
            </button>

            {/* Zoom Slider */}
            <div className="absolute left-[21px] bottom-[79px] w-[324px]">
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

            {/* Title */}
            <h1 className="mt-3 text-[15px] leading-6">
              {artwork?.title || "达芬奇密码在线破解！高清《蒙娜丽莎》带你揭开艺术史上的最大谜团"}
            </h1>
          </div>
        </section>

        {/* Video Section */}
        <section className="mt-7">
          <div className="relative w-[374px] h-[211px] bg-[#171A1F] rounded-xl overflow-hidden">
            <img
              src="https://placehold.co/374x211"
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
          <h2 className="mt-3 text-[15px] leading-6">《蒙娜丽莎的20个秘密》</h2>
        </section>

        {/* Work Info Section */}
        <section className="mt-8">
          <div className="border-t border-[#B0B0B0] pt-6">
            <h3 className="text-[#747472] text-base">《蒙娜丽莎》</h3>
            <p className="mt-4 text-[15px] leading-6">
              《蒙娜丽莎》（Mona Lisa）是意大利文艺复兴时期画家列奥纳多·达·芬奇创作的油画，现收藏于法国卢浮宫博物馆。该画作主要表现了女性的典雅和恬静的典型形象，塑造了资本主义上升时期一位城市有产阶级的妇女形象。...
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-8 border-t border-[#D9D9D9]">
          <h3 className="mt-4 text-[#747472] text-[15px]">趣闻问答</h3>
          {/* FAQ items will be rendered here */}
        </section>

        {/* Comments Section */}
        <section className="mt-8 border-t border-[#B0B0B0] pt-4">
          <h3 className="text-center text-[15px]">516条评论</h3>
          {/* Comments will be rendered here */}
        </section>
      </div>
    </div>
  );
}

export default WorkDetails;