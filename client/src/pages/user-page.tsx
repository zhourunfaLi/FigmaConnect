import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function UserPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const artworks = [
    { id: 1, title: "清明上河图", image: "/src/assets/design/works-01.png" },
    { id: 2, title: "清明上河图", image: "/src/assets/design/works-02.png" },
    { id: 3, title: "清明上河图", image: "/src/assets/design/works-03.png" },
    { id: 4, title: "清明上河图", image: "/src/assets/design/works-04.png" },
    { id: 5, title: "清明上河图", image: "/src/assets/design/works-05.png" },
    { id: 6, title: "清明上河图", image: "/src/assets/design/works-06.png" },
  ];

  return (
    <div className="min-h-screen bg-[#EEEAE2]">
      <div className="relative mt-4 pb-8 pt-6 px-4">
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-black text-sm font-normal">{user.username || "达芬奇的幻想"}</h2>
            <div className="flex items-center text-[#747472] text-xs gap-2">
              <span className="bg-secondary rounded-full px-2 py-1">艺术天赋 885</span>
            </div>
          </div>
          <Avatar className="w-24 h-24 border-[9px] border-white">
            <img src="/src/assets/design/avatar/001.png" alt="avatar" className="w-full h-full object-cover" />
          </Avatar>
          <Button className="bg-[#147ADA] text-xs px-3 py-1 h-[27px] rounded">
            SVIP充值
          </Button>
        </div>

        {/* 特权卡片 */}
        <div className="bg-[#624811] p-4 rounded-[20px] text-white mb-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg">尊享特权</span>
            <div className="bg-[#D4AF37] p-1 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
          </div>

          <p className="text-sm mb-6 opacity-80">
            邀请好友订阅即可获得：
            <br/>• 好友订阅优惠 5 元
            <br/>• 您获得 1 周会员延期（可累加）
          </p>

          <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs opacity-80 block mb-1">您的专属邀请码</span>
              <span className="text-base">GHJO#$675sg</span>
            </div>
            <Button className="bg-white text-black text-xs px-4 py-1 h-auto rounded-full hover:bg-white/90">
              复制
            </Button>
          </div>
        </div>

        <div className="bg-[#FFFDFB] px-4 pt-6">
          <span className="text-[#747472] text-sm font-medium">您的收藏</span>

          <div className="mt-4 grid grid-cols-3 gap-[18px] pb-0">
            {artworks.map((artwork) => (
              <div 
                key={artwork.id} 
                className="relative touch-manipulation"
                onClick={() => {
                  console.log('Navigate to artwork:', artwork.id);
                }}
                onTouchStart={(e) => {
                  const element = e.currentTarget;
                  const timer = setTimeout(() => {
                    const deleteBtn = element.querySelector('.delete-btn');
                    if (deleteBtn) {
                      deleteBtn.classList.remove('hidden');
                    }
                  }, 500);
                  element.setAttribute('data-timer', timer.toString());
                }}
                onTouchEnd={(e) => {
                  const element = e.currentTarget;
                  const timer = parseInt(element.getAttribute('data-timer') || '0');
                  clearTimeout(timer);
                }}
              >
                <img 
                  src={artwork.image} 
                  alt={artwork.title}
                  className="w-[112px] h-[128px] rounded-md object-cover"
                />
                <button 
                  className="delete-btn hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            bg-black/70 text-white px-4 py-2 rounded-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Delete artwork:', artwork.id);
                  }}
                >
                  删除
                </button>
                <p className="text-[#747472] text-xs text-center mt-1">
                  中国十大名画<br/>
                  {artwork.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 w-full h-[73px] bg-white border-t border-black/20">
        <div className="flex justify-around items-center h-full px-16">
          <button className="p-2">
            <svg width="37" height="37" viewBox="0 0 37 37" fill="none">
              <path d="M7.70837 19.6711C7.70837 17.5779 7.70837 16.5313 8.1315 15.6113C8.55463 14.6913 9.34927 14.0102 10.9386 12.648L12.4802 11.3265C15.3528 8.8643 16.7891 7.63318 18.5 7.63318C20.2109 7.63318 21.6472 8.8643 24.5199 11.3265L26.0615 12.648C27.6508 14.0102 28.4455 14.6913 28.8686 15.6113C29.2917 16.5313 29.2917 17.5779 29.2917 19.6711V26.2084C29.2917 29.1154 29.2917 30.5689 28.3886 31.4719C27.4855 32.375 26.032 32.375 23.125 32.375H13.875C10.968 32.375 9.51455 32.375 8.61146 31.4719C7.70837 30.5689 7.70837 29.1154 7.70837 26.2084V19.6711Z" stroke="#1C1C1C" strokeWidth="2"/>
            </svg>
          </button>
          <button className="p-2">
            <svg width="37" height="37" viewBox="0 0 37 37" fill="none">
              <circle cx="18.5" cy="11.5833" r="6.16667" stroke="#1C1C1C" strokeWidth="2"/>
              <path d="M30.8333 31.625C30.8333 25.0522 25.0728 19.7917 18.5 19.7917C11.9272 19.7917 6.16667 25.0522 6.16667 31.625" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}