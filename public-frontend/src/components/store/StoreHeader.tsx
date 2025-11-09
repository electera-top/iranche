"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiStar, 
  FiFlag, 
  FiUsers, 
  FiMapPin, 
  FiCalendar, 
  FiPackage, 
  FiShoppingCart, 
  FiAward, 
  FiClock,
  FiHeart,
  FiCircle,
  FiAlertCircle,
  FiX
} from 'react-icons/fi';

interface Medal {
  name: string;
  icon: string;
}

interface StoreHeaderProps {
  store: {
    id: string;
    name: string;
    logo: string;
    bannerImage: string;
    category: string;
    floorName: string;
    floorId: string;
    rating: number;
    reviewCount: number;
    isVIP?: boolean;
    isAds?: boolean;
    followers: number;
    products: number;
    sales: number;
    city: string;
    province: string;
    isOnline: boolean;
    joinDate: string;
    medals: Medal[];
  };
}

export default function StoreHeader({ store }: StoreHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  
  const openReportModal = () => {
    setReportModalOpen(true);
  };
  
  const closeReportModal = () => {
    setReportModalOpen(false);
  };
  
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      {/* بنر و لوگو */}
      <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
        <Image
          src={store.bannerImage}
          alt={`${store.name} banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        
        {/* لوگوی فروشگاه */}
        <div className="absolute -bottom-14 right-6 w-28 h-28 rounded-xl overflow-hidden border-4 border-slate-900 bg-slate-800 z-10 shadow-lg">
          <Image
            src={store.logo}
            alt={`${store.name} logo`}
            width={112}
            height={112}
            className="object-contain"
          />
        </div>
        
        {/* نشانگر VIP یا تبلیغاتی */}
        {store.isVIP && (
          <div className="absolute top-4 right-4 bg-secondary/90 text-white text-xs px-3 py-1 rounded-full flex items-center">
            <FiStar className="w-3 h-3 mr-1.5 fill-secondary/30" />
            <span>فروشگاه VIP</span>
          </div>
        )}
        
        {store.isAds && (
          <div className="absolute top-4 right-4 bg-amber-500/90 text-white text-xs px-3 py-1 rounded-full flex items-center">
            <FiStar className="w-3 h-3 mr-1.5 fill-amber-500/30" />
            <span>فروشگاه تبلیغاتی</span>
          </div>
        )}
        
        {/* دکمه گزارش تخلف */}
        <button 
          onClick={openReportModal} 
          className="absolute top-4 left-4 text-white bg-red-500/20 hover:bg-red-500/30 text-xs rounded-full px-3 py-1 transition-colors flex items-center"
        >
          <FiFlag className="w-3 h-3 ml-1" />
          <span>گزارش تخلف</span>
        </button>
      </div>
      
      {/* اطلاعات فروشگاه */}
      <div className="p-5 pt-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{store.name}</h1>
              
              {/* آنلاین بودن */}
              <div className="flex items-center text-xs">
                {store.isOnline ? (
                  <span className="flex items-center text-green-400">
                    <FiCircle className="w-2 h-2 mr-1 fill-green-400" />
                    آنلاین
                  </span>
                ) : (
                  <span className="flex items-center text-slate-400">
                    <FiCircle className="w-2 h-2 mr-1 fill-slate-400" />
                    آفلاین
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              {/* تعداد دنبال‌کنندگان */}
              <div className="flex items-center gap-1.5">
                <FiUsers className="w-4 h-4 text-secondary" />
                <span>{formatNumber(store.followers)} دنبال‌کننده</span>
              </div>
              
              {/* طبقه */}
              <Link 
                href={`/floors/${store.floorId}`} 
                className="flex items-center gap-1.5 hover:text-secondary transition-colors"
              >
                <FiMapPin className="w-4 h-4 text-secondary" />
                <span>طبقه {store.floorName}</span>
              </Link>
            </div>
            
            {/* آمار فروشگاه */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3 flex flex-col items-center">
                <FiShoppingCart className="w-5 h-5 text-secondary mb-1" />
                <div className="text-xs text-slate-400">فروش کل</div>
                <div className="text-white font-bold mt-1">{formatNumber(store.sales)}</div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-3 flex flex-col items-center">
                <FiPackage className="w-5 h-5 text-secondary mb-1" />
                <div className="text-xs text-slate-400">محصولات</div>
                <div className="text-white font-bold mt-1">{store.products}</div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-3 flex flex-col items-center">
                <FiStar className="w-5 h-5 text-amber-400 mb-1" />
                <div className="text-xs text-slate-400">امتیاز</div>
                <div className="text-white font-bold mt-1 flex items-center">
                  <span>{store.rating}</span>
                  <span className="text-xs text-slate-500 mr-1">({store.reviewCount})</span>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-3 flex flex-col items-center">
                <FiCalendar className="w-5 h-5 text-secondary mb-1" />
                <div className="text-xs text-slate-400">عضویت</div>
                <div className="text-white font-bold mt-1 text-sm">{store.joinDate}</div>
              </div>
            </div>
            
            {/* مدال‌ها */}
            {store.medals && store.medals.length > 0 && (
              <div className="mt-5">
                <div className="text-sm text-slate-400 mb-2">مدال‌ها:</div>
                <div className="flex gap-2">
                  {store.medals.map((medal, index) => (
                    <div key={index} className="bg-slate-800/70 rounded-lg px-3 py-1.5 flex items-center">
                      {medal.icon === 'award' && <FiAward className="w-4 h-4 text-yellow-500 ml-1.5" />}
                      {medal.icon === 'clock' && <FiClock className="w-4 h-4 text-green-500 ml-1.5" />}
                      <span className="text-xs text-slate-200">{medal.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* موقعیت جغرافیایی */}
            <div className="mt-4 flex items-center text-sm text-slate-400">
              <FiMapPin className="w-4 h-4 text-secondary ml-1.5" />
              <span>{store.city}، {store.province}</span>
            </div>
          </div>
          
          {/* دکمه‌ها */}
          <div className="flex flex-col gap-3 min-w-32">
            <button
              onClick={toggleFollow}
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                isFollowing 
                  ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700' 
                  : 'bg-secondary text-white hover:bg-secondary/90'
              }`}
            >
              <FiHeart className={`w-4 h-4 ${isFollowing ? 'fill-red-500' : ''}`} />
              <span>{isFollowing ? 'دنبال شده' : 'دنبال کردن'}</span>
            </button>
            
            <Link
              href={`/stores/${store.id}/contact`}
              className="w-full rounded-lg bg-slate-800 text-white hover:bg-slate-700 px-4 py-2.5 text-sm font-medium border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <span>تماس با فروشگاه</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* مدال گزارش تخلف */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <FiFlag className="w-4 h-4 text-red-500 ml-2" />
                گزارش تخلف
              </h3>
              <button 
                onClick={closeReportModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="text-sm text-slate-300 mb-4 flex items-start">
                <FiAlertCircle className="w-5 h-5 text-amber-500 mt-0.5 ml-2 flex-shrink-0" />
                <p>لطفا دلیل گزارش تخلف فروشگاه {store.name} را انتخاب کنید. گزارش شما به صورت ناشناس ثبت می‌شود.</p>
              </div>
              
              <div className="space-y-2 mb-4">
                {['تبلیغات گمراه‌کننده', 'کالای تقلبی', 'قیمت‌های غیرواقعی', 'عدم پاسخگویی', 'سایر موارد'].map((reason) => (
                  <label key={reason} className="flex items-center p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                    <input type="radio" name="reportReason" className="ml-3" />
                    <span className="text-sm text-slate-200">{reason}</span>
                  </label>
                ))}
              </div>
              
              <textarea 
                placeholder="توضیحات بیشتر (اختیاری)..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-secondary/40 transition-all mb-4"
                rows={3}
              />
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={closeReportModal}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm"
                >
                  انصراف
                </button>
                <button className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm">
                  ثبت گزارش
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 