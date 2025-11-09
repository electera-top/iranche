"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { BiPlus, BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import StoryViewer from './StoryViewer';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Store {
  id: string;
  name: string;
  logo: string;
  isVIP?: boolean;
}

interface Story {
  id: string;
  title: string;
  image: string;
  store: Store;
  productLink?: string;
  productTitle?: string;
  duration?: number;
}

interface StorySliderProps {
  stories: Story[];
}

export default function StorySlider({ stories }: StorySliderProps) {
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setShowStoryViewer(true);
  };

  return (
    <>
      <div className="relative">
        <Swiper
          spaceBetween={12}
          slidesPerView="auto"
          freeMode={true}
          watchSlidesProgress={true}
         
          navigation={{
            prevEl: '.story-prev-button',
            nextEl: '.story-next-button',
          }}
          breakpoints={{
            320: {
              spaceBetween: 12,
            },
            480: {
              spaceBetween: 14,
            },
            640: {
              spaceBetween: 16,
            },
            768: {
              spaceBetween: 18,
            },
            1024: {
              spaceBetween: 20,
            },
          }}
          className="story-swiper"
        >
          {/* دکمه افزودن استوری */}
          <SwiperSlide className="!w-auto">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-700 flex items-center justify-center bg-zinc-800">
                <BiPlus className="w-8 h-8 text-zinc-400" />
              </div>
              <span className="text-zinc-400 text-xs mt-1">افزودن</span>
            </div>
          </SwiperSlide>

          {/* استوری‌ها */}
          {stories.map((story, index) => (
            <SwiperSlide key={story.id} className="!w-auto">
              <div 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleStoryClick(index)}
              >
                <div className={`relative w-20 h-20 rounded-full overflow-hidden border-2 ${
                  story.store.isVIP 
                    ? 'p-0.5 bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-500' 
                    : 'border-zinc-700'
                }`}>
                  <div className={`relative w-full h-full rounded-full overflow-hidden ${story.store.isVIP ? 'border border-black' : ''}`}>
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <span className="text-white text-xs mt-1 truncate max-w-[80px] text-center">{story.title}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* دکمه‌های ناوبری */}
        <button className="story-prev-button absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center">
          <BiChevronRight className="w-5 h-5" />
        </button>
        <button className="story-next-button absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center">
          <BiChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* نمایش استوری‌ها */}
      {showStoryViewer && (
        <StoryViewer 
          stories={stories} 
          initialStoryIndex={selectedStoryIndex} 
          onClose={() => setShowStoryViewer(false)} 
        />
      )}

      <style jsx global>{`
        .story-swiper {
          padding: 0.5rem 0;
        }
        .story-swiper .swiper-slide {
          width: auto !important;
        }
        .story-prev-button,
        .story-next-button {
          opacity: 0;
          transition: opacity 0.3s;
        }
        .story-swiper:hover .story-prev-button,
        .story-swiper:hover .story-next-button {
          opacity: 1;
        }
        .swiper-pagination {
          position: relative;
          margin-top: 0.5rem;
        }
        .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          opacity: 1;
          background: #71717a;
        }
        .swiper-pagination-bullet-active {
          background: white;
        }
      `}</style>
    </>
  );
} 