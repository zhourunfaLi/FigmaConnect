
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorksList from "@/components/works-list";
import { useState, useMemo } from "react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const artworks = [
    // 艺术作品 1-20
    {
      id: 1,
      title: "星空梦境",
      description: "梵高风格的星空诠释",
      imageUrl: "/src/assets/design/img/art-01.jpg",
      likes: 1200,
      isPremium: true,
      themeId: "art"
    },
    {
      id: 2,
      title: "山水意境",
      description: "中国传统山水画的现代演绎",
      imageUrl: "/src/assets/design/img/art-02.jpg",
      likes: 980,
      isPremium: false,
      themeId: "art"
    },
    {
      id: 3,
      title: "抽象几何",
      description: "现代主义抽象艺术",
      imageUrl: "/src/assets/design/img/art-03.jpg",
      likes: 850,
      isPremium: true,
      themeId: "art"
    },
    {
      id: 4,
      title: "色彩交响",
      description: "强烈的色彩碰撞",
      imageUrl: "/src/assets/design/img/art-04.jpg",
      likes: 720,
      isPremium: false,
      themeId: "art"
    },
    {
      id: 5,
      title: "光影魔术",
      description: "光与影的艺术对话",
      imageUrl: "/src/assets/design/img/art-05.jpg",
      likes: 990,
      isPremium: true,
      themeId: "art"
    },
    {
      id: 6,
      title: "自然之声",
      description: "大自然的声音艺术",
      imageUrl: "/src/assets/design/img/art-06.jpg",
      likes: 760,
      isPremium: false,
      themeId: "art"
    },
    {
      id: 7,
      title: "城市印象",
      description: "现代都市的艺术解读",
      imageUrl: "/src/assets/design/img/art-07.jpg",
      likes: 880,
      isPremium: true,
      themeId: "art"
    },
    {
      id: 8,
      title: "情感流动",
      description: "抽象表现主义作品",
      imageUrl: "/src/assets/design/img/art-08.jpg",
      likes: 800,
      isPremium: false,
      themeId: "art"
    },
    {
      id: 9,
      title: "时空穿越",
      description: "超现实主义创作",
      imageUrl: "/src/assets/design/img/art-09.jpg",
      likes: 920,
      isPremium: true,
      themeId: "art"
    },
    {
      id: 10,
      title: "自然之舞",
      description: "生命与自然的韵律",
      imageUrl: "/src/assets/design/img/art-10.jpg",
      likes: 850,
      isPremium: false,
      themeId: "art"
    },
    {
      id: 11,
      title: "现代艺术1",
      description: "创新艺术表达",
      imageUrl: "/src/assets/design/img/art-11.jpg",
      likes: 780,
      isPremium: true,
      themeId: "art"
    },
    {
      id: 12,
      title: "现代艺术2",
      description: "艺术新视角",
      imageUrl: "/src/assets/design/img/art-12.jpg",
      likes: 820,
      isPremium: false,
      themeId: "art"
    },
    {
      id: 13,
      title: "现代艺术3",
      description: "当代艺术探索",
      imageUrl: "/src/assets/design/img/art-13.jpg",
      likes: 900,
      isPremium: true,
      themeId: "art"
    },
    {
      id: 14,
      title: "现代艺术4",
      description: "艺术新思维",
      imageUrl: "/src/assets/design/img/art-14.jpg",
      likes: 750,
      isPremium: false,
      themeId: "art"
    },
    {
      id: 15,
      title: "现代艺术5",
      description: "创意艺术展现",
      imageUrl: "/src/assets/design/img/art-15.jpg",
      likes: 870,
      isPremium: true,
      themeId: "art"
    },
    {
      id: 16,
      title: "现代艺术6",
      description: "艺术新境界",
      imageUrl: "/src/assets/design/img/art-16.jpg",
      likes: 830,
      isPremium: false,
      themeId: "art"
    },
    {
      id: 17,
      title: "现代艺术7",
      description: "艺术新维度",
      imageUrl: "/src/assets/design/img/art-17.jpg",
      likes: 910,
      isPremium: true,
      themeId: "art"
    },
    {
      id: 18,
      title: "现代艺术8",
      description: "艺术新格局",
      imageUrl: "/src/assets/design/img/art-18.jpg",
      likes: 840,
      isPremium: false,
      themeId: "art"
    },
    {
      id: 19,
      title: "现代艺术9",
      description: "艺术新视界",
      imageUrl: "/src/assets/design/img/art-19.jpg",
      likes: 890,
      isPremium: true,
      themeId: "art"
    },
    {
      id: 20,
      title: "现代艺术10",
      description: "艺术新境遇",
      imageUrl: "/src/assets/design/img/art-20.jpg",
      likes: 860,
      isPremium: false,
      themeId: "art"
    },
    // 城市作品 21-30
    {
      id: 21,
      title: "威尼斯圣马可广场",
      description: "威尼斯最著名的地标",
      imageUrl: "/src/assets/design/img/city-01.jpg",
      likes: 1000,
      isPremium: false,
      themeId: "city",
      cityId: "venice"
    },
    {
      id: 22,
      title: "巴黎铁塔",
      description: "浪漫之都的象征",
      imageUrl: "/src/assets/design/img/city-02.jpg",
      likes: 1500,
      isPremium: false,
      themeId: "city",
      cityId: "paris"
    },
    {
      id: 23,
      title: "东京天际线",
      description: "现代都市的缩影",
      imageUrl: "/src/assets/design/img/city-03.jpg",
      likes: 1300,
      isPremium: true,
      themeId: "city",
      cityId: "tokyo"
    },
    {
      id: 24,
      title: "伦敦眼",
      description: "泰晤士河畔的明珠",
      imageUrl: "/src/assets/design/img/city-04.jpg",
      likes: 1100,
      isPremium: false,
      themeId: "city",
      cityId: "london"
    },
    {
      id: 25,
      title: "纽约中央公园",
      description: "城市中的绿洲",
      imageUrl: "/src/assets/design/img/city-05.jpg",
      likes: 1400,
      isPremium: true,
      themeId: "city",
      cityId: "newyork"
    },
    {
      id: 26,
      title: "罗马斗兽场",
      description: "永恒之城的见证",
      imageUrl: "/src/assets/design/img/city-06.jpg",
      likes: 1250,
      isPremium: false,
      themeId: "city",
      cityId: "rome"
    },
    {
      id: 27,
      title: "悉尼歌剧院",
      description: "南半球的艺术殿堂",
      imageUrl: "/src/assets/design/img/city-07.jpg",
      likes: 1150,
      isPremium: true,
      themeId: "city",
      cityId: "sydney"
    },
    {
      id: 28,
      title: "上海外滩",
      description: "东方明珠的风采",
      imageUrl: "/src/assets/design/img/city-08.jpg",
      likes: 1350,
      isPremium: false,
      themeId: "city",
      cityId: "shanghai"
    },
    {
      id: 29,
      title: "莫斯科红场",
      description: "俄罗斯的心脏",
      imageUrl: "/src/assets/design/img/city-09.jpg",
      likes: 1100,
      isPremium: true,
      themeId: "city",
      cityId: "paris"
    },
    {
      id: 30,
      title: "布达佩斯",
      description: "多瑙河上的明珠",
      imageUrl: "/src/assets/design/img/city-10.jpg",
      likes: 980,
      isPremium: false,
      themeId: "city",
      cityId: "budapest"
    },
    {
      id: 26,
      title: "长城",
      description: "人类文明的壮举",
      imageUrl: "/src/assets/design/img/city-06.jpg",
      likes: 2000,
      isPremium: false,
      themeId: "city",
      cityId: "beijing"
    },
    {
      id: 27,
      title: "圣托里尼",
      description: "爱琴海的明珠",
      imageUrl: "/src/assets/design/img/city-07.jpg",
      likes: 1600,
      isPremium: true,
      themeId: "city",
      cityId: "santorini"
    },
    {
      id: 28,
      title: "上海外滩",
      description: "东方明珠的风采",
      imageUrl: "/src/assets/design/img/city-08.jpg",
      likes: 1350,
      isPremium: false,
      themeId: "city",
      cityId: "shanghai"
    },
    {
      id: 29,
      title: "莫斯科红场",
      description: "俄罗斯的心脏",
      imageUrl: "/src/assets/design/img/city-09.jpg",
      likes: 1050,
      isPremium: true,
      themeId: "city",
      cityId: "moscow"
    },
    {
      id: 30,
      title: "迪拜塔",
      description: "沙漠中的奇迹",
      imageUrl: "/src/assets/design/img/city-10.jpg",
      likes: 1450,
      isPremium: false,
      themeId: "city",
      cityId: "dubai"
    }
  ];

  const filteredArtworks = useMemo(() => {
    let filtered = [...artworks];
    
    // 根据类别筛选
    switch (activeCategory) {
      case "special":
        filtered = filtered.filter(art => art.themeId);
        break;
      case "member":
        filtered = filtered.filter(art => art.isPremium);
        break;
      case "city":
        filtered = filtered.filter(art => art.themeId === "city");
        break;
      case "art":
        filtered = filtered.filter(art => art.themeId === "art");
        break;
    }

    // 然后排序
    return filtered.sort((a, b) => {
      if (activeCategory === "latest") return b.id - a.id;
      if (activeCategory === "hottest") return (b.likes || 0) - (a.likes || 0);
      return a.id - b.id;
    });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#EEEAE2]">
      {/* Category Navigation */}
      <div className="sticky top-0 bg-[#EEEAE2] z-10 flex justify-center">
        <ScrollArea className="w-full max-w-screen-xl">
          <div className="flex justify-center py-4">
            <Tabs
              defaultValue="all"
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full max-w-xl mx-4"
            >
              <TabsList className="w-full">
                <TabsTrigger
                  value="all"
                  className={cn(
                    "flex-1",
                    activeCategory === "all" && "bg-black text-white"
                  )}
                >
                  全部
                </TabsTrigger>
                <TabsTrigger
                  value="special"
                  className={cn(
                    "flex-1",
                    activeCategory === "special" && "bg-black text-white"
                  )}
                >
                  特辑
                </TabsTrigger>
                <TabsTrigger
                  value="member"
                  className={cn(
                    "flex-1",
                    activeCategory === "member" && "bg-black text-white"
                  )}
                >
                  会员
                </TabsTrigger>
                <TabsTrigger
                  value="city"
                  className={cn(
                    "flex-1",
                    activeCategory === "city" && "bg-black text-white"
                  )}
                >
                  城市
                </TabsTrigger>
                <TabsTrigger
                  value="art"
                  className={cn(
                    "flex-1",
                    activeCategory === "art" && "bg-black text-white"
                  )}
                >
                  艺术
                </TabsTrigger>
                <TabsTrigger
                  value="latest"
                  className={cn(
                    "flex-1",
                    activeCategory === "latest" && "bg-black text-white"
                  )}
                >
                  最新
                </TabsTrigger>
                <TabsTrigger
                  value="hottest"
                  className={cn(
                    "flex-1",
                    activeCategory === "hottest" && "bg-black text-white"
                  )}
                >
                  最热
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      {/* Works List */}
      <div className="max-w-screen-2xl mx-auto">
        <WorksList artworks={filteredArtworks} />
      </div>
    </div>
  );
}
