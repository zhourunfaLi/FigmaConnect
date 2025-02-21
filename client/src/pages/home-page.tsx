import { useState } from "react";
import mockThemes from "../data/mock";
import mockArtworks from "../data/mock"; // Assuming this file exists and exports mockArtworks and mockThemes

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("latest");

  const renderContent = () => {
    switch (activeTab) {
      case "latest":
        return mockArtworks.sort((a, b) => b.id - a.id);
      case "hottest":
        return mockArtworks.sort((a, b) => b.likes - a.likes);
      case "earliest":
        return mockArtworks.sort((a, b) => a.id - b.id);
      case "theme":
        return (
          <div className="space-y-8">
            {mockThemes.map((theme) => (
              <div key={theme.id}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold">{theme.name}</h2>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <WorksList artworks={theme.artworks} /> {/* Added WorksList component */}
              </div>
            ))}
          </div>
        );
      case "city":
        return (
          <div className="bg-[#EEEAE2] min-h-screen">
            <div data-layer="works list section" className="pt-[148px] px-2 flex flex-col gap-[21px]">
              {mockThemes.map((theme, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <img 
                    className="w-[374px] h-[198px] rounded-[5px] object-cover" 
                    src={theme.imageUrl || "https://placehold.co/374x198"} 
                    alt={theme.name}
                  />
                  <div className="w-[360px] flex justify-between items-center">
                    <div className="text-[#111111] text-[14px] font-['MS Gothic'] leading-[22px]">
                      {theme.name}
                    </div>
                    <div className="flex gap-[2px]">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-[3px] h-[3px] bg-[#111111] rounded-full"/>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "member":
        return mockArtworks.filter(art => art.isPremium);
      default:
        return mockArtworks;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 bg-white z-50">
        <div className="h-[90px] bg-gray-100"></div>
        <div className="px-2 py-4">
          <div className="flex justify-between items-center text-[18px] leading-[22px] tracking-[3px]">
            <button 
              onClick={() => setActiveTab("latest")}
              className={activeTab === "latest" ? "text-black" : "text-[#6D6D6D]"}
            >
              最新
            </button>
            <button
              onClick={() => setActiveTab("hottest")}
              className={activeTab === "hottest" ? "text-black" : "text-[#6D6D6D]"}
            >
              最热
            </button>
            <button
              onClick={() => setActiveTab("earliest")}
              className={activeTab === "earliest" ? "text-black" : "text-[#6D6D6D]"}
            >
              最早
            </button>
            <button
              onClick={() => setActiveTab("theme")}
              className={activeTab === "theme" ? "text-black" : "text-[#6D6D6D]"}
            >
              专题
            </button>
            <button
              onClick={() => setActiveTab("member")}
              className={activeTab === "member" ? "text-[#EB9800]" : "text-[#6D6D6D]"}
            >
              会员
            </button>
            <button
              onClick={() => setActiveTab("city")}
              className={activeTab === "city" ? "text-black" : "text-[#6D6D6D]"}
            >
              城市
            </button>
          </div>
        </div>
      </header>
      <main className="pt-[148px] px-2">{renderContent()}</main>
    </div>
  );
}