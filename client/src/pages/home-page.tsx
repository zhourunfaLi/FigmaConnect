
import { useMemo } from "react";
import WorksList from "@/components/works-list";

const mockArtworks = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  title: index % 4 === 0 ? `城市风光 ${index + 1}` : `艺术作品 ${index + 1}`,
  description: index % 4 === 0 ? "城市建筑与人文景观" : "现代艺术创作",
  imageUrl: index % 4 === 0 
    ? `/src/assets/design/img/city-${String((index % 7) + 1).padStart(2, '0')}.jpg`
    : `/src/assets/design/img/art-${String((index % 10) + 1).padStart(2, '0')}.jpg`,
  likes: Math.floor(Math.random() * 2000),
  isPremium: Math.random() > 0.7,
  themeId: index % 4 === 0 ? "city" : "art",
  ...(index % 4 === 0 && { cityId: ["venice", "paris", "rome", "newyork", "tokyo"][index % 5] })
}));

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#EEEAE2]">
      <WorksList artworks={mockArtworks} />
    </div>
  );
}
