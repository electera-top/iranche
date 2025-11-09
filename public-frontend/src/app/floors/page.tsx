"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header/Header';
import MobileHeader from '@/components/layout/Header/MobileHeader';
import FloorsHeader from '@/components/common/floors/FloorsHeader';
import { floors } from '@/lib/data/floors';
import { Floor } from '@/lib/Types';
import FloorCard from '@/components/common/floors/FloorCard';
import FloorsSearch from '@/components/common/floors/FloorsSearch';

export default function FloorsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredFloors, setFilteredFloors] = useState<Floor[]>(floors);
  
  // شبیه‌سازی بارگذاری داده‌ها
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // محاسبه مجموع فروشگاه‌ها
  const totalStores = floors.reduce((sum, floor) => sum + floor.storeCount, 0);
  
  // تابع فیلتر کردن طبقات
  const handleFilterChange = (filtered: Floor[]) => {
    setFilteredFloors(filtered);
  };
  
  return (
    <main className="min-h-screen text-white">
      <Header />
      <MobileHeader />
      
      <div className="container mx-auto px-4 py-8 pb-16">
        {isLoading ? (
          // نمایش بارگذاری با انیمیشن لوکس‌تر
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-20 h-20">
              <div className="w-full h-full border-4 border-slate-700 border-t-sky-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-4 border-slate-700/50 rounded-full animate-pulse"></div>
            </div>
            <p className="mt-6 text-slate-400 font-medium">در حال بارگذاری طبقات...</p>
          </div>
        ) : (
          // نمایش محتوا با طراحی مدرن و لوکس
          <>
            <FloorsHeader totalFloors={floors.length} totalStores={totalStores} />
            
            {/* جستجو و فیلتر طبقات */}
            <div className="mb-8">
              <FloorsSearch 
                floors={floors} 
                onFilterChange={handleFilterChange} 
              />
            </div>
            
            {/* آیا نتیجه‌ای یافت نشد؟ */}
            {filteredFloors.length === 0 ? (
              <div className="bg-slate-900/70 backdrop-blur-lg rounded-2xl p-10 text-center border border-slate-800 shadow-lg">
                <div className="text-6xl mb-6 opacity-70">🔍</div>
                <h3 className="text-2xl font-bold mb-3 text-white">نتیجه‌ای یافت نشد</h3>
                <p className="text-slate-400 max-w-lg mx-auto">
                  طبقه‌ای با عبارت جستجو شده یافت نشد. لطفاً از عبارت دیگری استفاده کنید یا فیلترهای خود را تغییر دهید.
                </p>
              </div>
            ) : (
              // پیاده‌سازی گرید طبقات با فاصله بیشتر و طراحی لوکس‌تر
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {filteredFloors.map((floor) => (
                  <FloorCard
                    key={floor.id}
                    title={floor.title}
                    description={floor.description}
                    storeCount={floor.storeCount}
                    color={floor.color}
                    slug={floor.slug}
                    isVIP={floor.isVIP}
                  />
                ))}
              </div>
            )}
            
            {/* بخش توضیحات اضافی در پایین صفحه */}
            {filteredFloors.length > 0 && (
              <div className="mt-16 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-lg font-medium text-white mb-2">راهنمای طبقات مرکز خرید</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    طبقات مرکز خرید ما بر اساس نوع کالا و خدمات دسته‌بندی شده‌اند. برای یافتن طبقه مورد نظر خود، 
                    می‌توانید از امکان جستجو استفاده کنید یا با کلیک روی هر طبقه، اطلاعات تکمیلی و فروشگاه‌های آن را مشاهده نمایید.
                    طبقات نشان‌دار با برچسب VIP دارای خدمات ویژه و برندهای اختصاصی هستند.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
} 