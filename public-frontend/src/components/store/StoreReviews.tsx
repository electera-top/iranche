"use client";

import React, { useState } from 'react';
import { 
  FiStar, 
  FiThumbsUp, 
  FiThumbsDown, 
  FiUser, 
  FiCalendar, 
  FiPackage,
  FiMessageSquare,
  FiSearch,
  FiX,
  FiSend,
  FiSmile,
  FiCheck,
  FiChevronDown
} from 'react-icons/fi';

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  text: string;
  productName: string;
  likes: number;
  dislikes: number;
}

interface StoreReviewsProps {
  reviews: Review[];
  store: {
    name: string;
    rating: number;
    reviewCount: number;
    strengths: string[];
    weaknesses: string[];
  };
}

export default function StoreReviews({ reviews, store }: StoreReviewsProps) {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'highest-rating' | 'lowest-rating'>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  // آمار امتیازات
  const ratings = {
    5: reviews.filter(review => review.rating === 5).length,
    4: reviews.filter(review => review.rating === 4).length,
    3: reviews.filter(review => review.rating === 3).length,
    2: reviews.filter(review => review.rating === 2).length,
    1: reviews.filter(review => review.rating === 1).length,
  };
  
  // محاسبه درصد هر امتیاز
  const calculateRatingPercentage = (rating: number) => {
    return reviews.length > 0 ? (ratings[rating as keyof typeof ratings] / reviews.length) * 100 : 0;
  };
  
  // فیلتر و مرتب‌سازی نظرات
  const filteredReviews = [...reviews]
    .filter(review => {
      if (!searchText) return true;
      
      return (
        review.text.includes(searchText) || 
        review.user.includes(searchText) || 
        review.productName.includes(searchText)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'highest-rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'lowest-rating') {
        return a.rating - b.rating;
      }
      
      // برای 'newest' فرض می‌کنیم که نظرات از قبل بر اساس تاریخ مرتب شده‌اند
      return 0;
    });
  
  // تغییر مرتب‌سازی
  const changeSorting = (sort: 'newest' | 'highest-rating' | 'lowest-rating') => {
    setSortBy(sort);
    setIsSortOpen(false);
  };
  
  // ارسال نظر جدید
  const submitReview = () => {
    if (commentText.trim() === '' || userRating === 0) return;
    
    // در یک برنامه واقعی اینجا نظر به سرور ارسال می‌شود
    alert('نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد.');
    
    // پاکسازی فرم
    setCommentText('');
    setUserRating(0);
  };
  
  return (
    <div className="p-6">
      {/* خلاصه امتیازات */}
      <div className="bg-slate-800/50 rounded-xl p-5 flex flex-col md:flex-row gap-6 border border-slate-800 mb-8">
        <div className="md:w-1/3 flex flex-col items-center justify-center p-3">
          <div className="text-4xl font-bold text-white mb-1">{store.rating.toFixed(1)}</div>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <FiStar
                key={star}
                className={`w-5 h-5 ${star <= store.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`}
              />
            ))}
          </div>
          <div className="text-sm text-slate-400">
            از مجموع {store.reviewCount} نظر
          </div>
        </div>
        
        <div className="md:w-2/3 grid grid-cols-1 gap-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center gap-2">
              <div className="text-sm text-slate-400 w-7">{rating}</div>
              <div className="flex-1 bg-slate-700 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-l from-secondary/80 to-secondary" 
                  style={{ width: `${calculateRatingPercentage(rating)}%` }}
                ></div>
              </div>
              <div className="text-sm text-slate-400 w-12">
                {ratings[rating as keyof typeof ratings]} نظر
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* نقاط قوت و ضعف */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-800">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <FiCheck className="text-green-500 ml-2 w-5 h-5" />
            <span>نقاط قوت از دیدگاه مشتریان</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {store.strengths.map((strength, index) => (
              <div key={index} className="bg-green-500/10 text-green-500 rounded-lg px-3 py-1 text-sm">
                {strength}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-800">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <FiX className="text-red-500 ml-2 w-5 h-5" />
            <span>نقاط ضعف از دیدگاه مشتریان</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {store.weaknesses.length > 0 ? (
              store.weaknesses.map((weakness, index) => (
                <div key={index} className="bg-red-500/10 text-red-500 rounded-lg px-3 py-1 text-sm">
                  {weakness}
                </div>
              ))
            ) : (
              <div className="text-slate-400 text-sm">موردی گزارش نشده است.</div>
            )}
          </div>
        </div>
      </div>
      
      {/* جستجو و مرتب‌سازی نظرات */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <FiSearch className="w-5 h-5 text-secondary" />
          </div>
          
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="جستجو در نظرات..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-11 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
          />
          
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="relative min-w-48">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white w-full flex items-center justify-between"
          >
            <span className="text-sm">
              {sortBy === 'newest' && 'جدیدترین'}
              {sortBy === 'highest-rating' && 'بیشترین امتیاز'}
              {sortBy === 'lowest-rating' && 'کمترین امتیاز'}
            </span>
            <FiChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isSortOpen && (
            <div className="absolute top-full right-0 left-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20">
              <button 
                onClick={() => changeSorting('newest')}
                className="w-full text-right py-2.5 px-4 text-sm hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                جدیدترین
              </button>
              <button 
                onClick={() => changeSorting('highest-rating')}
                className="w-full text-right py-2.5 px-4 text-sm hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                بیشترین امتیاز
              </button>
              <button 
                onClick={() => changeSorting('lowest-rating')}
                className="w-full text-right py-2.5 px-4 text-sm hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                کمترین امتیاز
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* فرم ثبت نظر جدید */}
      <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-800 mb-8">
        <h3 className="text-white font-medium mb-3 flex items-center">
          <FiMessageSquare className="text-secondary ml-2 w-5 h-5" />
          <span>ثبت نظر جدید</span>
        </h3>
        
        <div className="mb-4">
          <div className="text-sm text-slate-400 mb-2">امتیاز شما:</div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setUserRating(rating)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <FiStar
                  className={`w-6 h-6 ${
                    rating <= (hoveredRating || userRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-500'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="نظر خود را بنویسید..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-secondary/40 transition-all h-32 resize-none"
            ></textarea>
            
            <button 
              className="absolute bottom-3 left-3 text-slate-400 hover:text-secondary transition-colors"
            >
              <FiSmile className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={submitReview}
            disabled={commentText.trim() === '' || userRating === 0}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg ${
              commentText.trim() === '' || userRating === 0
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-secondary/90'
            }`}
          >
            <span>ثبت نظر</span>
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* لیست نظرات */}
      <div className="space-y-5">
        {filteredReviews.length === 0 ? (
          <div className="bg-slate-800/30 p-8 rounded-xl text-center">
            <p className="text-slate-400">نظری با این مشخصات یافت نشد!</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className="bg-slate-800/30 rounded-xl p-5 border border-slate-800">
              <div className="flex justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{review.user}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <div className="flex items-center">
                        <FiCalendar className="w-3.5 h-3.5 ml-1" />
                        <span>{review.date}</span>
                      </div>
                      <div className="flex items-center">
                        <FiPackage className="w-3.5 h-3.5 ml-1" />
                        <span>{review.productName}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="text-slate-300 text-sm leading-7 mb-4">
                {review.text}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2 text-xs text-slate-400">
                  آیا این نظر برای شما مفید بود؟
                </div>
                
                <div className="flex gap-3">
                  <button className="flex items-center gap-1 text-slate-400 hover:text-green-500 transition-colors">
                    <FiThumbsUp className="w-4 h-4" />
                    <span className="text-xs">{review.likes}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors">
                    <FiThumbsDown className="w-4 h-4" />
                    <span className="text-xs">{review.dislikes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 