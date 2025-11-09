"use client";

import React, { useState, useMemo } from 'react';
import { FiFilter, FiChevronDown, FiGrid, FiList, FiSearch, FiTag, FiX, FiCheck } from 'react-icons/fi';
import ProductCard from '@/components/common/ProductCard';

interface Product {
  id: string;
  title: string;
  price: number;
  discountedPrice: number | null;
  image: string;
  category: string;
  inStock: boolean;
}

interface StoreProductsProps {
  products: Product[];
}

export default function StoreProducts({ products }: StoreProductsProps) {
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  
  // استخراج دسته‌بندی‌های منحصر به فرد محصولات
  const categories = useMemo(() => {
    const categoriesSet = new Set(products.map(product => product.category));
    return Array.from(categoriesSet);
  }, [products]);
  
  // فیلتر کردن و مرتب‌سازی محصولات
  const filteredProducts = useMemo(() => {
    // فیلتر کردن محصولات بر اساس متن جستجو و دسته‌بندی
    const filtered = products.filter(product => {
      if (searchText && !product.title.includes(searchText)) {
        return false;
      }
      
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      
      if (showInStockOnly && !product.inStock) {
        return false;
      }
      
      return true;
    });
    
    // مرتب‌سازی محصولات
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') {
        const priceA = a.discountedPrice !== null ? a.discountedPrice : a.price;
        const priceB = b.discountedPrice !== null ? b.discountedPrice : b.price;
        return priceA - priceB;
      } else if (sortBy === 'price-desc') {
        const priceA = a.discountedPrice !== null ? a.discountedPrice : a.price;
        const priceB = b.discountedPrice !== null ? b.discountedPrice : b.price;
        return priceB - priceA;
      }
      
      // For 'newest', we just use the original order
      return 0;
    });
  }, [products, searchText, selectedCategory, sortBy, showInStockOnly]);
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };
  
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };
  
  // ساخت داده‌های اضافی برای ProductCard
  const enhancedProducts = filteredProducts.map(product => {
    // مقادیر تصادفی برای نمایش ویژگی‌های مختلف
    const isVIP = Math.random() > 0.8;
    const isAds = !isVIP && Math.random() > 0.8;
    const hasDiscount = product.discountedPrice !== null;
    const discountEndsAt = hasDiscount ? new Date(Date.now() + Math.random() * 86400000) : undefined; // تا 24 ساعت آینده
    const limitedStock = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : undefined;
    const rating = Math.floor(Math.random() * 3) + 3; // امتیاز بین 3 تا 5
    
    // رنگ‌بندی تصادفی
    const colorOptions = Math.random() > 0.5 ? [
      { name: 'مشکی', code: '#000000' },
      { name: 'سفید', code: '#ffffff' },
      { name: 'آبی', code: '#0066cc' },
    ] : undefined;
    
    // فروشگاه (موقتی)
    const storeId = 'store-' + Math.floor(Math.random() * 5) + 1;
    const storeName = 'فروشگاه ' + Math.floor(Math.random() * 5) + 1;
    const storeLogo = `/images/products/product-${Math.floor(Math.random() * 5) + 1}.jpg`;
    
    return {
      ...product,
      isVIP,
      isAds,
      hasDiscount,
      discountEndsAt,
      limitedStock,
      rating,
      colors: colorOptions,
      storeId,
      storeName,
      storeLogo,
    };
  });
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <div className={`text-secondary ${searchText ? 'animate-pulse' : ''}`}>
                <FiSearch className="w-5 h-5" />
              </div>
            </div>
            
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="جستجو در محصولات فروشگاه..."
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
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFilters}
              className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl py-3 px-4 text-white flex items-center justify-between gap-2 transition-all duration-200"
            >
              <FiFilter className="w-5 h-5 text-secondary" />
              <span className="text-sm">فیلترها</span>
              <FiChevronDown className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${isFiltersOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={toggleViewMode}
              className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl py-3 px-4 text-white transition-all duration-200"
            >
              {viewMode === 'grid' ? (
                <FiList className="w-5 h-5 text-secondary" />
              ) : (
                <FiGrid className="w-5 h-5 text-secondary" />
              )}
            </button>
          </div>
        </div>
        
        {/* پنل فیلترها */}
        {isFiltersOpen && (
          <div className="mt-4 bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* دسته‌بندی‌ها */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">دسته‌بندی</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`text-sm rounded-lg px-3 py-2 transition-colors w-full text-right flex items-center gap-2 ${
                      selectedCategory === '' 
                        ? 'bg-secondary/20 text-secondary font-medium' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <FiTag className="w-4 h-4" />
                    <span>همه دسته‌بندی‌ها</span>
                  </button>
                  
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`text-sm rounded-lg px-3 py-2 transition-colors w-full text-right flex items-center gap-2 ${
                        selectedCategory === category 
                          ? 'bg-secondary/20 text-secondary font-medium' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <FiTag className="w-4 h-4" />
                      <span>{category}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* مرتب‌سازی */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">مرتب‌سازی</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSortBy('newest')}
                    className={`text-sm rounded-lg px-3 py-2 transition-colors w-full text-right flex items-center justify-between ${
                      sortBy === 'newest' 
                        ? 'bg-secondary/20 text-secondary font-medium' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>جدیدترین</span>
                    {sortBy === 'newest' && (
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setSortBy('price-asc')}
                    className={`text-sm rounded-lg px-3 py-2 transition-colors w-full text-right flex items-center justify-between ${
                      sortBy === 'price-asc' 
                        ? 'bg-secondary/20 text-secondary font-medium' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>ارزان‌ترین</span>
                    {sortBy === 'price-asc' && (
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setSortBy('price-desc')}
                    className={`text-sm rounded-lg px-3 py-2 transition-colors w-full text-right flex items-center justify-between ${
                      sortBy === 'price-desc' 
                        ? 'bg-secondary/20 text-secondary font-medium' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>گران‌ترین</span>
                    {sortBy === 'price-desc' && (
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* فیلترهای اضافی */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">فیلترها</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${showInStockOnly ? 'bg-secondary' : 'bg-slate-700'}`}>
                      {showInStockOnly && <FiCheck className="w-3 h-3 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={showInStockOnly}
                      onChange={() => setShowInStockOnly(!showInStockOnly)}
                      className="sr-only"
                    />
                    <span className="text-sm text-slate-300">فقط کالاهای موجود</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* متن راهنمای فیلترها */}
            <div className="mt-4 pt-4 border-t border-slate-700/50 text-xs text-slate-400 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-secondary"></div>
              <span>نمایش {filteredProducts.length} محصول از {products.length} محصول</span>
            </div>
          </div>
        )}
      </div>
      
      {/* نمایش محصولات */}
      {filteredProducts.length === 0 ? (
        <div className="bg-slate-800/30 rounded-xl p-8 text-center">
          <p className="text-slate-400">محصولی با این مشخصات یافت نشد!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {enhancedProducts.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              discountedPrice={product.discountedPrice}
              image={product.image}
              rating={product.rating}
              storeId={product.storeId}
              storeName={product.storeName}
              storeLogo={product.storeLogo}
              colors={product.colors}
              isVIP={product.isVIP}
              isAds={product.isAds}
              hasDiscount={product.hasDiscount}
              discountEndsAt={product.discountEndsAt}
              limitedStock={product.limitedStock}
              category={product.category}
              inStock={product.inStock}
            />
          ))}
        </div>
      )}
    </div>
  );
} 