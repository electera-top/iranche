"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiExternalLink, FiStar, FiTag, FiAward, FiUsers, FiGrid, FiTrendingUp } from 'react-icons/fi';
import { Store } from '@/lib/Types';

interface StoreCardProps {
  store: Store;
}

// تابع فرمت کردن اعداد بزرگ به فرمت خوانا
const formatNumber = (num: number = 0): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <div 
      className={`bg-slate-900 rounded-xl overflow-hidden border ${
        store.isAds ? 'border-amber-500/30' : store.isVIP ? 'border-secondary/30' : 'border-slate-800'
      } hover:border-slate-700 transform transition-all duration-150 will-change-transform`}
    >
      <Link href={`/stores/${store.slug}`} className="block">
        <div className="relative h-28 overflow-hidden">
          <Image
            src={store.bannerImage}
            alt={store.name}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          
          {/* پلاک فروشگاه */}
          <div className="absolute bottom-2 left-2 bg-secondary text-white text-sm font-bold px-2 py-0.5 rounded">
            پلاک {store.plaque}
          </div>
          
          {/* دسته‌بندی */}
          <div className="absolute top-2 right-2 bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded-full flex items-center">
            <FiTag className="w-3 h-3 mr-1 text-secondary" />
            <span>{store.category}</span>
          </div>
          
          {/* نشانگر VIP */}
          {store.isVIP && (
            <div className="absolute top-2 left-2 bg-secondary/90 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
              <FiAward className="w-3 h-3 mr-1 fill-white/20" />
              <span>VIP</span>
            </div>
          )}
          
          {/* نشانگر تبلیغاتی */}
          {store.isAds && (
            <div className="absolute top-2 left-2 bg-amber-500/90 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
              <FiTrendingUp className="w-3 h-3 mr-1 fill-white/20" />
              <span>تبلیغاتی</span>
            </div>
          )}
        </div>
        
        <div className="relative p-4 bg-slate-900">
          {/* لوگوی فروشگاه */}
          <div className={`absolute -top-8 right-4 w-16 h-16 rounded-full overflow-hidden border-2 ${
            store.isAds ? 'border-amber-500/30' : store.isVIP ? 'border-secondary/30' : 'border-slate-900'
          } bg-slate-800`}>
            <Image
              src={store.logo}
              alt={`${store.name} logo`}
              width={64}
              height={64}
              className="object-contain"
              loading="lazy"
            />
          </div>
          
          <div className="pt-8">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-white flex items-center">
                {store.name}
                {store.isVIP && (
                  <span className="inline-flex items-center ml-2 text-secondary">
                    <FiStar className="w-3.5 h-3.5 fill-secondary/20" />
                  </span>
                )}
                {store.isAds && (
                  <span className="inline-flex items-center ml-2 text-amber-500">
                    <FiTrendingUp className="w-3.5 h-3.5 fill-amber-500/20" />
                  </span>
                )}
              </h3>
              <div className="flex items-center text-amber-400">
                <FiStar className="w-4 h-4" />
                <span className="ml-1 text-sm font-medium">{store.rating}</span>
                <span className="ml-1 text-xs text-slate-400">({store.reviewCount})</span>
              </div>
            </div>
            
            <p className={`text-slate-400 text-sm line-clamp-2 h-10 mb-2 ${store.isAds ? 'font-semibold text-amber-300/90' : ''}`}>
              {store.description}
            </p>
            
            {/* اطلاعات دنبال‌کنندگان و ویترین */}
            <div className="flex items-center gap-3 mb-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-800/60 px-2 py-1 rounded-md">
                <FiUsers className="w-3.5 h-3.5 text-secondary" />
                <span>{formatNumber(store.followersCount)} دنبال‌کننده</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/60 px-2 py-1 rounded-md">
                <FiGrid className="w-3.5 h-3.5 text-secondary" />
                <span>{store.showcaseCount} ویترین</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-500 flex items-center">
                <span className={`w-1.5 h-1.5 rounded-full ${store.isAds ? 'bg-amber-500' : 'bg-secondary'} mr-1.5`}></span>
                <span>{store.floorName}</span>
              </div>
              
              <div className="flex items-center text-secondary text-sm">
                <span className="ml-1">مشاهده فروشگاه</span>
                <FiExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
} 