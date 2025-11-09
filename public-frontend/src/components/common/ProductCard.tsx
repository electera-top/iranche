"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiStar, 
  FiShoppingCart, 
  FiHeart, 
  FiRefreshCw, 
  FiShare2, 
  FiMoreHorizontal,
  FiPlus,
  FiMinus,
  FiClock,
  FiAlertCircle,
  FiMapPin,
  FiLayers
} from 'react-icons/fi';

type ColorOption = {
  name: string;
  code: string;
};

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  discountedPrice: number | null;
  image: string;
  rating: number;
  storeId: string;
  storeName: string;
  storeLogo: string;
  storeFloor?: number;
  storeUnit?: string;
  colors?: ColorOption[];
  isVIP?: boolean;
  isAds?: boolean;
  hasDiscount?: boolean;
  discountEndsAt?: Date;
  limitedStock?: number;
  category?: string;
  inStock: boolean;
  city?: string;
}

export default function ProductCard({ 
  id, 
  title, 
  price, 
  discountedPrice, 
  image, 
  rating, 
  storeId, 
  storeName, 
  storeLogo, 
  storeFloor = 1,
  storeUnit = "A12",
  colors, 
  isVIP, 
  isAds, 
  hasDiscount, 
  discountEndsAt, 
  limitedStock,
  category,
  inStock,
  city = "تهران"
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors?.length ? colors[0].code : null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState<{hours: number, minutes: number, seconds: number} | null>(
    discountEndsAt ? calculateRemainingTime(discountEndsAt) : null
  );

  // محاسبه زمان باقیمانده تا پایان تخفیف
  function calculateRemainingTime(endTime: Date) {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
  }

  // به‌روزرسانی زمان سنج تخفیف
  React.useEffect(() => {
    if (!discountEndsAt) return;
    
    const timer = setInterval(() => {
      const time = calculateRemainingTime(discountEndsAt);
      setRemainingTime(time);
      
      if (!time) clearInterval(timer);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [discountEndsAt]);

  // افزایش تعداد
  const increaseQuantity = () => {
    if (limitedStock && quantity >= limitedStock) return;
    setQuantity(prev => prev + 1);
  };

  // کاهش تعداد
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // محاسبه درصد تخفیف
  const discountPercentage = discountedPrice 
    ? Math.round(((price - discountedPrice) / price) * 100) 
    : 0;

  // فرمت کردن قیمت
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' تومان';
  };

  // باز و بسته کردن منوی گزینه‌های بیشتر
  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border-2 border-gray-100 border-slate-700 hover:border-secondary/70 transition-all duration-300 group relative shadow-md hover:shadow-xl hover:shadow-secondary/5 flex flex-col h-full">
      {/* نشانگر VIP یا تبلیغاتی */}
      {isVIP && (
        <div className="absolute top-2 right-2 z-10 bg-secondary text-white text-xs px-2 py-0.5 rounded-full flex items-center shadow-md">
          <FiStar className="w-3 h-3 mr-1 fill-white" />
          <span>محصول VIP</span>
        </div>
      )}
      
      {isAds && (
        <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center shadow-md">
          <FiStar className="w-3 h-3 mr-1 fill-white" />
          <span>تبلیغاتی</span>
        </div>
      )}
      
      {/* تصویر محصول */}
      <div className="relative h-52 overflow-hidden bg-slate-900/50">
        <Link href={`/products/${id}`} className="block w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        
        {/* نشانگر دسته‌بندی */}
        {category && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full flex items-center shadow-md z-10">
            <span>{category}</span>
          </div>
        )}
        
        {/* نشانگر وضعیت موجودی */}
        {!inStock && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="text-white bg-red-500 px-4 py-1.5 rounded-md text-sm font-medium shadow-md">ناموجود</span>
          </div>
        )}
        
        {/* زمان‌سنج تخفیف */}
        {hasDiscount && remainingTime && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs p-1.5 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center">
              <FiClock className="w-3 h-3 ml-1 animate-pulse" />
              <span>پایان تخفیف:</span>
            </div>
            <div className="flex items-center gap-1 font-mono bg-red-700/80 px-1.5 py-0.5 rounded">
              <span>{remainingTime.hours.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span>{remainingTime.minutes.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span>{remainingTime.seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* تگ درصد تخفیف */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-0 bg-red-500 text-white text-xs font-bold p-1 pr-4 pl-2 rounded-r-full shadow-lg transform -rotate-1">
          <span>{discountPercentage}٪ تخفیف</span>
        </div>
      )}
      
      {/* اطلاعات فروشگاه */}
      <Link href={`/stores/${storeId}`} className="flex flex-col px-3 py-2 gap-1 hover:bg-slate-700/50 transition-colors group border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-white flex-shrink-0 border border-slate-600 shadow-sm group-hover:ring-1 group-hover:ring-secondary/50 transition-all">
            <Image
              src={storeLogo}
              alt={storeName}
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <span className="text-xs text-slate-300 truncate group-hover:text-secondary transition-colors font-medium">{storeName}</span>
        </div>
        
        {/* نمایش طبقه و پلاک فروشگاه */}
        <div className="flex items-center gap-2 mr-9">
          <div className="flex items-center gap-1">
            <FiLayers className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-400">طبقه:</span>
            <span className="text-xs font-bold text-slate-300">{storeFloor}</span>
          </div>
          
          <span className="text-xs text-slate-500">•</span>
          
          <div className="flex items-center gap-1">
            <FiMapPin className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-400">پلاک:</span>
            <span className="text-xs font-bold text-slate-300">{storeUnit}</span>
          </div>
        </div>
      </Link>
      
      {/* محتوای اصلی کارت */}
      <div className="px-3 py-2 flex flex-col flex-grow bg-slate-800">
        {/* عنوان و امتیاز قیمت */}
        <div className="flex justify-between items-start mb-2">
          <Link href={`/products/${id}`} className="w-3/5">
            <h3 className="text-white font-medium truncate hover:text-secondary transition-colors">{title}</h3>
          </Link>
          
          {/* قیمت محصول - سمت چپ */}
          <div className="w-2/5 flex flex-col items-end">
            {discountedPrice !== null ? (
              <div className="flex flex-col items-end">
                <div className="text-gray-400 line-through text-xs">
                  {formatPrice(price)}
                </div>
                <div className="text-secondary font-bold">
                  {formatPrice(discountedPrice)}
                </div>
              </div>
            ) : (
              <div className="text-white font-bold text-right">
                {formatPrice(price)}
              </div>
            )}
          </div>
        </div>
        
        {/* رنگ‌بندی و امتیاز */}
        <div className="flex justify-between items-center mb-2 bg-slate-700/30 p-2 rounded-lg">
          {/* شهر - سمت راست */}
          <div className="flex items-center gap-1">
            {city && (
              <div className="flex items-center gap-1">
                <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-300">{city}</span>
              </div>
            )}
            
            {colors && colors.length > 0 && city && (
              <span className="text-xs text-slate-500 mx-1.5">|</span>
            )}
            
            {/* رنگ‌بندی محصول */}
            {colors && colors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">رنگ:</span>
                <div className="flex gap-1">
                  {colors.map(color => (
                    <button
                      key={color.code}
                      className={`w-5 h-5 rounded-full flex-shrink-0 transition-all duration-300 border-2 ${
                        selectedColor === color.code 
                          ? 'border-slate-900 ring-2 ring-secondary scale-110' 
                          : 'border-slate-900 hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.code }}
                      onClick={() => setSelectedColor(color.code)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* امتیاز محصول - سمت چپ */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">({rating})</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <FiStar
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* تعداد محدود باقی‌مانده */}
        {limitedStock !== undefined && limitedStock <= 5 && (
          <div className="bg-red-900/20 text-red-400 text-xs px-2 py-1.5 rounded-md flex items-center justify-center mb-3">
            <FiAlertCircle className="w-3.5 h-3.5 ml-1 animate-pulse" />
            <span>فقط {limitedStock} عدد باقی‌مانده</span>
          </div>
        )}
        
        {/* فضای خالی بین محتوا و دکمه‌ها */}
        <div className="flex-grow mt-1 min-h-[10px]"></div>
        
        {/* کنترل‌های محصول - چسبیده به پایین */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-slate-700">
          {/* انتخاب تعداد و افزودن به سبد خرید */}
          <div className="flex-1 flex rounded-lg overflow-hidden shadow-sm border border-slate-700 group-hover:border-secondary/30 transition-colors">
            <button
              disabled={!inStock || quantity <= 1}
              onClick={decreaseQuantity}
              className={`w-10 flex items-center justify-center ${
                !inStock || quantity <= 1 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              <FiMinus className="w-4 h-4" />
            </button>
            
            <div className="flex-1 flex items-center justify-center bg-slate-800 text-white text-sm font-medium">
              {quantity}
            </div>
            
            <button
              disabled={!inStock || (limitedStock !== undefined && quantity >= limitedStock)}
              onClick={increaseQuantity}
              className={`w-10 flex items-center justify-center ${
                !inStock || (limitedStock !== undefined && quantity >= limitedStock) 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            disabled={!inStock}
            className={`rounded-lg p-2 flex items-center justify-center transform transition-all duration-300 ${
              inStock 
                ? 'bg-secondary text-white hover:bg-secondary-dark shadow-md hover:shadow-secondary/20 hover:scale-105' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>
          
          {/* گزینه‌های بیشتر */}
          <div className="relative">
            <button 
              onClick={toggleMoreMenu}
              className="rounded-lg p-2 bg-slate-700 text-white hover:bg-slate-600 transition-colors"
            >
              <FiMoreHorizontal className="w-5 h-5" />
            </button>
            
            {isMoreMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 bg-slate-800 rounded-lg border border-slate-700 shadow-xl z-20 w-44">
                <div className="py-1">
                  <button className="flex items-center gap-2 px-3 py-2 w-full text-right text-sm text-slate-300 hover:bg-slate-700 hover:text-secondary transition-colors">
                    <FiHeart className="w-4 h-4 text-red-500" />
                    <span>افزودن به علاقه‌مندی‌ها</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-3 py-2 w-full text-right text-sm text-slate-300 hover:bg-slate-700 hover:text-secondary transition-colors">
                    <FiRefreshCw className="w-4 h-4 text-blue-500" />
                    <span>افزودن به مقایسه</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-3 py-2 w-full text-right text-sm text-slate-300 hover:bg-slate-700 hover:text-secondary transition-colors">
                    <FiShare2 className="w-4 h-4 text-green-500" />
                    <span>اشتراک‌گذاری</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 