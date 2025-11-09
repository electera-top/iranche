"use client";

import React, { useState, useEffect, useCallback, use } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header/Header';
import MobileHeader from '@/components/layout/Header/MobileHeader';
import { getFloorBySlug, getStoresByFloorId, getCategoriesByFloorId } from '@/lib/data/stores';
import { Store } from '@/lib/Types';
import FloorHeader from '@/components/common/floors/FloorHeader';
import StoreCard from '@/components/common/floors/StoreCard';
import StoresSearch from '@/components/common/floors/StoresSearch';

interface FloorPageProps {
  params: Promise<{
    slug: string;
  }>
}

export default function FloorPage({ params }: FloorPageProps) {
  // استفاده از React.use برای دریافت params
  const { slug } = use(params);
  const floor = getFloorBySlug(slug);
  
  // اگر طبقه وجود نداشت، به صفحه 404 هدایت می‌شود
  if (!floor) {
    notFound();
  }
  
  const allStores = getStoresByFloorId(floor.id);
  const categories = getCategoriesByFloorId(floor.id);
  
  const [isLoading, setIsLoading] = useState(true);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  
  // شبیه‌سازی بارگذاری داده‌ها - کمی سریع‌تر
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredStores(allStores);
    }, 300); // زمان بارگذاری کمتر
    
    return () => clearTimeout(timer);
  }, [allStores]);
  
  // تابع فیلتر کردن فروشگاه‌ها - با استفاده از useCallback برای بهینه‌سازی
  const handleFilterChange = useCallback((filtered: Store[]) => {
    // جلوگیری از بازنشانی state اگر آرایه جدید مشابه آرایه قبلی باشد
    setFilteredStores(prevStores => {
      // بررسی آیا آرایه‌های فیلتر شده مشابه هستند
      if (prevStores.length === filtered.length && 
          prevStores.every((store, index) => store.id === filtered[index].id)) {
        return prevStores; // اگر مشابه هستند، حفظ آرایه قبلی
      }
      return filtered; // اگر متفاوت هستند، آرایه جدید را برگردان
    });
  }, []);
  
  // رندر پله به پله کارت‌ها برای کاهش بار پردازشی
  const renderedStores = filteredStores.map((store) => (
    <div key={store.id} className="store-card-wrapper">
      <StoreCard store={store} />
    </div>
  ));
  
  return (
    <main className="min-h-screen text-white">
      <Header />
      <MobileHeader />
      
      <div className="container mx-auto px-4 py-8 pb-16">
        {isLoading ? (
          // نمایش بارگذاری با انیمیشن ساده‌تر
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-secondary rounded-full animate-spin"></div>
            <p className="mt-6 text-slate-400">در حال بارگذاری فروشگاه‌ها...</p>
          </div>
        ) : (
          <>
            {/* هدر معرفی طبقه */}
            <FloorHeader 
              floor={floor} 
              storeCount={allStores.length}
            />
            
            {/* جستجو و فیلتر فروشگاه‌ها */}
            <div className="mb-8">
              <StoresSearch 
                stores={allStores}
                categories={categories}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            {/* آیا نتیجه‌ای یافت نشد؟ */}
            {filteredStores.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl p-10 text-center border border-slate-800 shadow-lg">
                <div className="text-6xl mb-6 opacity-70">🔍</div>
                <h3 className="text-2xl font-bold mb-3 text-white">فروشگاهی یافت نشد</h3>
                <p className="text-slate-400 max-w-lg mx-auto">
                  فروشگاهی با معیارهای جستجوی شما یافت نشد. لطفاً از عبارت دیگری استفاده کنید یا فیلترهای خود را تغییر دهید.
                </p>
              </div>
            ) : (
              // نمایش فروشگاه‌ها با کلاس‌های بهینه شده
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                style={{ 
                  containIntrinsicSize: '0 500px',
                  contentVisibility: 'auto'
                }}
              >
                {renderedStores}
              </div>
            )}
            
            {/* راهنمای بخش فروشگاه */}
            {filteredStores.length > 0 && (
              <div className="mt-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-lg font-medium text-white mb-2">راهنمای فروشگاه‌ها</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    فروشگاه‌های این طبقه بر اساس نوع کالا و خدمات دسته‌بندی شده‌اند. برای یافتن فروشگاه مورد نظر خود، 
                    می‌توانید از امکان جستجو و فیلتر استفاده کنید. همچنین می‌توانید فروشگاه‌ها را بر اساس امتیاز، شماره پلاک یا نام مرتب کنید.
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