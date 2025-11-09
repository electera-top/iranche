'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingBag, FiVideo, FiGrid, FiFilter, FiX, FiChevronRight, FiChevronDown, FiChevronLeft } from 'react-icons/fi';
import MobileProductHeader from '@/components/layout/Header/MobileProductHeader';
import ProductCard from '@/components/common/ProductCard';
import Header from '@/components/layout/Header/Header';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// تعریف نوع نتایج جستجو
type SearchResultType = 'all' | 'stores' | 'products' | 'videos';

// تعریف رابط برای نتایج جستجو
interface SearchResult {
  id: string;
  type: 'store' | 'product' | 'video';
  title: string;
  description: string;
  image?: string;
  url: string;
  storeName?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  duration?: string;
  views?: number;
  rating?: number;
  city?: string;
  isVip?: boolean;
  floor?: string;
  plaque?: string;
  category?: string;
  brand?: string;
  inStock?: boolean;
  storeLogo?: string;
}

// تعریف رابط برای فیلترهای فروشگاه
interface StoreFilter {
  city: string | null;
  isVip: boolean | null;
  rating: number | null;
}

// تعریف رابط برای فیلترهای محصول
interface ProductFilter {
  priceRange: [number, number] | null;
  discount: number | null;
  rating: number | null;
  category: string | null;
  categories: string[];
  expandedCategories: string[];
  brand: string | null;
  inStock: boolean | null;
}

// تعریف نوع برای آیتم درخت دسته‌بندی
interface CategoryItem {
  id: string;
  title: string;
  children?: CategoryItem[];
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<SearchResultType>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showProductFilters, setShowProductFilters] = useState(false);
  const [filters, setFilters] = useState<StoreFilter>({
    city: null,
    isVip: null,
    rating: null
  });
  const [productFilters, setProductFilters] = useState<ProductFilter>({
    priceRange: [0, 100000000],
    discount: null,
    rating: null,
    category: null,
    categories: [],
    expandedCategories: [],
    brand: null,
    inStock: null
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);

  // تعریف ساختار درختی دسته‌بندی‌ها
  const categoryTree = [
    {
      id: 'electronics',
      title: 'الکترونیک',
      children: [
        { 
          id: 'mobile',
          title: 'موبایل',
          children: [
            { id: 'smartphone', title: 'گوشی هوشمند' },
            { id: 'tablet', title: 'تبلت' },
            { id: 'accessories', title: 'لوازم جانبی' }
          ]
        },
        { 
          id: 'computer',
          title: 'کالای دیجیتال',
          children: [
            { id: 'laptop', title: 'لپ تاپ' },
            { id: 'desktop', title: 'کالای دیجیتال' },
            { id: 'monitor', title: 'مانیتور' }
          ]
        },
        { 
          id: 'tv',
          title: 'صوتی و تصویری',
          children: [
            { id: 'tv-set', title: 'تلویزیون' },
            { id: 'speaker', title: 'اسپیکر' },
            { id: 'headphone', title: 'هدفون' }
          ]
        }
      ]
    },
    {
      id: 'fashion',
      title: 'مد و پوشاک',
      children: [
        { 
          id: 'men',
          title: 'مردانه',
          children: [
            { id: 'men-clothes', title: 'لباس' },
            { id: 'men-shoes', title: 'کفش' },
            { id: 'men-accessories', title: 'اکسسوری' }
          ]
        },
        { 
          id: 'women',
          title: 'زنانه',
          children: [
            { id: 'women-clothes', title: 'لباس' },
            { id: 'women-shoes', title: 'کفش' },
            { id: 'women-accessories', title: 'اکسسوری' }
          ]
        },
        { 
          id: 'kids',
          title: 'بچه‌گانه',
          children: [
            { id: 'kids-clothes', title: 'لباس' },
            { id: 'kids-shoes', title: 'کفش' },
            { id: 'kids-accessories', title: 'اکسسوری' }
          ]
        }
      ]
    },
    {
      id: 'home',
      title: 'خانه و آشپزخانه',
      children: [
        { 
          id: 'furniture',
          title: 'مبلمان و دکوراسیون',
          children: [
            { id: 'sofa', title: 'مبل و صندلی' },
            { id: 'table', title: 'میز' },
            { id: 'decoration', title: 'دکوراسیون' }
          ]
        },
        { 
          id: 'kitchen',
          title: 'لوازم آشپزخانه',
          children: [
            { id: 'appliance', title: 'لوازم برقی' },
            { id: 'cookware', title: 'ظروف آشپزی' },
            { id: 'tableware', title: 'ظروف غذاخوری' }
          ]
        },
        { 
          id: 'textile',
          title: 'منسوجات',
          children: [
            { id: 'bedding', title: 'روتختی و روبالشی' },
            { id: 'curtain', title: 'پرده' },
            { id: 'carpet', title: 'فرش' }
          ]
        }
      ]
    }
  ];

  // تابع برای تبدیل عدد به فرمت تومان
  const formatPrice = (price: number) => {
    return price.toLocaleString() + ' تومان';
  };

  // تابع برای تبدیل رشته به عدد
  const parsePrice = (value: string) => {
    return parseInt(value.replace(/[^\d]/g, '')) || 0;
  };

  // تابع برای به‌روزرسانی قیمت‌ها
  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange(value as [number, number]);
    }
  };

  // تابع برای به‌روزرسانی قیمت‌ها پس از رها کردن دستگیره
  const handlePriceAfterChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setProductFilters({...productFilters, priceRange: value as [number, number]});
    }
  };

  // تابع برای به‌روزرسانی قیمت حداقل
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parsePrice(e.target.value);
    if (value <= priceRange[1]) {
      const newRange: [number, number] = [value, priceRange[1]];
      setPriceRange(newRange);
    }
  };

  // تابع برای به‌روزرسانی قیمت حداکثر
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parsePrice(e.target.value);
    if (value >= priceRange[0]) {
      const newRange: [number, number] = [priceRange[0], value];
      setPriceRange(newRange);
    }
  };

  // تابع برای اعمال فیلترها پس از blur
  const handlePriceBlur = () => {
    setProductFilters({...productFilters, priceRange});
  };

  // تابع برای پاک کردن همه فیلترها
  const clearAllFilters = () => {
    setFilters({
      city: null,
      isVip: null,
      rating: null
    });
    setProductFilters({
      priceRange: [0, 100000000],
      discount: null,
      rating: null,
      category: null,
      categories: [],
      expandedCategories: [],
      brand: null,
      inStock: null
    });
    setPriceRange([0, 100000000]);
  };

  // تابع برای پیدا کردن تمام شناسه‌های فرزندان یک دسته‌بندی
  const getAllChildrenIds = (category: CategoryItem): string[] => {
    let ids: string[] = [category.id];
    if (category.children) {
      category.children.forEach(child => {
        ids = ids.concat(getAllChildrenIds(child));
      });
    }
    return ids;
  };

  // تابع برای پیدا کردن تمام شناسه‌های والدین یک دسته‌بندی
  const getAllParentIds = (categoryId: string, tree: CategoryItem[]): string[] => {
    const findParent = (items: CategoryItem[], targetId: string, parentIds: string[] = []): string[] | null => {
      for (const item of items) {
        if (item.children) {
          if (item.children.some(child => child.id === targetId)) {
            return [...parentIds, item.id];
          }
          const result = findParent(item.children, targetId, [...parentIds, item.id]);
          if (result) return result;
        }
      }
      return null;
    };
    
    const parentIds = findParent(tree, categoryId);
    return parentIds || [];
  };

  // شبیه‌سازی نتایج جستجو
  useEffect(() => {
    setLoading(true);
    
    // تاخیر مصنوعی برای نمایش لودینگ
    setTimeout(() => {
      // نتایج نمونه
      const sampleResults: SearchResult[] = [
        {
          id: '1',
          type: 'store',
          title: 'فروشگاه دیجی‌کالا',
          description: 'فروشگاه تخصصی لوازم الکترونیکی و دیجیتال با بیش از ۱۰ سال سابقه درخشان',
          image: '/images/store-logo.png',
          url: '/store/1',
          rating: 4.8,
          city: 'تهران',
          isVip: true,
          floor: 'طبقه ۲',
          plaque: 'پلاک ۱۲۳'
        },
        {
          id: '4',
          type: 'store',
          title: 'فروشگاه ایران‌سل',
          description: 'فروشگاه تخصصی لوازم جانبی موبایل و تبلت',
          image: '/images/store-logo-2.png',
          url: '/store/4',
          rating: 4.5,
          city: 'اصفهان',
          isVip: false,
          floor: 'طبقه ۱',
          plaque: 'پلاک ۴۵'
        },
        {
          id: '7',
          type: 'store',
          title: 'فروشگاه مک‌استور',
          description: 'فروشگاه تخصصی محصولات اپل و لوازم جانبی',
          image: '/images/store-logo-3.png',
          url: '/store/7',
          rating: 4.2,
          city: 'تهران',
          isVip: true,
          floor: 'طبقه ۳',
          plaque: 'پلاک ۷۸'
        },
        {
          id: '8',
          type: 'store',
          title: 'فروشگاه سامسونگ',
          description: 'فروشگاه رسمی محصولات سامسونگ',
          image: '/images/store-logo-4.png',
          url: '/store/8',
          rating: 4.0,
          city: 'شیراز',
          isVip: false,
          floor: 'طبقه ۱',
          plaque: 'پلاک ۲۳'
        },
        {
          id: '2',
          type: 'product',
          title: 'گوشی موبایل سامسونگ گلکسی S23',
          description: 'گوشی موبایل سامسونگ گلکسی S23 با پردازنده قدرتمند، دوربین پیشرفته و باتری با دوام بالا',
          image: '/images/products/product-1.jpg',
          url: '/product/2',
          storeName: 'فروشگاه دیجی‌کالا',
          price: 25000000,
          originalPrice: 32000000,
          discount: 22,
          rating: 4.7,
          category: 'موبایل',
          brand: 'سامسونگ',
          inStock: true
        },
        {
          id: '5',
          type: 'product',
          title: 'هدفون بی‌سیم سونی WH-1000XM4',
          description: 'هدفون بی‌سیم سونی WH-1000XM4 با قابلیت حذف نویز و کیفیت صدای عالی',
          image: '/images/products/product-2.jpg',
          url: '/product/5',
          storeName: 'فروشگاه ایران‌سل',
          price: 8500000,
          originalPrice: 9500000,
          discount: 10,
          rating: 4.5,
          category: 'لوازم جانبی',
          brand: 'سونی',
          inStock: true
        },
        {
          id: '9',
          type: 'product',
          title: 'لپ تاپ اپل مک‌بوک پرو ۱۴ اینچ',
          description: 'لپ تاپ اپل مک‌بوک پرو ۱۴ اینچ با پردازنده M2 Pro و حافظه ۱۶ گیگابایت',
          image: '/images/products/product-3.jpg',
          url: '/product/9',
          storeName: 'فروشگاه مک‌استور',
          price: 85000000,
          originalPrice: 90000000,
          discount: 5,
          rating: 4.9,
          category: 'لپ تاپ',
          brand: 'اپل',
          inStock: false
        },
        {
          id: '10',
          type: 'product',
          title: 'ساعت هوشمند اپل واچ سری ۸',
          description: 'ساعت هوشمند اپل واچ سری ۸ با قابلیت‌های پیشرفته سلامتی و تناسب اندام',
          image: '/images/products/product-4.jpg',
          url: '/product/10',
          storeName: 'فروشگاه مک‌استور',
          price: 25000000,
          originalPrice: 28000000,
          discount: 11,
          rating: 4.6,
          category: 'گجت',
          brand: 'اپل',
          inStock: true
        },
        {
          id: '11',
          type: 'product',
          title: 'تلویزیون سامسونگ ۵۵ اینچ QLED',
          description: 'تلویزیون سامسونگ ۵۵ اینچ QLED با رزولوشن 4K و تکنولوژی HDR',
          image: '/images/products/product-5.jpg',
          url: '/product/11',
          storeName: 'فروشگاه سامسونگ',
          price: 45000000,
          originalPrice: 52000000,
          discount: 13,
          rating: 4.4,
          category: 'تلویزیون',
          brand: 'سامسونگ',
          inStock: true
        },
        {
          id: '3',
          type: 'video',
          title: 'معرفی گوشی سامسونگ گلکسی S23',
          description: 'ویدیوی معرفی و بررسی گوشی سامسونگ گلکسی S23 با جزئیات کامل',
          image: '/images/products/product-video-thumb.jpg',
          url: '/video/3',
          duration: '12:45',
          views: 12500
        },
        {
          id: '6',
          type: 'video',
          title: 'مقایسه هدفون‌های بی‌سیم 2023',
          description: 'مقایسه کامل هدفون‌های بی‌سیم برتر سال 2023 از برندهای مختلف',
          image: '/images/products/product-3.jpg',
          url: '/video/6',
          duration: '18:30',
          views: 8700
        }
      ];
      
      // فیلتر کردن نتایج بر اساس تب فعال
      let filteredResults = activeTab === 'all' 
        ? sampleResults 
        : sampleResults.filter(result => {
            if (activeTab === 'stores') return result.type === 'store';
            if (activeTab === 'products') return result.type === 'product';
            if (activeTab === 'videos') return result.type === 'video';
            return true;
          });
      
      // اعمال فیلترهای فروشگاه
      if (activeTab === 'stores' || activeTab === 'all') {
        const storeResults = filteredResults.filter(result => result.type === 'store');
        
        // فیلتر بر اساس شهر
        if (filters.city) {
          const cityFiltered = storeResults.filter(result => result.city === filters.city);
          filteredResults = filteredResults.filter(result => result.type !== 'store').concat(cityFiltered);
        }
        
        // فیلتر بر اساس VIP
        if (filters.isVip !== null) {
          const vipFiltered = storeResults.filter(result => result.isVip === filters.isVip);
          filteredResults = filteredResults.filter(result => result.type !== 'store').concat(vipFiltered);
        }
        
        // فیلتر بر اساس امتیاز
        if (filters.rating !== null) {
          const ratingFiltered = storeResults.filter(result => result.rating && result.rating >= filters.rating!);
          filteredResults = filteredResults.filter(result => result.type !== 'store').concat(ratingFiltered);
        }
      }
      
      // اعمال فیلترهای محصول
      if (activeTab === 'products' || activeTab === 'all') {
        const productResults = filteredResults.filter(result => result.type === 'product');
        
        // فیلتر بر اساس محدوده قیمت
        if (productFilters.priceRange) {
          const [min, max] = productFilters.priceRange;
          const priceFiltered = productResults.filter(result => 
            result.price && result.price >= min && result.price <= max
          );
          filteredResults = filteredResults.filter(result => result.type !== 'product').concat(priceFiltered);
        }
        
        // فیلتر بر اساس تخفیف
        if (productFilters.discount !== null) {
          const discountFiltered = productResults.filter(result => 
            result.discount && result.discount >= productFilters.discount!
          );
          filteredResults = filteredResults.filter(result => result.type !== 'product').concat(discountFiltered);
        }
        
        // فیلتر بر اساس امتیاز
        if (productFilters.rating !== null) {
          const ratingFiltered = productResults.filter(result => 
            result.rating && result.rating >= productFilters.rating!
          );
          filteredResults = filteredResults.filter(result => result.type !== 'product').concat(ratingFiltered);
        }
        
        // فیلتر بر اساس دسته‌بندی
        if (productFilters.category) {
          const categoryFiltered = productResults.filter(result => 
            result.category === productFilters.category
          );
          filteredResults = filteredResults.filter(result => result.type !== 'product').concat(categoryFiltered);
        }
        
        // فیلتر بر اساس برند
        if (productFilters.brand) {
          const brandFiltered = productResults.filter(result => 
            result.brand === productFilters.brand
          );
          filteredResults = filteredResults.filter(result => result.type !== 'product').concat(brandFiltered);
        }
        
        // فیلتر بر اساس موجودی
        if (productFilters.inStock !== null) {
          const stockFiltered = productResults.filter(result => 
            result.inStock === productFilters.inStock
          );
          filteredResults = filteredResults.filter(result => result.type !== 'product').concat(stockFiltered);
        }
      }
      
      setResults(filteredResults);
      setLoading(false);
    }, 1000);
  }, [query, activeTab, filters, productFilters]);

  // تابع برای شمارش تعداد فیلترهای فعال
  const countActiveFilters = () => {
    let count = 0;
    
    // شمارش فیلترهای قیمت
    if (productFilters.priceRange && (productFilters.priceRange[0] > 0 || productFilters.priceRange[1] < 100000000)) {
      count++;
    }
    
    // شمارش فیلتر تخفیف
    if (productFilters.discount !== null) {
      count++;
    }
    
    // شمارش فیلتر امتیاز
    if (productFilters.rating !== null) {
      count++;
    }
    
    // شمارش فیلتر دسته‌بندی
    if (productFilters.categories.length > 0) {
      count++;
    }
    
    // شمارش فیلتر برند
    if (productFilters.brand !== null) {
      count++;
    }
    
    // شمارش فیلتر موجودی
    if (productFilters.inStock !== null) {
      count++;
    }
    
    return count;
  };

  // رندر کردن کارت فروشگاه
  const renderStoreCard = (result: SearchResult) => (
    <div key={result.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:bg-white/10 transition-colors">
      <Link href={result.url} className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
          <Image 
            src={result.image || '/images/placeholder.png'} 
            alt={result.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            تبلیغ
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white mb-1">{result.title}</h3>
            {result.isVip && (
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                VIP
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm mb-2">{result.description}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
              <span className="text-yellow-400 text-xs">⭐ {result.rating}</span>
            </div>
            <span className="text-gray-500 text-xs">۲.۵K دنبال‌کننده</span>
            {result.city && (
              <span className="text-gray-500 text-xs mr-2">•</span>
            )}
            {result.city && (
              <span className="text-gray-500 text-xs">{result.city}</span>
            )}
          </div>
          {(result.floor || result.plaque) && (
            <div className="flex items-center gap-2 mt-2 text-gray-500 text-xs">
              {result.floor && (
                <span>{result.floor}</span>
              )}
              {result.floor && result.plaque && (
                <span>•</span>
              )}
              {result.plaque && (
                <span>{result.plaque}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );

  // رندر کردن کارت محصول با استفاده از کامپوننت ProductCard
  const renderProductCard = (result: SearchResult) => (
    <ProductCard
      key={result.id}
      id={result.id}
      title={result.title}
      price={result.price || 0}
      discountedPrice={result.originalPrice || null}
      image={result.image || '/images/placeholder.png'}
      rating={result.rating || 0}
      storeId={result.id}
      storeName={result.storeName || 'فروشگاه نامشخص'}
      storeLogo={result.image || '/images/placeholder.png'}
      inStock={result.inStock || true}
    />
  );

  // رندر کردن کارت ویدیو
  const renderVideoCard = (result: SearchResult) => (
    <Link 
      href={result.url} 
      key={result.id}
      className="group bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:bg-white/10 transition-colors"
    >
      <div className="relative aspect-square w-full">
        <Image 
          src={result.image || '/images/placeholder.png'} 
          alt={result.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
          <div className="text-white text-center">
            <h3 className="text-sm font-bold mb-1 line-clamp-2">
              {result.title}
            </h3>
            <div className="flex items-center justify-center gap-2 text-xs">
              <span>{result.views?.toLocaleString()} بازدید</span>
              <span>•</span>
              <span>{result.duration}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 flex items-center gap-2">
        <div className="relative w-6 h-6 rounded-full overflow-hidden">
          <Image 
            src={result.storeLogo || '/images/placeholder.png'} 
            alt={result.storeName || 'فروشگاه'}
            fill
            className="object-cover"
          />
        </div>
        <span className="text-xs text-gray-400">{result.storeName || 'فروشگاه نامشخص'}</span>
      </div>
    </Link>
  );

  // رندر کردن فیلترهای فروشگاه
  const renderStoreFilters = () => {
    const cities = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز'];
    
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">فیلترها</h3>
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            حذف فیلترها
          </button>
        </div>
        
        <div className="space-y-4">
          {/* فیلتر شهر */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">شهر</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters({...filters, city: null})}
                className={`px-3 py-1 rounded-full text-xs ${
                  filters.city === null 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                همه
              </button>
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setFilters({...filters, city})}
                  className={`px-3 py-1 rounded-full text-xs ${
                    filters.city === city 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          
          {/* فیلتر VIP */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">وضعیت VIP</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters({...filters, isVip: null})}
                className={`px-3 py-1 rounded-full text-xs ${
                  filters.isVip === null 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                همه
              </button>
              <button
                onClick={() => setFilters({...filters, isVip: true})}
                className={`px-3 py-1 rounded-full text-xs ${
                  filters.isVip === true 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                VIP
              </button>
              <button
                onClick={() => setFilters({...filters, isVip: false})}
                className={`px-3 py-1 rounded-full text-xs ${
                  filters.isVip === false 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                غیر VIP
              </button>
            </div>
          </div>
          
          {/* فیلتر امتیاز */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">امتیاز</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters({...filters, rating: null})}
                className={`px-3 py-1 rounded-full text-xs ${
                  filters.rating === null 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                همه
              </button>
              <button
                onClick={() => setFilters({...filters, rating: 4.5})}
                className={`px-3 py-1 rounded-full text-xs ${
                  filters.rating === 4.5 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                ۴.۵ و بالاتر
              </button>
              <button
                onClick={() => setFilters({...filters, rating: 4})}
                className={`px-3 py-1 rounded-full text-xs ${
                  filters.rating === 4 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                ۴ و بالاتر
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // رندر کردن آیتم درخت دسته‌بندی
  const CategoryItem = ({ category, level = 0 }: { category: CategoryItem; level?: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isSelected = productFilters.categories.includes(category.id);
    const hasChildren = category.children && category.children.length > 0;

    // تابع برای تیک زدن یا برداشتن تیک از یک دسته‌بندی و فرزندانش
    const handleCategoryChange = (checked: boolean) => {
      let newCategories = [...productFilters.categories];
      
      if (checked) {
        // اضافه کردن خود دسته‌بندی و تمام فرزندانش
        const allChildrenIds = getAllChildrenIds(category);
        newCategories = [...new Set([...newCategories, ...allChildrenIds])];
        
        // اضافه کردن تمام والدین
        const allParentIds = getAllParentIds(category.id, categoryTree);
        newCategories = [...new Set([...newCategories, ...allParentIds])];
      } else {
        // حذف خود دسته‌بندی و تمام فرزندانش
        const allChildrenIds = getAllChildrenIds(category);
        newCategories = newCategories.filter(id => !allChildrenIds.includes(id));
        
        // بررسی والدین - اگر هیچ فرزند دیگری تیک ندارد، تیک والد را هم بردار
        const allParentIds = getAllParentIds(category.id, categoryTree);
        for (const parentId of allParentIds) {
          const parent = findCategoryById(parentId, categoryTree);
          if (parent) {
            const parentChildrenIds = getAllChildrenIds(parent);
            const hasOtherSelectedChildren = parentChildrenIds.some(id => 
              id !== category.id && newCategories.includes(id)
            );
            if (!hasOtherSelectedChildren) {
              newCategories = newCategories.filter(id => id !== parentId);
            }
          }
        }
      }
      
      setProductFilters({...productFilters, categories: newCategories});
    };

    return (
      <div className="space-y-1">
        <div 
          className={`flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/5 transition-colors cursor-pointer ${
            isSelected ? 'text-primary-500' : 'text-white'
          }`}
          style={{ marginRight: `${level * 2}rem` }}
        >
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? <FiChevronLeft className="rotate-90" /> : <FiChevronLeft />}
            </button>
          )}
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative w-5 h-5">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => handleCategoryChange(e.target.checked)}
                className="peer w-5 h-5 rounded border-gray-600 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 focus:ring-2 focus:ring-offset-gray-900 cursor-pointer opacity-0 absolute inset-0"
              />
              <div className="absolute inset-0 rounded border border-gray-600 peer-checked:border-primary-500 peer-checked:bg-primary-500 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className="text-sm group-hover:text-primary-500 transition-colors">{category.title}</span>
          </label>
        </div>
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {category.children?.map(child => (
              <CategoryItem key={child.id} category={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // تابع کمکی برای پیدا کردن یک دسته‌بندی با شناسه
  const findCategoryById = (id: string, items: CategoryItem[]): CategoryItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findCategoryById(id, item.children);
        if (found) return found;
      }
    }
    return null;
  };

  // رندر کردن فیلترهای محصول
  const renderProductFilters = () => {
    const brands = [
      { name: 'سامسونگ', nameEn: 'Samsung' },
      { name: 'اپل', nameEn: 'Apple' },
      { name: 'سونی', nameEn: 'Sony' },
      { name: 'شیائومی', nameEn: 'Xiaomi' },
      { name: 'هواوی', nameEn: 'Huawei' }
    ];

    const floors = [
      { name: 'طبقه ۱', nameEn: 'Floor 1' },
      { name: 'طبقه ۲', nameEn: 'Floor 2' },
      { name: 'طبقه ۳', nameEn: 'Floor 3' },
      { name: 'طبقه ۴', nameEn: 'Floor 4' },
      { name: 'طبقه ۵', nameEn: 'Floor 5' }
    ];
    
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">فیلترها</h3>
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            حذف فیلترها
          </button>
        </div>
        
        <div className="space-y-4">
          {/* فیلتر محدوده قیمت */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">محدوده قیمت</h4>
            <div className="px-2">
              <div className="flex flex-col gap-3 mb-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">از</label>
                  <input
                    type="text"
                    value={formatPrice(priceRange[0])}
                    onChange={handleMinPriceChange}
                    onBlur={handlePriceBlur}
                    className="w-full bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                    placeholder="۰ تومان"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">تا</label>
                  <input
                    type="text"
                    value={formatPrice(priceRange[1])}
                    onChange={handleMaxPriceChange}
                    onBlur={handlePriceBlur}
                    className="w-full bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                    placeholder="۱۰۰ میلیون تومان"
                  />
                </div>
              </div>
              <Slider
                range
                min={0}
                max={100000000}
                step={1000000}
                value={priceRange}
                onChange={handlePriceChange}
                onAfterChange={handlePriceAfterChange}
                railStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                trackStyle={[{ backgroundColor: 'var(--color-primary)' }]}
                handleStyle={[
                  { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' },
                  { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' }
                ]}
                allowCross={false}
              />
            </div>
          </div>
          
          {/* فیلتر دسته‌بندی */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">دسته‌بندی</h4>
            <div className="bg-white/5 rounded-lg p-3">
              {categoryTree.map(category => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </div>
          </div>
          
          {/* فیلتر برند */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">برند</h4>
            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              {brands.map(brand => (
                <label key={brand.name} className="flex items-center gap-2 cursor-pointer group border-b border-gray-700 pb-2 last:border-b-0 last:pb-0">
                  <div className="relative w-5 h-5">
                    <input
                      type="checkbox"
                      checked={productFilters.brand === brand.name}
                      onChange={() => {
                        setProductFilters({
                          ...productFilters,
                          brand: productFilters.brand === brand.name ? null : brand.name
                        });
                      }}
                      className="peer w-5 h-5 rounded border-gray-600 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 focus:ring-2 focus:ring-offset-gray-900 cursor-pointer opacity-0 absolute inset-0"
                    />
                    <div className="absolute inset-0 rounded border border-gray-600 peer-checked:border-primary-500 peer-checked:bg-primary-500 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm group-hover:text-primary-500 transition-colors flex-1">{brand.name}</span>
                  <span className="text-xs text-gray-500">{brand.nameEn}</span>
                </label>
              ))}
            </div>
          </div>

          {/* فیلتر طبقه */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">طبقه</h4>
            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              {floors.map(floor => (
                <label key={floor.name} className="flex items-center gap-2 cursor-pointer group border-b border-gray-700 pb-2 last:border-b-0 last:pb-0">
                  <div className="relative w-5 h-5">
                    <input
                      type="checkbox"
                      checked={productFilters.floor === floor.name}
                      onChange={() => {
                        setProductFilters({
                          ...productFilters,
                          floor: productFilters.floor === floor.name ? null : floor.name
                        });
                      }}
                      className="peer w-5 h-5 rounded border-gray-600 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 focus:ring-2 focus:ring-offset-gray-900 cursor-pointer opacity-0 absolute inset-0"
                    />
                    <div className="absolute inset-0 rounded border border-gray-600 peer-checked:border-primary-500 peer-checked:bg-primary-500 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm group-hover:text-primary-500 transition-colors flex-1">{floor.name}</span>
                  <span className="text-xs text-gray-500">{floor.nameEn}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* فیلتر امتیاز */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">امتیاز</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setProductFilters({...productFilters, rating: null})}
                className={`px-3 py-1 rounded-full text-xs ${
                  productFilters.rating === null 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                همه
              </button>
              <button
                onClick={() => setProductFilters({...productFilters, rating: 4.5})}
                className={`px-3 py-1 rounded-full text-xs ${
                  productFilters.rating === 4.5 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                ۴.۵ و بالاتر
              </button>
              <button
                onClick={() => setProductFilters({...productFilters, rating: 4})}
                className={`px-3 py-1 rounded-full text-xs ${
                  productFilters.rating === 4 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                ۴ و بالاتر
              </button>
            </div>
          </div>
          
          {/* فیلتر موجودی */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">موجودی</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setProductFilters({...productFilters, inStock: null})}
                className={`px-3 py-1 rounded-full text-xs ${
                  productFilters.inStock === null 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                همه
              </button>
              <button
                onClick={() => setProductFilters({...productFilters, inStock: true})}
                className={`px-3 py-1 rounded-full text-xs ${
                  productFilters.inStock === true 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                موجود
              </button>
              <button
                onClick={() => setProductFilters({...productFilters, inStock: false})}
                className={`px-3 py-1 rounded-full text-xs ${
                  productFilters.inStock === false 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                ناموجود
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // رندر کردن دکمه فیلتر موبایل
  const renderMobileFilterButton = () => {
    const activeFiltersCount = countActiveFilters();
    
    return (
      <button
        onClick={() => setShowProductFilters(true)}
        className="fixed left-4 bottom-4 z-50 bg-primary-500 text-white p-4 rounded-full shadow-lg md:hidden flex items-center gap-2"
      >
        <FiFilter className="text-xl" />
        <span>فیلترها</span>
        {activeFiltersCount > 0 && (
          <span className="bg-white text-primary-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>
    );
  };

  // رندر کردن منوی فیلتر موبایل
  const renderMobileFilterMenu = () => (
    <div className={`fixed inset-0 z-50 md:hidden ${showProductFilters ? 'visible' : 'invisible'}`}>
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={() => setShowProductFilters(false)}
      />
      <div 
        className={`absolute top-0 bottom-0 right-0 w-80 bg-gray-900 transform transition-transform duration-300 ${
          showProductFilters ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold">فیلترها</h3>
          <button
            onClick={() => setShowProductFilters(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          {renderProductFilters()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <MobileProductHeader />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
       
        {/* تب‌های جستجو */}
        <div className="max-w-5xl mx-auto mb-8 border-b border-gray-700 overflow-x-auto no-scrollbar mt-20 md:mt-0">
          <div className="flex items-center gap-6 min-w-max pb-0.5">
            <button 
              onClick={() => setActiveTab('all')}
              className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'all' 
                  ? 'border-secondary text-secondary' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              همه
            </button>
            <button 
              onClick={() => setActiveTab('stores')}
              className={`py-3 px-1 border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'stores' 
                  ? 'border-secondary text-secondary' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FiGrid className="text-lg" />
              <span>فروشگاه‌ها</span>
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`py-3 px-1 border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'products' 
                  ? 'border-secondary text-secondary' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FiShoppingBag className="text-lg" />
              <span>محصولات</span>
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`py-3 px-1 border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'videos' 
                  ? 'border-secondary text-secondary' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FiVideo className="text-lg" />
              <span>ویدیوها</span>
            </button>
          </div>
        </div>

        {/* نتایج جستجو */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mb-4"></div>
              <p className="text-gray-400">در حال جستجو...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-6">
              {activeTab === 'all' ? (
                <>
                  {/* بخش فروشگاه‌ها */}
                  {results.some(r => r.type === 'store') && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-white mb-4">فروشگاه‌های یافته شده</h2>
                      <div className="flex flex-col gap-4">
                        {results.filter(r => r.type === 'store').map(renderStoreCard)}
                      </div>
                    </div>
                  )}

                  {/* بخش محصولات */}
                  {results.some(r => r.type === 'product') && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-white mb-4">محصولات یافته شده</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.filter(r => r.type === 'product').map(renderProductCard)}
                      </div>
                    </div>
                  )}

                  {/* بخش ویدیوهای یافته شده */}
                  {results.filter(r => r.type === 'video').length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-white mb-4">از اکسپلور</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results
                          .filter(r => r.type === 'video')
                          .map(renderVideoCard)}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  {activeTab === 'stores' && (
                    <>
                      {renderStoreFilters()}
                      <div className="flex flex-col gap-4">
                        {results.map(renderStoreCard)}
                      </div>
                    </>
                  )}
                  {activeTab === 'products' && (
                    <div className="flex gap-6">
                      {/* سایدبار فیلترها - فقط در دسکتاپ */}
                      <div className="hidden md:block w-64 flex-shrink-0">
                        {renderProductFilters()}
                      </div>
                      
                      {/* نتایج محصولات */}
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {results.map(renderProductCard)}
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'videos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.map(renderVideoCard)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">نتیجه‌ای یافت نشد.</p>
              <p className="text-gray-500 text-sm mt-2">لطفاً عبارت جستجوی خود را تغییر دهید.</p>
            </div>
          )}
        </div>
      </div>

      {/* دکمه فیلتر موبایل */}
      {activeTab === 'products' && renderMobileFilterButton()}
      
      {/* منوی فیلتر موبایل */}
      {renderMobileFilterMenu()}
    </div>
  );
};

export default SearchPage; 