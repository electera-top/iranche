'use client';

import { useState } from 'react';
import { FiStar, FiShoppingCart, FiTrash2, FiShare2, FiHeart, FiTag } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

interface FavoriteProduct {
  id: number;
  title: string;
  image: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  category: string;
  isAvailable: boolean;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([
    {
      id: 1,
      title: 'گوشی موبایل سامسونگ مدل Galaxy S21 Ultra 5G',
      image: '/images/products/samsung-s21.jpg',
      price: '۳۵,۴۰۰,۰۰۰ تومان',
      originalPrice: '۴۲,۰۰۰,۰۰۰ تومان',
      discount: 15,
      category: 'موبایل',
      isAvailable: true
    },
    {
      id: 2,
      title: 'هدفون بی سیم سونی مدل WH-1000XM4',
      image: '/images/products/sony-headphone.jpg',
      price: '۸,۶۰۰,۰۰۰ تومان',
      category: 'هدفون و هدست',
      isAvailable: true
    },
    {
      id: 3,
      title: 'تلویزیون ال جی OLED evo C2 55 اینچ',
      image: '/images/products/lg-tv.jpg',
      price: '۵۲,۳۰۰,۰۰۰ تومان',
      originalPrice: '۵۸,۹۰۰,۰۰۰ تومان',
      discount: 11,
      category: 'تلویزیون',
      isAvailable: true
    },
    {
      id: 4,
      title: 'ساعت هوشمند اپل واچ سری ۷',
      image: '/images/products/apple-watch.jpg',
      price: '۱۷,۸۰۰,۰۰۰ تومان',
      category: 'ساعت هوشمند',
      isAvailable: false
    }
  ]);
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'available'>('all');
  
  // حذف محصول از علاقه‌مندی‌ها
  const removeFromFavorites = (id: number) => {
    setFavorites(favorites.filter(product => product.id !== id));
  };
  
  // فیلتر محصولات موجود
  const filteredFavorites = activeFilter === 'all' 
    ? favorites 
    : favorites.filter(product => product.isAvailable);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FiHeart className="ml-2 text-red-400" />
          علاقه‌مندی‌های من
        </h1>
        <p className="text-gray-400">لیست محصولات مورد علاقه شما</p>
      </div>
      
      {/* فیلترها */}
      <div className="mb-6">
        <div className="flex gap-3">
          <Button
            variant={activeFilter === 'all' ? 'primary' : 'outline'}
            className={`${activeFilter === 'all' ? '' : 'border-primary-700/50 text-gray-300'}`}
            onClick={() => setActiveFilter('all')}
          >
            همه محصولات ({favorites.length})
          </Button>
          <Button
            variant={activeFilter === 'available' ? 'primary' : 'outline'}
            className={`${activeFilter === 'available' ? '' : 'border-primary-700/50 text-gray-300'}`}
            onClick={() => setActiveFilter('available')}
          >
            فقط موجود ({favorites.filter(p => p.isAvailable).length})
          </Button>
        </div>
      </div>
      
      {/* لیست علاقه‌مندی‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFavorites.length > 0 ? (
          filteredFavorites.map((product) => (
            <div 
              key={product.id} 
              className="bg-primary-800/30 border border-primary-700/30 rounded-lg overflow-hidden hover:border-primary-600/50 transition-all group"
            >
              <div className="relative p-6 bg-primary-800/50 flex items-center justify-center h-48">
                <div className="absolute top-2 left-2 z-10 flex gap-1">
                  <button 
                    className="p-2 bg-primary-900/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-white transition-colors"
                    onClick={() => removeFromFavorites(product.id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                  <button className="p-2 bg-primary-900/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-white transition-colors">
                    <FiShare2 size={18} />
                  </button>
                </div>
                
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs py-1 px-2 rounded-lg font-bold">
                    {product.discount}٪ تخفیف
                  </div>
                )}
                
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-primary-950/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <span className="bg-red-500/20 text-red-400 py-1.5 px-4 rounded-lg border border-red-500/30">
                      ناموجود
                    </span>
                  </div>
                )}
                
                <img 
                  src={product.image || '/images/placeholder-product.jpg'} 
                  alt={product.title}
                  className="h-full w-auto object-contain max-w-full transition-transform group-hover:scale-105"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-primary-700/50 text-blue-400 rounded text-xs">
                    <FiTag size={12} />
                  </div>
                  <span className="text-gray-400 text-xs">{product.category}</span>
                </div>
                
                <h3 className="text-white font-medium mb-3 h-12 overflow-hidden text-ellipsis line-clamp-2">
                  {product.title}
                </h3>
                
                <div className="flex justify-between items-end">
                  <div>
                    {product.originalPrice && (
                      <span className="text-gray-400 text-sm line-through mb-1 block">
                        {product.originalPrice}
                      </span>
                    )}
                    <span className="text-white font-bold text-lg">{product.price}</span>
                  </div>
                  
                  <Button
                    variant="primary"
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                    disabled={!product.isAvailable}
                  >
                    <FiShoppingCart size={16} />
                    <span className="text-sm">افزودن</span>
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-8 text-center col-span-full">
            <div className="flex justify-center mb-4">
              <FiStar className="text-gray-400 text-5xl" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">لیست علاقه‌مندی‌های شما خالی است</h3>
            <p className="text-gray-400 mb-4">محصولات مورد علاقه خود را به این لیست اضافه کنید.</p>
            <Button 
              variant="primary"
              className="inline-flex items-center justify-center gap-2"
            >
              مشاهده محصولات
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 