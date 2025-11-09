"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsPlusCircleFill } from 'react-icons/bs';

// داده‌های نمونه برای استوری‌ها
const stories = [
  {
    id: '1',
    title: 'فرش دستباف اصفهان',
    image: 'https://source.unsplash.com/random/300x300?persian-carpet',
    store: {
      id: '1',
      name: 'فرش مشهد',
      logo: 'https://source.unsplash.com/random/80x80?logo',
      isVIP: true,
    },
  },
  {
    id: '2',
    title: 'طرح‌های مینیاتور',
    image: 'https://source.unsplash.com/random/300x300?persian-miniature',
    store: {
      id: '2',
      name: 'گالری هنر',
      logo: 'https://source.unsplash.com/random/80x80?art-logo',
      isVIP: false,
    },
  },
  {
    id: '3',
    title: 'طرح‌های سنتی',
    image: 'https://source.unsplash.com/random/300x300?islamic-art',
    store: {
      id: '3',
      name: 'صنایع دستی',
      logo: 'https://source.unsplash.com/random/80x80?craft-logo',
      isVIP: true,
    },
  },
  {
    id: '4',
    title: 'دکوراسیون داخلی',
    image: 'https://source.unsplash.com/random/300x300?persian-interior',
    store: {
      id: '4',
      name: 'دکوراسیون مدرن',
      logo: 'https://source.unsplash.com/random/80x80?decor-logo',
      isVIP: false,
    },
  },
  {
    id: '5',
    title: 'طرح‌های هندسی',
    image: 'https://source.unsplash.com/random/300x300?geometric-pattern',
    store: {
      id: '5',
      name: 'هنر اسلامی',
      logo: 'https://source.unsplash.com/random/80x80?islamic-logo',
      isVIP: true,
    },
  },
  {
    id: '6',
    title: 'سفالگری',
    image: 'https://source.unsplash.com/random/300x300?pottery',
    store: {
      id: '6',
      name: 'هنر دست',
      logo: 'https://source.unsplash.com/random/80x80?pottery-logo',
      isVIP: false,
    },
  },
  {
    id: '7',
    title: 'جواهرات سنتی',
    image: 'https://source.unsplash.com/random/300x300?jewelry',
    store: {
      id: '7',
      name: 'طلا و جواهر',
      logo: 'https://source.unsplash.com/random/80x80?jewelry-logo',
      isVIP: true,
    },
  },
];

export default function StorySection() {
  return (
    <div className="py-2" dir="rtl">
      <div className="flex overflow-x-auto scrollbar-hide gap-3 px-3">
        {/* افزودن استوری */}
        <div className="flex-shrink-0 w-18">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 mb-1.5 rounded-full border border-dashed border-zinc-700 flex items-center justify-center bg-zinc-900">
              <BsPlusCircleFill className="text-blue-500 w-7 h-7" />
            </div>
            <span className="text-gray-300 text-xs">جدید</span>
          </div>
        </div>
        
        {/* آیتم‌های استوری */}
        {stories.map(story => (
          <Link 
            href={`/stories/${story.id}`} 
            key={story.id}
            className="flex-shrink-0 w-18"
          >
            <div className="flex flex-col items-center">
              <div 
                className={`relative w-16 h-16 mb-1.5 rounded-full p-0.5 bg-gradient-to-br ${
                  story.store.isVIP 
                    ? 'from-yellow-500 via-orange-500 to-pink-500' 
                    : 'from-blue-500 via-purple-500 to-pink-500'
                }`}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-500 opacity-60 blur-sm"></div>
                <div className="relative w-full h-full bg-black rounded-full p-[2px] z-10">
                  <div className="relative w-full h-full rounded-full overflow-hidden border border-zinc-800">
                    <Image 
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <span className="text-gray-300 text-xs text-center truncate w-full">{story.store.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 