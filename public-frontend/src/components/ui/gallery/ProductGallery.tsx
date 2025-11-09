'use client';

import React, { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import { FiImage, FiUsers, FiVideo, FiStar, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import 'react-image-gallery/styles/css/image-gallery.css';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface ProductGalleryProps {
  productMedia: MediaItem[];
  userReviews: Array<{
    id: number;
    user: string;
    image: string;
    rating: number;
    date: string;
    comment: string;
    pros: string[];
    cons: string[];
  }>;
  isOpen: boolean;
  onClose: () => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ productMedia, userReviews, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'product' | 'user'>('product');

  if (!isOpen) return null;

  const galleryItems = (activeTab === 'product' ? productMedia : userReviews.map(review => ({ type: 'image' as const, url: review.image }))).map((item: MediaItem) => {
    if (item.type === 'video') {
      return {
        original: item.url,
        thumbnail: item.thumbnail || item.url,
        renderItem: () => (
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-contain"
              controls
              src={item.url}
            />
          </div>
        ),
        renderThumbInner: () => (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <FiVideo className="text-white text-2xl" />
            </div>
            <img
              src={item.thumbnail || item.url}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
        )
      };
    }
    
    if (activeTab === 'user') {
      const review = userReviews.find(r => r.image === item.url);
      if (review) {
        return {
          original: item.url,
          thumbnail: item.url,
          renderItem: () => (
            <div className="relative w-full h-full flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 h-[60vh] md:h-full">
                <img
                  src={item.url}
                  alt="User review"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-full md:w-1/3 bg-black/70 backdrop-blur-md p-4 text-white overflow-y-auto max-h-[40vh] md:max-h-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.user}</span>
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-400" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <span className="text-sm opacity-80">{review.date}</span>
                </div>
                <p className="text-sm mb-3 whitespace-normal break-words">{review.comment}</p>
                <div className="space-y-3">
                  {review.pros.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-green-400 mb-1">
                        <FiThumbsUp />
                        <span className="text-sm font-medium">مزایا</span>
                      </div>
                      <ul className="text-sm space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-1 whitespace-normal break-words">
                            <span className="text-green-400 shrink-0">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-red-400 mb-1">
                        <FiThumbsDown />
                        <span className="text-sm font-medium">معایب</span>
                      </div>
                      <ul className="text-sm space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-1 whitespace-normal break-words">
                            <span className="text-red-400 shrink-0">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        };
      }
    }
    
    return {
      original: item.url,
      thumbnail: item.url,
      renderItem: () => (
        <div className="relative w-full h-full">
          <img
            src={item.url}
            alt={activeTab === 'product' ? "Product image" : "User image"}
            className="w-full h-full object-contain"
          />
        </div>
      )
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="absolute top-4 left-4 z-50 hidden sm:block">
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        <div className="flex gap-1 sm:gap-2 bg-black/70 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg w-[85%] sm:w-auto">
          <button
            onClick={() => setActiveTab('product')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors text-[10px] sm:text-base flex-1 sm:flex-none justify-center ${
              activeTab === 'product' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <FiImage className="text-xs sm:text-lg shrink-0" />
            <span className="whitespace-nowrap">رسانه‌های محصول</span>
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors text-[10px] sm:text-base flex-1 sm:flex-none justify-center ${
              activeTab === 'user' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <FiUsers className="text-xs sm:text-lg shrink-0" />
            <span className="whitespace-nowrap">تصاویر کاربران</span>
            <span className="bg-white/20 text-[8px] sm:text-xs px-1 sm:px-2 py-0.5 rounded-full font-medium shrink-0">
              {userReviews.length}
            </span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full transition-colors sm:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="h-full flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <ImageGallery
            items={galleryItems}
            showPlayButton={false}
            showFullscreenButton={false}
            showNav={true}
            showThumbnails={true}
            thumbnailPosition="bottom"
            additionalClass={`product-gallery ${activeTab === 'user' ? 'user-gallery' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGallery; 