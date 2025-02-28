
import { useLocation } from "wouter";

// 城市数据
const CITIES = [
  {
    id: 1,
    name: "巴黎",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "艺术与浪漫的代表"
  },
  {
    id: 2,
    name: "纽约",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "现代艺术的中心"
  },
  {
    id: 3,
    name: "佛罗伦萨",
    image: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "文艺复兴的故乡"
  },
  {
    id: 4,
    name: "京都",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "传统与现代的完美融合"
  },
  {
    id: 5,
    name: "威尼斯",
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "水上艺术之城"
  },
  {
    id: 6,
    name: "阿姆斯特丹",
    image: "https://images.unsplash.com/photo-1605101100278-5d1deb2b6498?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "运河与现代艺术"
  }
];

function CityPage() {
  const [, navigate] = useLocation();
  
  const handleCityClick = (cityId: number) => {
    console.log("城市点击:", cityId);
    navigate(`/artwork/${cityId}`);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">探索世界城市艺术</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CITIES.map((city) => (
          <div 
            key={city.id}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg"
            onClick={() => handleCityClick(city.id)}
          >
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={city.image} 
                alt={city.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-bold">{city.name}</h3>
                <p className="text-white/80 text-sm">{city.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CityPage;
