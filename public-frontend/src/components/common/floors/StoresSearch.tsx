"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Store } from '@/lib/Types';
import { FiSearch, FiX, FiFilter, FiChevronDown, FiShoppingBag, FiTag, FiHome, FiStar, FiCheck, FiUsers, FiTrendingUp } from 'react-icons/fi';

interface StoresSearchProps {
  stores: Store[];
  categories: string[];
  onFilterChange: (filteredStores: Store[]) => void;
}

export default function StoresSearch({ stores, categories, onFilterChange }: StoresSearchProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'plaque' | 'followers'>('name');
  const [showVIPOnly, setShowVIPOnly] = useState(false);
  const [showAdsOnly, setShowAdsOnly] = useState(false);
  
  // محاسبه تعداد نتایج فیلتر شده با استفاده از useMemo
  const filteredCount = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = 
        store.name.includes(searchText) || 
        store.description.includes(searchText) || 
        store.plaque.includes(searchText);
      
      if (selectedCategory && store.category !== selectedCategory) {
        return false;
      }
      
      if (showVIPOnly && !store.isVIP) {
        return false;
      }
      
      if (showAdsOnly && !store.isAds) {
        return false;
      }
      
      return matchesSearch;
    }).length;
  }, [stores, searchText, selectedCategory, showVIPOnly, showAdsOnly]);
  
  // فیلتر کردن فروشگاه‌ها با استفاده از useMemo
  const filteredStores = useMemo(() => {
    // فیلتر کردن بر اساس جستجو و دسته‌بندی
    const filtered = stores.filter(store => {
      const matchesSearch = 
        store.name.includes(searchText) || 
        store.description.includes(searchText) || 
        store.plaque.includes(searchText);
      
      if (selectedCategory && store.category !== selectedCategory) {
        return false;
      }
      
      if (showVIPOnly && !store.isVIP) {
        return false;
      }
      
      if (showAdsOnly && !store.isAds) {
        return false;
      }
      
      return matchesSearch;
    });
    
    // مرتب‌سازی فروشگاه‌ها
    return [...filtered].sort((a, b) => {
      // فروشگاه‌های تبلیغاتی همیشه در بالا نمایش داده می‌شوند
      if (a.isAds && !b.isAds) return -1;
      if (!a.isAds && b.isAds) return 1;
      
      // بعد از آن، فروشگاه‌های VIP در اولویت هستند
      if (a.isVIP && !b.isVIP) return -1;
      if (!a.isVIP && b.isVIP) return 1;
      
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'plaque') {
        return a.plaque.localeCompare(b.plaque);
      } else if (sortBy === 'followers') {
        return (b.followersCount || 0) - (a.followersCount || 0);
      }
      return 0;
    });
  }, [stores, searchText, selectedCategory, sortBy, showVIPOnly, showAdsOnly]);
  
  // اعمال فیلتر با useEffect - با مقایسه قبلی و فعلی برای جلوگیری از حلقه بی‌نهایت
  const previousFilteredStoresRef = React.useRef<Store[]>([]);
  
  // تابع مقایسه آرایه‌ها به صورت کامل
  const areStoresEqual = useCallback((storesA: Store[], storesB: Store[]): boolean => {
    if (storesA.length !== storesB.length) return false;
    return storesA.every((store, index) => store.id === storesB[index]?.id);
  }, []);
  
  useEffect(() => {
    // مقایسه دقیق آرایه‌ها با استفاده از تابع کمکی
    if (!areStoresEqual(filteredStores, previousFilteredStoresRef.current)) {
      previousFilteredStoresRef.current = [...filteredStores];
      onFilterChange(filteredStores);
    }
  }, [filteredStores, onFilterChange, areStoresEqual]);
  
  return (
    <div className="relative">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-4 p-5">
          {/* فیلد جستجو */}
          <div className="relative flex-grow w-full">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <div className={`text-secondary ${searchText ? 'animate-pulse' : ''}`}>
                <FiSearch className="w-5 h-5" />
              </div>
            </div>
            
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="نام فروشگاه، توضیحات یا شماره پلاک..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-11 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-secondary/40 transition-all duration-200"
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
          
          {/* دکمه فیلتر */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl w-full py-3 px-5 text-white flex items-center justify-between gap-3 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <FiFilter className="w-5 h-5 text-secondary" />
                <span className="text-slate-200">فیلترها</span>
              </div>
              <FiChevronDown className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* پنل فیلترها */}
        {isOpen && (
          <div className="overflow-hidden">
            <div className="px-5 pb-5 text-white border-t border-slate-800/80">
              <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* انتخاب دسته بندی */}
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <FiTag className="w-4 h-4" />
                    <span>دسته‌بندی فروشگاه‌ها</span>
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`text-sm rounded-lg px-3 py-2 transition-colors w-full text-right ${
                        selectedCategory === '' 
                          ? 'bg-secondary/20 text-secondary font-medium' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      همه دسته‌بندی‌ها
                    </button>
                    
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`text-sm rounded-lg px-3 py-2 transition-colors w-full text-right ${
                          selectedCategory === category 
                            ? 'bg-secondary/20 text-secondary font-medium' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* مرتب سازی و فیلترهای اضافی */}
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <FiFilter className="w-4 h-4" />
                    <span>مرتب‌سازی و فیلترها</span>
                  </h4>
                  
                  {/* فیلتر فروشگاه‌های VIP */}
                  <div className="mb-3">
                    <label className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/80 cursor-pointer hover:bg-slate-800/80 transition-colors duration-200">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-200 ${showVIPOnly ? 'bg-secondary' : 'bg-slate-700'}`}>
                        {showVIPOnly && <FiCheck className="w-4 h-4 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={showVIPOnly}
                        onChange={() => setShowVIPOnly(!showVIPOnly)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2">
                        <FiStar className="text-secondary fill-secondary/30 w-5 h-5" />
                        <span className="text-slate-200">فقط فروشگاه‌های VIP</span>
                      </div>
                    </label>
                  </div>
                  
                  {/* فیلتر فروشگاه‌های تبلیغاتی */}
                  <div className="mb-4">
                    <label className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/80 cursor-pointer hover:bg-slate-800/80 transition-colors duration-200">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-200 ${showAdsOnly ? 'bg-amber-500' : 'bg-slate-700'}`}>
                        {showAdsOnly && <FiCheck className="w-4 h-4 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={showAdsOnly}
                        onChange={() => setShowAdsOnly(!showAdsOnly)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2">
                        <FiTrendingUp className="text-amber-500 fill-amber-500/30 w-5 h-5" />
                        <span className="text-slate-200">فقط فروشگاه‌های تبلیغاتی</span>
                      </div>
                    </label>
                  </div>
                  
                  <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <FiFilter className="w-4 h-4" />
                    <span>مرتب‌سازی بر اساس</span>
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSortBy('name')}
                      className={`text-sm rounded-lg px-3 py-2 transition-colors w-full text-right flex items-center justify-between ${
                        sortBy === 'name' 
                          ? 'bg-secondary/20 text-secondary font-medium' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FiShoppingBag className="w-4 h-4" />
                        <span>نام فروشگاه</span>
                      </span>
                      {sortBy === 'name' && (
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setSortBy('rating')}
                      className={`text-sm rounded-lg px-3 py-2 transition-colors w-full text-right flex items-center justify-between ${
                        sortBy === 'rating' 
                          ? 'bg-secondary/20 text-secondary font-medium' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FiStar className="w-4 h-4" />
                        <span>امتیاز فروشگاه</span>
                      </span>
                      {sortBy === 'rating' && (
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setSortBy('followers')}
                      className={`text-sm rounded-lg px-3 py-2 transition-colors w-full text-right flex items-center justify-between ${
                        sortBy === 'followers' 
                          ? 'bg-secondary/20 text-secondary font-medium' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FiUsers className="w-4 h-4" />
                        <span>تعداد دنبال‌کنندگان</span>
                      </span>
                      {sortBy === 'followers' && (
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setSortBy('plaque')}
                      className={`text-sm rounded-lg px-3 py-2 transition-colors w-full text-right flex items-center justify-between ${
                        sortBy === 'plaque' 
                          ? 'bg-secondary/20 text-secondary font-medium' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FiHome className="w-4 h-4" />
                        <span>شماره پلاک</span>
                      </span>
                      {sortBy === 'plaque' && (
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* راهنمای جستجو */}
        {!isOpen && (
          <div className="px-5 pb-4 flex items-center gap-2 text-xs text-slate-500 border-t border-slate-800/80 pt-4">
            <div className="w-1 h-1 rounded-full bg-secondary"></div>
            <span>برای جستجوی دقیق‌تر، نام فروشگاه یا شماره پلاک را وارد کنید</span>
          </div>
        )}
      </div>
      
      {/* متن نمایش نتایج جستجو */}
      <div className="flex items-center justify-between mt-4 px-1 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <FiShoppingBag className="w-4 h-4 text-secondary" />
          <span>نمایش {filteredCount} فروشگاه</span>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedCategory && (
            <div className="flex items-center gap-1.5 text-secondary">
              <FiTag className="w-3.5 h-3.5" />
              <span>{selectedCategory}</span>
              <button 
                onClick={() => setSelectedCategory('')}
                className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center ml-1 hover:bg-slate-700 transition-colors"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {showVIPOnly && (
            <div className="flex items-center gap-1.5 text-secondary">
              <FiStar className="w-3.5 h-3.5 fill-secondary/30" />
              <span>فقط VIP</span>
              <button 
                onClick={() => setShowVIPOnly(false)}
                className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center ml-1 hover:bg-slate-700 transition-colors"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {showAdsOnly && (
            <div className="flex items-center gap-1.5 text-amber-500">
              <FiTrendingUp className="w-3.5 h-3.5 fill-amber-500/30" />
              <span>فقط تبلیغاتی</span>
              <button 
                onClick={() => setShowAdsOnly(false)}
                className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center ml-1 hover:bg-slate-700 transition-colors"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 