"use client";

import React, { useState } from 'react';
import Stories from 'react-insta-stories';
import { BiX } from 'react-icons/bi';

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
  duration?: number; // مدت زمان نمایش استوری به ثانیه
}

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
}

// تعریف تایپ برای استوری‌های react-insta-stories
interface InstaStory {
  url: string;
  duration: number;
  header?: {
    heading: string;
    subheading: string;
    profileImage: string;
  };
  seeMore?: (props: { close: () => void }) => React.ReactNode;
}

export default function StoryViewer({ stories, initialStoryIndex, onClose }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  
  // تبدیل استوری‌های ما به فرمت مورد نیاز react-insta-stories
  const formattedStories = stories.map(story => ({
    url: story.image,
    duration: story.duration || 5,
    header: {
      heading: story.store.name,
      subheading: story.title,
      profileImage: story.store.logo,
    },
    seeMore: story.productLink ? ({ close }) => {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-black/80 p-4">
          <div className="flex flex-col items-center justify-center max-w-md w-full bg-zinc-900 rounded-xl p-6 shadow-lg">
            <h3 className="text-white text-xl font-bold mb-4">{story.productTitle || 'مشاهده محصول'}</h3>
            <p className="text-gray-300 text-center mb-6">برای مشاهده جزئیات محصول و خرید، روی دکمه زیر کلیک کنید.</p>
            
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={() => {
                  close();
                  window.location.href = story.productLink!;
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                مشاهده محصول
              </button>
              
              <button 
                onClick={close}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                بازگشت به استوری
              </button>
            </div>
          </div>
        </div>
      );
    } : undefined,
  }));

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col" dir="rtl">
      {/* دکمه بستن */}
      <div className="absolute top-0 right-0 p-4 z-[9999]">
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <BiX className="w-6 h-6" />
        </button>
      </div>
      
      {/* استوری‌ها با استفاده از کتابخانه react-insta-stories */}
      <div className="w-full h-full">
        <Stories
          stories={formattedStories}
          defaultInterval={5000}
          width="100%"
          height="100%"
          currentIndex={currentStoryIndex}
          onStoryEnd={(index) => {
            if (index < stories.length - 1) {
              setCurrentStoryIndex(index + 1);
            } else {
              onClose();
            }
          }}
          onAllStoriesEnd={onClose}
        />
      </div>

      {/* استایل‌های سفارشی برای react-insta-stories */}
      <style jsx global>{`
        .react-insta-stories {
          background-color: black !important;
        }
        .react-insta-stories__header {
          background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%) !important;
          padding: 1rem !important;
        }
        .react-insta-stories__header h1 {
          color: white !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
        }
        .react-insta-stories__header h2 {
          color: rgba(255,255,255,0.8) !important;
          font-size: 0.8rem !important;
        }
        .react-insta-stories__progress {
          background-color: rgba(255,255,255,0.3) !important;
          height: 2px !important;
        }
        .react-insta-stories__progress__active {
          background-color: white !important;
        }
        .react-insta-stories__see-more {
          background-color: rgba(255,255,255,0.2) !important;
          backdrop-filter: blur(8px) !important;
          border-radius: 9999px !important;
          color: white !important;
          font-size: 0.9rem !important;
          padding: 0.5rem 1rem !important;
          transition: background-color 0.2s !important;
          cursor: pointer !important;
        }
        .react-insta-stories__see-more:hover {
          background-color: rgba(255,255,255,0.3) !important;
        }
        .react-insta-stories__see-more::before {
          content: "مشاهده بیشتر" !important;
        }
      `}</style>
    </div>
  );
} 