"use client";

import React from 'react';
import { FiFilter } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2" dir="rtl">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
          selectedCategory === null
            ? 'bg-white text-black font-medium'
            : 'bg-zinc-800 text-white hover:bg-zinc-700'
        }`}
      >
        <FiFilter className="w-3.5 h-3.5 ml-1" />
        همه
      </button>
      
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
            selectedCategory === category.id
              ? 'bg-white text-black font-medium'
              : 'bg-zinc-800 text-white hover:bg-zinc-700'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
} 