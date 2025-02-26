import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { CategoryNav } from '@/components/category-nav';

const categories = [
  { id: "latest", name: "最新", color: "#333333", layout: "grid" },
  { id: "museum", name: "博物馆", color: "#333333", layout: "grid" },
  { id: "special", name: "专题", color: "#333333", layout: "grid" },
  { id: "city", name: "城市", color: "#333333", layout: "grid" }
];

export default function HomePage() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("latest");

  useEffect(() => {
    // 在这里可以根据选中的分类加载相应的数据
    console.log("Selected category:", selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen">
      <CategoryNav 
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
    </div>
  );
}nSelect={setSelectedCategory}
      />
    </div>
  );
}