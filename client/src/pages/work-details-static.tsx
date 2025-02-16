
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WorkDetailsStatic() {
  return (
    <div className="min-h-screen bg-[#EEEAE2]">
      {/* WeChat Navigation Bar */}
      <div className="w-full h-[90px] bg-white flex items-center justify-center border-b border-black/10">
        <img 
          src="/src/assets/design/weixin NAV.png" 
          alt="WeChat Navigation" 
          className="w-full h-full object-contain" 
        />
      </div>

      <div className="container mx-auto px-4 py-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            {/* Work Show Section */}
            <div className="mb-8">
              <div className="relative">
                <img 
                  src="/src/assets/design/works-01.png"
                  alt="Artwork"
                  className="w-full rounded-xl"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-[#EB9800] text-white text-xs rounded">
                  SVIP
                </div>
              </div>
              <h1 className="mt-3 text-base font-medium">达芬奇密码在线破解！高清《蒙娜丽莎》带你揭开艺术史上的最大谜团</h1>
            </div>

            {/* Video Section */}
            <div className="mb-8">
              <div className="bg-black rounded-xl aspect-video relative">
                <img 
                  src="/src/assets/design/works-02.png"
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover rounded-xl"
                />
                <Button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#EB9800] hover:bg-[#EB9800]/90">
                  播放视频
                </Button>
              </div>
              <h2 className="mt-2 text-base font-medium">《蒙娜丽莎的20个秘密》</h2>
            </div>

            {/* Work Info Section */}
            <div className="mb-8">
              <h3 className="text-gray-600 mb-4 font-medium">《蒙娜丽莎》</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                《蒙娜丽莎》（Mona Lisa）是意大利文艺复兴时期画家列奥纳多·达·芬奇创作的油画，现收藏于法国卢浮宫博物馆。该画作主要表现了女性的典雅和恬静的典型形象，塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物形象生动，神态自然，整幅画色调和谐，意境深远。
              </p>
            </div>

            {/* FAQ Section */}
            <div className="mb-8">
              <h3 className="text-gray-600 mb-4 font-medium">趣闻问答</h3>
              <div className="space-y-4">
                <div className="p-4 border-t border-b">
                  <p className="mb-2">1.《蒙娜丽莎》是达芬奇唯一一幅女性肖像画吗？</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">真</Button>
                    <Button variant="outline" className="flex-1">假</Button>
                  </div>
                </div>
                <div className="p-4 border-b">
                  <p className="mb-2">2. 达芬奇花了多少年完成这幅画？</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">4年</Button>
                    <Button variant="outline">16年</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-8">
              <h3 className="text-center mb-4 text-gray-600">516条评论</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <img src="/src/assets/design/works-03.png" alt="Avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-gray-600 text-sm">张振宇房哥</p>
                    <p className="mt-1 text-sm">很棒的讲解，让我对这幅画有了更深的认识。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="flex justify-center">
              <Button className="bg-[#EB9800] hover:bg-[#EB9800]/90 text-white px-8">
                下载原图
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
