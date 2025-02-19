
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function UserPage() {
  const { user, logout } = useAuth();

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
      <div className="relative bg-[#FFFDFB] pb-12 pt-20 px-4 rounded-t-[20px] mt-12">
        <Avatar 
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 border-[6px] border-white"
        >
          <img src="/src/assets/design/avatar/001.png" alt="avatar" className="w-full h-full object-cover" />
        </Avatar>

        <div className="text-center">
          <div className="flex justify-center items-center gap-4 mt-4">
            <h2 className="text-black text-base font-normal">{user.username || "达芬奇的幻想"}</h2>
            <div className="flex gap-2 text-[#747472] text-sm">
              <span>艺术天赋</span>
              <span>885</span>
            </div>
          </div>
        </div>

        {/* Invite Card */}
        <div className="mt-6 bg-gradient-to-br from-[#E6AF22E0] to-[#7A6119] p-6 rounded-[20px]">
          <p className="text-white text-xs text-center mb-8">
            您的朋友凭此邀请码，订阅可以优惠5元 您也可以获得1周会员延期（可累加）
          </p>
          <div className="flex items-center gap-4 justify-center">
            <span className="text-[#E9E9E9] text-xs">邀请码</span>
            <div className="bg-[#D9D9D9] bg-opacity-60 px-4 py-1 rounded">
              <span className="text-black text-xs">GHJO#$675sg</span>
            </div>
            <Button className="bg-[#147ADA] text-xs px-3 py-1 h-auto rounded">
              复制
            </Button>
          </div>
        </div>

        {/* SVIP Button */}
        <Button className="absolute right-4 top-4 bg-[#147ADA] text-xs px-3 py-1 h-[27px] rounded">
          SVIP充值
        </Button>
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-md">
                <button 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all bg-red-500 text-white px-2 py-1 rounded text-xs"
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

      {/* Footer */}
      <div className="fixed bottom-0 w-full h-[73px] bg-white border-t border-black/20">
        <div className="flex justify-around items-center h-full px-16">
          <button className="p-2">
            <svg width="37" height="37" viewBox="0 0 37 37" fill="none">
              <path d="M7.70837 19.6711C7.70837 17.5779 7.70837 16.5313 8.1315 15.6113C8.55463 14.6913 9.34927 14.0102 10.9386 12.648L12.4802 11.3265C15.3528 8.8643 16.7891 7.63318 18.5 7.63318C20.2109 7.63318 21.6472 8.8643 24.5199 11.3265L26.0615 12.648C27.6508 14.0102 28.4455 14.6913 28.8686 15.6113C29.2917 16.5313 29.2917 17.5779 29.2917 19.6711V26.2084C29.2917 29.1154 29.2917 30.5689 28.3886 31.4719C27.4855 32.375 26.032 32.375 23.125 32.375H13.875C10.968 32.375 9.51455 32.375 8.61146 31.4719C7.70837 30.5689 7.70837 29.1154 7.70837 26.2084V19.6711Z" stroke="#1C1C1C" strokeWidth="2"/>
              <path d="M22.3542 32.375V24.125C22.3542 23.5727 21.9065 23.125 21.3542 23.125H15.6459C15.0936 23.125 14.6459 23.5727 14.6459 24.125V32.375" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
