import React from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

type Category = {
  id: number;
  name: string;
  description?: string;
  displayOrder?: number;
};

export function CategoryNav({ 
  categories,
  activeCategory,
  onCategoryChange 
}: { 
  categories: Category[];
  activeCategory?: number;
  onCategoryChange: (id: number) => void;
}) {
  return (
    <div className="sticky top-0 bg-[#EEEAE2] z-10 flex justify-center">
      <ScrollArea className="w-full max-w-screen-md">
        <div className="flex items-center justify-start gap-1.5 px-4 py-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`text-sm sm:text-base font-normal transition-colors px-4 py-1.5 whitespace-nowrap rounded-full
                ${activeCategory === category.id ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Category = {
  id: string;
  name: string;
  color: string;
  layout: string;
};

type CategoryNavProps = {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
};

export function CategoryNav({ categories, selected, onSelect }: CategoryNavProps) {
  return (
    <div className="sticky top-0 bg-[#EEEAE2] z-10 flex justify-center">
      <ScrollArea className="w-full max-w-screen-md">
        <div className="flex items-center justify-start gap-1.5 px-4 py-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              style={{ color: category.color }}
              className={`text-sm sm:text-base font-normal transition-colors px-4 py-1.5 whitespace-nowrap rounded-full ${
                selected === category.id ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}