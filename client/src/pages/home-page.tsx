import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { CategoryNav } from '@/components/category-nav';
import { WorksList } from '../components/works-list';

type LayoutType = 'waterfall' | 'grid';

type Category = {
  id: string;
  name: string;
  color: string;
  layout: LayoutType;
};

const CATEGORIES: Category[] = [
  { id: "latest", name: "最新", color: "#333333", layout: "waterfall" },
  { id: "hottest", name: "最热", color: "#333333", layout: "waterfall" },
  { id: "member", name: "会员", color: "#EB9800", layout: "waterfall" },
  { id: "special", name: "专题", color: "#333333", layout: "grid" },
  { id: "city", name: "城市", color: "#333333", layout: "grid" }
];

export default function HomePage() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("latest");

  useEffect(() => {
    const category = location.split("/")[1] || "latest";
    setSelectedCategory(category);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#EEEAE2]">
      <CategoryNav
        categories={CATEGORIES}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <WorksList
        category={selectedCategory}
        layout={CATEGORIES.find(c => c.id === selectedCategory)?.layout || "waterfall"}
      />
    </div>
  );
}