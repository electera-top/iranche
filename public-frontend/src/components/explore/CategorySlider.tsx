"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Category {
  id: string;
  name: string;
}

interface CategorySliderProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategorySlider({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategorySliderProps) {
  return (
    <div className="w-full">
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        className="category-swiper"
        freeMode={true}
        watchSlidesProgress={true}
        breakpoints={{
          320: {
            slidesPerView: "auto",
            spaceBetween: 8,
          },
          480: {
            slidesPerView: "auto",
            spaceBetween: 10,
          },
          640: {
            slidesPerView: "auto",
            spaceBetween: 12,
          },
          768: {
            slidesPerView: "auto",
            spaceBetween: 14,
          },
          1024: {
            slidesPerView: "auto",
            spaceBetween: 16,
          },
        }}
      >
        {/* دکمه همه */}
        <SwiperSlide className="!w-auto">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-white text-black shadow-lg'
                : 'bg-secondary text-white hover:bg-zinc-700'
            }`}
          >
            همه
          </button>
        </SwiperSlide>

        {/* دسته‌بندی‌ها */}
        {categories.map((category) => (
          <SwiperSlide key={category.id} className="!w-auto">
            <button
              onClick={() => onSelectCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-secondary text-white hover:bg-zinc-700'
              }`}
            >
              {category.name}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

    
    </div>
  );
} 