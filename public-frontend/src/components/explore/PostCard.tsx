"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { BiHeart, BiSolidHeart, BiComment, BiBookmark, BiSolidBookmark, BiShareAlt, BiDotsHorizontal, BiStar, BiTrendingUp } from 'react-icons/bi';

interface Store {
  id: string;
  name: string;
  logo: string;
  isVIP?: boolean;
}

interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  store: Store;
  category: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  isVIP?: boolean;
  isAd?: boolean;
}

interface PostCardProps {
  post: Post;
  viewMode: 'grid' | 'list';
  className?: string;
}

export default function PostCard({ post, viewMode, className = '' }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  
  const handleLike = () => {
    setLiked(prev => !prev);
  };
  
  const handleSave = () => {
    setSaved(prev => !prev);
  };
  
  const handleFollow = () => {
    setFollowing(prev => !prev);
  };
  
  const handleDoubleClick = () => {
    if (!liked) {
      setLiked(true);
      setShowLikeAnimation(true);
      
      // پنهان کردن انیمیشن پس از 1.5 ثانیه
      setTimeout(() => {
        setShowLikeAnimation(false);
      }, 1500);
    }
  };
  
  // فرمت‌کننده تاریخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'امروز';
    } else if (diffDays === 1) {
      return 'دیروز';
    } else if (diffDays < 7) {
      return `${diffDays} روز پیش`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} هفته پیش`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ماه پیش`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} سال پیش`;
    }
  };
  
  const formattedDate = formatDate(post.createdAt);
  
  if (viewMode === 'grid') {
    // حالت گرید (شبیه اکسپلور اینستاگرام)
    return (
      <div className={`relative h-full w-full ${className}`}>
        {/* نشان‌های VIP و تبلیغات - قبل از Link */}
        <div className="absolute top-2 right-2 flex gap-1 z-20">
          {post.isVIP && (
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm">
              <BiStar className="w-3 h-3" />
              <span>VIP</span>
            </div>
          )}
          {post.isAd && (
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm">
              <BiTrendingUp className="w-3 h-3" />
              <span>تبلیغات</span>
            </div>
          )}
        </div>

        <div  className="block h-full">
          <div 
            className="relative w-full h-full"
            onDoubleClick={handleDoubleClick}
          >
            <Image
              src={post.image || "https://source.unsplash.com/random/400x400?persian-art"}
              alt={post.title}
              fill
              className="object-cover"
            />
            
            {/* انیمیشن لایک با دابل کلیک */}
            {showLikeAnimation && (
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="animate-like-animation">
                  <BiSolidHeart className="w-16 h-16 text-white" />
                </div>
              </div>
            )}
            
            {/* نمایش آمار پست روی تصویر (در حالت هاور) */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-3">
                <div className="flex items-center text-white">
                  <BiHeart className="w-4 h-4" />
                  <span className="ml-1 text-xs font-semibold">{post.likes}</span>
                </div>
                <div className="flex items-center text-white">
                  <BiComment className="w-4 h-4" />
                  <span className="ml-1 text-xs font-semibold">{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* نام فروشگاه و دکمه مشاهده محصول */}
        <div className="absolute bottom-0 left-0 right-0 hidden sm:flex items-center justify-between p-2 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center">
            <div className={`relative w-5 h-5 rounded-full overflow-hidden border ${
              post.store.isVIP 
                ? 'p-0.5 bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-500' 
                : 'border-zinc-700'
            }`}>
              <div className={`relative w-full h-full rounded-full overflow-hidden ${post.store.isVIP ? 'border border-black' : ''}`}>
                <Image
                  src={post.store.logo || "https://source.unsplash.com/random/80x80?logo"}
                  alt={post.store.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <span className="text-white text-xs font-medium mr-1 truncate max-w-[80px]">{post.store.name}</span>
          </div>
          <button 
            className="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded-full transition-colors"
          >
            مشاهده
          </button>
        </div>
      </div>
    );
  }
  
  // حالت لیست (شبیه فید اینستاگرام)
  return (
    <div className=" overflow-hidden mb-4" dir="rtl">
      {/* هدر پست */}
      <div className="flex items-center px-3 py-2">
        <div className="relative">
          <div className={`relative w-8 h-8 rounded-full overflow-hidden border ${
            post.store.isVIP 
              ? 'p-0.5 bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-500' 
              : 'border-zinc-700'
          }`}>
            <div className={`relative w-full h-full rounded-full overflow-hidden ${post.store.isVIP ? 'border border-black' : ''}`}>
              <Image
                src={post.store.logo || "https://source.unsplash.com/random/80x80?logo"}
                alt={post.store.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <div className="mr-2 flex-grow">
          <div className="flex items-center">
            <span className="text-white text-sm font-medium">{post.store.name}</span>
            <button 
              onClick={handleFollow}
              className={`mr-2 text-xs px-2 py-0.5 rounded-full transition-colors ${
                following 
                  ? 'bg-zinc-800 text-white' 
                  : 'bg-blue-500 text-white'
              }`}
            >
              {following ? 'دنبال شده' : 'دنبال کردن'}
            </button>
          </div>
        </div>
        <button className="text-white p-1">
          <BiDotsHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      {/* تصویر پست */}
      <div
        className="relative aspect-square w-full"
        onDoubleClick={handleDoubleClick}
      >
        <Image
          src={post.image || "https://source.unsplash.com/random/600x600?persian-art"}
          alt={post.title}
          fill
          className="object-cover"
        />
        
        {/* نشان‌های VIP و تبلیغات */}
        <div className="absolute top-2 right-2 flex gap-1 z-20">
          {post.isVIP && (
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm">
              <BiStar className="w-3 h-3" />
              <span>VIP</span>
            </div>
          )}
          {post.isAd && (
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm">
              <BiTrendingUp className="w-3 h-3" />
              <span>تبلیغات</span>
            </div>
          )}
        </div>
        
        {/* انیمیشن لایک با دابل کلیک */}
        {showLikeAnimation && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="animate-like-animation">
              <BiSolidHeart className="w-16 h-16 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* دکمه‌های اکشن */}
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike}
            className="text-white"
          >
            {liked ? (
              <BiSolidHeart className="w-6 h-6 text-red-500" />
            ) : (
              <BiHeart className="w-6 h-6" />
            )}
          </button>
          
          <button className="text-white">
            <BiComment className="w-6 h-6" />
          </button>
          
          <button className="text-white">
            <BiShareAlt className="w-6 h-6" />
          </button>
        </div>
        
        <button 
          onClick={handleSave}
          className="text-white"
        >
          {saved ? (
            <BiSolidBookmark className="w-6 h-6" />
          ) : (
            <BiBookmark className="w-6 h-6" />
          )}
        </button>
      </div>
      
      {/* تعداد لایک‌ها */}
      <div className="px-3 py-1">
        <p className="text-white text-sm font-medium">{liked ? post.likes + 1 : post.likes} لایک</p>
      </div>
      
      {/* کپشن */}
      <div className="px-3 pb-1">
        <p className="text-white text-sm">
          <span className="font-medium ml-1">{post.store.name}</span>
          {post.description.length > 100 ? `${post.description.substring(0, 100)}...` : post.description}
        </p>
        <p className="text-zinc-500 text-xs mt-1">نمایش همه {post.comments} نظر</p>
        <p className="text-zinc-500 text-[10px] mt-1">{formattedDate}</p>
      </div>
      
      {/* استایل‌های سفارشی */}
      <style jsx global>{`
        @keyframes likeAnimation {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        
        .animate-like-animation {
          animation: likeAnimation 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 