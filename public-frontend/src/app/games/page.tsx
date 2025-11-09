'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiStar, FiPlay, FiShoppingCart, FiUsers, FiClock, FiAward, FiArrowLeft, FiHeart, FiDownload } from 'react-icons/fi';
import Header from '@/components/layout/Header/Header';
import Button from '@/components/ui/button/Button';

// رابط برای بازی آنلاین
interface OnlineGame {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  players: number;
  rating: number;
  isMultiplayer: boolean;
  isPremium: boolean;
  description: string;
}

// رابط برای محصول اسباب بازی
interface ToyProduct {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  discountedPrice?: number;
  rating: number;
  ageRange: string;
  category: string;
  brand: string;
  isAvailable: boolean;
}

export default function GamesAndToysPage() {
  const [onlineGames, setOnlineGames] = useState<OnlineGame[]>([]);
  const [toyProducts, setToyProducts] = useState<ToyProduct[]>([]);
  const [featuredGame, setFeaturedGame] = useState<OnlineGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // شبیه‌سازی دریافت داده از API
    setTimeout(() => {
      // بازی‌های آنلاین نمونه
      const games: OnlineGame[] = [
        {
          id: '1',
          title: 'شطرنج آنلاین',
          thumbnail: '/images/games/chess.jpg',
          category: 'فکری',
          players: 8420,
          rating: 4.8,
          isMultiplayer: true,
          isPremium: false,
          description: 'بازی شطرنج آنلاین با امکان رقابت با دیگر کاربران یا هوش مصنوعی در سطوح مختلف'
        },
        {
          id: '2',
          title: 'پازل خانه‌سازی',
          thumbnail: '/images/games/puzzle.jpg',
          category: 'پازل',
          players: 5230,
          rating: 4.5,
          isMultiplayer: false,
          isPremium: false,
          description: 'پازل سرگرم‌کننده برای طراحی و ساخت خانه‌های رویایی با المان‌های مختلف'
        },
        {
          id: '3',
          title: 'مسابقه اتومبیلرانی',
          thumbnail: '/images/games/racing.jpg',
          category: 'مسابقه‌ای',
          players: 12480,
          rating: 4.7,
          isMultiplayer: true,
          isPremium: true,
          description: 'مسابقه هیجان‌انگیز اتومبیلرانی با گرافیک فوق‌العاده و امکان رقابت آنلاین'
        },
        {
          id: '4',
          title: 'نبرد قهرمانان',
          thumbnail: '/images/games/battle.jpg',
          category: 'اکشن',
          players: 15670,
          rating: 4.6,
          isMultiplayer: true,
          isPremium: true,
          description: 'بازی اکشن چندنفره با شخصیت‌های متنوع و قابلیت‌های ویژه'
        },
        {
          id: '5',
          title: 'مدیریت مزرعه',
          thumbnail: '/images/games/farm.jpg',
          category: 'شبیه‌سازی',
          players: 6840,
          rating: 4.4,
          isMultiplayer: false,
          isPremium: false,
          description: 'بازی شبیه‌سازی مزرعه‌داری با امکان کاشت، برداشت و فروش محصولات'
        },
        {
          id: '6',
          title: 'جواهرات سحرآمیز',
          thumbnail: '/images/games/jewel.jpg',
          category: 'تطبیق',
          players: 9250,
          rating: 4.3,
          isMultiplayer: false,
          isPremium: false,
          description: 'بازی تطبیق سه یا بیشتر با جواهرات رنگارنگ و مراحل چالش‌برانگیز'
        }
      ];

      // محصولات اسباب‌بازی نمونه
      const toys: ToyProduct[] = [
        {
          id: '101',
          title: 'اسباب بازی آموزشی ایران کودک',
          thumbnail: '/images/toys/toy1.jpg',
          price: 580000,
          discountedPrice: 480000,
          rating: 4.7,
          ageRange: '۳ تا ۶ سال',
          category: 'آموزشی',
          brand: 'ایران کودک',
          isAvailable: true
        },
        {
          id: '102',
          title: 'ماشین کنترلی آفرود',
          thumbnail: '/images/toys/toy2.jpg',
          price: 1250000,
          rating: 4.5,
          ageRange: '۷ تا ۱۲ سال',
          category: 'ماشین کنترلی',
          brand: 'کیان تویز',
          isAvailable: true
        },
        {
          id: '103',
          title: 'پازل ۱۰۰۰ تکه نقشه ایران',
          thumbnail: '/images/toys/toy3.jpg',
          price: 320000,
          discountedPrice: 290000,
          rating: 4.8,
          ageRange: '۸ سال به بالا',
          category: 'پازل',
          brand: 'فکرآوران',
          isAvailable: true
        },
        {
          id: '104',
          title: 'عروسک سخنگوی ایرانی',
          thumbnail: '/images/toys/toy4.jpg',
          price: 750000,
          rating: 4.6,
          ageRange: '۳ تا ۸ سال',
          category: 'عروسک',
          brand: 'مهسان تویز',
          isAvailable: true
        },
        {
          id: '105',
          title: 'بازی فکری چوبی مبتکران',
          thumbnail: '/images/toys/toy5.jpg',
          price: 420000,
          rating: 4.4,
          ageRange: '۶ سال به بالا',
          category: 'بازی فکری',
          brand: 'مبتکران',
          isAvailable: false
        },
        {
          id: '106',
          title: 'اسلایم رنگارنگ سرگرمی',
          thumbnail: '/images/toys/toy6.jpg',
          price: 150000,
          discountedPrice: 120000,
          rating: 4.3,
          ageRange: '۵ سال به بالا',
          category: 'سرگرمی',
          brand: 'فان پلی',
          isAvailable: true
        },
        {
          id: '107',
          title: 'ربات هوشمند آموزشی',
          thumbnail: '/images/toys/toy7.jpg',
          price: 1850000,
          rating: 4.9,
          ageRange: '۸ سال به بالا',
          category: 'رباتیک',
          brand: 'تک‌آوران',
          isAvailable: true
        },
        {
          id: '108',
          title: 'میکروسکوپ کودک و نوجوان',
          thumbnail: '/images/toys/toy8.jpg',
          price: 650000,
          discountedPrice: 590000,
          rating: 4.7,
          ageRange: '۸ سال به بالا',
          category: 'علمی',
          brand: 'دانش آموز',
          isAvailable: true
        },
      ];

      setOnlineGames(games);
      setToyProducts(toys);
      setFeaturedGame(games[2]); // انتخاب بازی ویژه
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      
      {/* بنر اصلی */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          src="/images/games/banner.jpg" 
          alt="بازی و سرگرمی" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">بازی و سرگرمی ایرانچه</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">تجربه لذت بخش بازی‌های آنلاین و محصولات سرگرمی با کیفیت</p>
          <Button 
            variant="secondary" 
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            <FiPlay className="ml-2" />
            مشاهده همه بازی‌ها
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* بازی ویژه */}
        {featuredGame && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FiAward className="ml-2 text-secondary" />
              بازی ویژه
            </h2>
            
            <div className="bg-primary-900 rounded-xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-72 md:h-auto overflow-hidden">
                  <img 
                    src={featuredGame.thumbnail} 
                    alt={featuredGame.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center justify-center md:hidden">
                    <Link href={`/games/${featuredGame.id}`}>
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                      >
                        <FiPlay className="ml-2" />
                        بازی کنید
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">{featuredGame.title}</h3>
                    {featuredGame.isPremium ? (
                      <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 px-3 py-1 rounded-full text-xs font-bold">ویژه</span>
                    ) : (
                      <span className="bg-gradient-to-r from-green-500 to-green-600 text-green-950 px-3 py-1 rounded-full text-xs font-bold">رایگان</span>
                    )}
                  </div>
                  
                  <p className="text-gray-300 mb-6">{featuredGame.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-primary-950/40 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-secondary">{featuredGame.players.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">بازیکن آنلاین</div>
                    </div>
                    <div className="bg-primary-950/40 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold flex items-center justify-center text-yellow-400">
                        {featuredGame.rating} <FiStar className="mr-1 fill-current" />
                      </div>
                      <div className="text-sm text-gray-400">امتیاز بازی</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-primary-800/50 px-3 py-1 rounded-full text-sm">{featuredGame.category}</span>
                    <span className="bg-primary-800/50 px-3 py-1 rounded-full text-sm">
                      {featuredGame.isMultiplayer ? 'چندنفره' : 'تک‌نفره'}
                    </span>
                  </div>
                  
                  <div className="mt-auto flex gap-3">
                    <Link href={`/games/${featuredGame.id}`} className="flex-1">
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                      >
                        <FiPlay className="ml-2" />
                        بازی کنید
                      </Button>
                    </Link>
                    <Button 
                      variant="outline-secondary" 
                      size="lg" 
                      className="border-primary-700 hover:bg-primary-800/70"
                    >
                      <FiHeart />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* بازی‌های آنلاین */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <FiPlay className="ml-2 text-secondary" />
              بازی‌های آنلاین
            </h2>
            <Link href="/games" className="text-secondary flex items-center hover:text-secondary-light transition-colors">
              مشاهده همه 
              <FiArrowLeft className="mr-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {onlineGames.slice(0, 6).map((game) => (
              <div 
                key={game.id}
                className="bg-primary-900 rounded-xl overflow-hidden shadow-xl hover:translate-y-[-5px] transition-transform duration-300"
              >
                <div className="relative h-44">
                  <img 
                    src={game.thumbnail} 
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  {game.isPremium ? (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 px-2 py-1 rounded-lg text-xs font-bold">
                      ویژه
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-green-600 text-green-950 px-2 py-1 rounded-lg text-xs font-bold">
                      رایگان
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{game.title}</h3>
                  
                  <div className="flex justify-between text-sm mb-4">
                    <div className="flex items-center">
                      <FiUsers className="ml-1 text-gray-400" />
                      <span className="text-gray-400">{game.players.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400">{game.rating}</span>
                      <FiStar className="mr-1 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary-800/50 px-2 py-1 rounded-lg text-xs">{game.category}</span>
                    <span className="bg-primary-800/50 px-2 py-1 rounded-lg text-xs">
                      {game.isMultiplayer ? 'چندنفره' : 'تک‌نفره'}
                    </span>
                  </div>
                </div>
                
                <Link href={`/games/${game.id}`}>
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full rounded-t-none bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  >
                    <FiPlay className="ml-2" />
                    بازی کنید
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <hr className="border-primary-700 my-12" />
        
        {/* محصولات اسباب بازی */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <FiShoppingCart className="ml-2 text-secondary" />
              اسباب بازی‌های ایرانچه
            </h2>
            <Link href="/toys" className="text-secondary flex items-center hover:text-secondary-light transition-colors">
              مشاهده همه 
              <FiArrowLeft className="mr-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {toyProducts.map((toy) => (
              <div 
                key={toy.id}
                className="bg-primary-900 rounded-xl overflow-hidden shadow-xl hover:translate-y-[-5px] transition-transform duration-300"
              >
                <div className="relative h-44">
                  <img 
                    src={toy.thumbnail} 
                    alt={toy.title}
                    className="w-full h-full object-cover"
                  />
                  {toy.discountedPrice && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      {Math.round((1 - toy.discountedPrice / toy.price) * 100)}% تخفیف
                    </div>
                  )}
                  {!toy.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold">ناموجود</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{toy.title}</h3>
                  
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400">{toy.brand}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">{toy.rating}</span>
                      <FiStar className="mr-1 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <FiClock className="text-gray-400" />
                    <span className="text-sm text-gray-400">مناسب برای {toy.ageRange}</span>
                  </div>
                  
                  <div className="bg-primary-800/50 px-2 py-1 rounded-lg text-xs inline-block mb-4">
                    {toy.category}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    {toy.discountedPrice ? (
                      <div>
                        <span className="text-gray-400 line-through text-sm">{toy.price.toLocaleString()}</span>
                        <div className="font-bold text-white">{toy.discountedPrice.toLocaleString()} تومان</div>
                      </div>
                    ) : (
                      <div className="font-bold text-white">{toy.price.toLocaleString()} تومان</div>
                    )}
                    
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="border-secondary/30 hover:bg-secondary/10"
                      disabled={!toy.isAvailable}
                    >
                      <FiShoppingCart />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
       
      </div>
    </div>
  );
}
