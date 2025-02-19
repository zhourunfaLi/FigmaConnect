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
      {/* User Card */}
      <div className="relative bg-gradient-to-b from-[#FFFDFB] to-[#F8F6F0] pb-6 pt-16 px-3 rounded-t-[20px] mt-12">
        {/* User Info */}
        <div className="flex justify-between items-start px-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10 border-2 border-[#F4E7D4] shadow-sm">
              <img src="/src/assets/design/avatar/001.png" alt="avatar" className="w-full h-full object-cover" />
            </Avatar>
            <h2 className="text-[#1A1A1A] text-sm font-medium">{user.username || "达芬奇的幻想"}</h2>
          </div>
          <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white text-xs px-3 py-1 h-auto rounded-full shadow-sm hover:from-[#E5BE3D] hover:to-[#D4AF37] transition-all duration-300">
            SVIP充值
          </Button>
        </div>

        <div className="flex gap-1.5 items-center bg-gradient-to-r from-[#F4E7D4] to-[#E5D4BC] px-3 py-1 rounded-full shadow-sm mt-4">
          <span className="text-[#8B7355] text-xs font-medium">艺术天赋</span>
          <span className="text-[#D4AF37] font-bold text-sm">885</span>
        </div>

        {/* Invite Card */}
        <div className="mt-6 bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] p-4 rounded-[16px] border border-[#333333]">
          <p className="text-[#8B7355] text-xs text-center mb-4 font-medium">
            您的朋友凭此邀请码，订阅可以优惠5元 您也可以获得1周会员延期（可累加）
          </p>
          <div className="flex items-center gap-2 justify-center bg-gradient-to-r from-[#D4AF37]/5 to-[#C5A028]/5 p-3 rounded-lg border border-[#D4AF37]/30">
            <span className="text-[#8B7355] text-xs font-medium">邀请码</span>
            <div className="bg-gradient-to-r from-[#F4E7D4] to-[#E5D4BC] px-3 py-1.5 rounded-md shadow-sm">
              <span className="text-[#8B7355] text-xs font-bold tracking-wider">GHJO#$675sg</span>
            </div>
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5BE3D] hover:to-[#D4AF37] text-white text-xs font-medium px-3 py-1.5 h-auto rounded-md transition-all duration-300 shadow-sm">
              复制
            </Button>
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <div className="bg-[#FFFDFB] px-4 py-6">
        <div className="flex items-center mb-4">
          <h3 className="text-[#747472] text-sm">您的收藏</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="bg-white rounded-lg p-2 shadow-sm relative group">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="w-full h-[160px] rounded-md object-cover"
              />
              <div 
                className="absolute inset-0 bg-black/0 transition-all rounded-md"
                onContextMenu={(e) => {
                  e.preventDefault();
                  const deleteButton = e.currentTarget.querySelector('.delete-button') as HTMLButtonElement;
                  if (deleteButton) {
                    deleteButton.classList.toggle('opacity-0');
                  }
                }}
              >
                <button 
                  className="delete-button absolute top-2 right-2 opacity-0 transition-all bg-red-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => console.log('Delete artwork:', artwork.id)}
                >
                  删除
                </button>
              </div>
              <div className="mt-2">
                <p className="text-black text-sm">中国十大名画</p>
                <p className="text-gray-600 text-xs">{artwork.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}