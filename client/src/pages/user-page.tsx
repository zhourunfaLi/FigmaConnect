
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
      <div className="pb-4 pt-4 px-3">
        {/* 顶部布局 */}
        <div className="flex justify-between items-center mb-4">
          {/* 左侧用户信息 */}
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border border-[#F4E7D4]">
              <img src="/src/assets/design/avatar/001.png" alt="avatar" className="w-full h-full object-cover" />
            </Avatar>
            <span className="text-[#1A1A1A] text-sm">{user.username || "达芬奇的幻想"}</span>
          </div>
          {/* 右侧充值按钮 */}
          <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white text-xs px-3 py-1 h-7 rounded-full shadow-sm hover:from-[#E5BE3D] hover:to-[#D4AF37]">
            SVIP充值
          </Button>
        </div>

        {/* 艺术天赋 */}
        <div className="flex gap-1.5 items-center bg-gradient-to-r from-[#F4E7D4] to-[#E5D4BC] px-3 py-1 rounded-full shadow-sm w-fit">
          <span className="text-[#8B7355] text-xs">艺术天赋</span>
          <span className="text-[#D4AF37] font-medium text-xs">885</span>
        </div>

        {/* 邀请码区域 - 深色背景 */}
        <div className="mt-4 bg-[#1F1F1F] p-3 rounded-[12px] border border-[#333333]">
          <p className="text-[#8B7355] text-xs text-center mb-3">
            您的朋友凭此邀请码，订阅可以优惠5元 您也可以获得1周会员延期（可累加）
          </p>
          <div className="flex items-center gap-2 justify-center bg-black/20 p-2 rounded-lg">
            <span className="text-[#8B7355] text-xs">邀请码</span>
            <div className="bg-[#2A2A2A] px-3 py-1 rounded-md">
              <span className="text-[#D4AF37] text-xs tracking-wider">GHJO#$675sg</span>
            </div>
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white text-xs px-2 py-1 h-6 rounded-md hover:from-[#E5BE3D] hover:to-[#D4AF37]">
              复制
            </Button>
          </div>
        </div>
      </div>

      {/* 收藏区域 */}
      <div className="bg-[#FFFDFB] px-3 py-4">
        <h3 className="text-[#747472] text-sm mb-3">您的收藏</h3>
        <div className="grid grid-cols-2 gap-3">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="bg-white rounded-lg p-2 shadow-sm relative">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="w-full aspect-square object-cover rounded-md"
              />
              <div 
                className="absolute inset-0 bg-black/0 rounded-md"
                onContextMenu={(e) => {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const deleteButton = target.querySelector('.delete-button') as HTMLButtonElement;
                  if (deleteButton) {
                    deleteButton.style.display = deleteButton.style.display === 'none' ? 'block' : 'none';
                  }
                }}
              >
                <button 
                  className="delete-button hidden absolute top-1 right-1 bg-red-500 text-white px-2 py-0.5 rounded text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Delete artwork:', artwork.id);
                  }}
                >
                  删除
                </button>
              </div>
              <div className="mt-1.5">
                <p className="text-black text-xs">中国十大名画</p>
                <p className="text-gray-600 text-xs">{artwork.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
