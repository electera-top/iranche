'use client';

import React from 'react';
import Header from '@/components/layout/Header/Header';
import ProductCard from '@/components/common/ProductCard';
import { FaClock, FaStore, FaChevronLeft, FaHistory, FaGem, FaBook, FaPaintBrush, FaCoins, FaCrown } from 'react-icons/fa';

// Mock data for rare and antique products
const rareProducts = [
  {
    id: '1',
    title: 'ساعت دیواری آنتیک',
    price: 8500000,
    discountedPrice: null,
    image: '/images/products/antique-clock.jpg',
    rating: 4.9,
    storeId: 'store1',
    storeName: 'عتیقه‌سرای تهران',
    storeLogo: '/images/stores/antique-store.jpg',
    storeFloor: 8,
    category: 'ساعت',
    isNew: false,
    isBestseller: true,
    isRare: true,
    isAntique: true,
    inStock: true,
  },
  {
    id: '2',
    title: 'مجسمه برنزی قدیمی',
    price: 12000000,
    discountedPrice: 11000000,
    image: '/images/products/bronze-statue.jpg',
    rating: 4.8,
    storeId: 'store2',
    storeName: 'گالری هنرهای قدیمی',
    storeLogo: '/images/stores/art-gallery.jpg',
    storeFloor: 8,
    category: 'مجسمه',
    isNew: false,
    isBestseller: false,
    isRare: true,
    isAntique: true,
    inStock: true,
  },
  {
    id: '3',
    title: 'سکه طلای قاجاری',
    price: 15000000,
    discountedPrice: null,
    image: '/images/products/coin.jpg',
    rating: 4.9,
    storeId: 'store3',
    storeName: 'موزه سکه',
    storeLogo: '/images/stores/coin-museum.jpg',
    storeFloor: 8,
    category: 'سکه',
    isNew: false,
    isBestseller: true,
    isRare: true,
    isAntique: true,
    inStock: true,
  },
  {
    id: '4',
    title: 'فرش دستباف قدیمی',
    price: 25000000,
    discountedPrice: 23000000,
    image: '/images/products/carpet.jpg',
    rating: 4.7,
    storeId: 'store4',
    storeName: 'فرش‌سرای اصفهان',
    storeLogo: '/images/stores/carpet-store.jpg',
    storeFloor: 8,
    category: 'فرش',
    isNew: false,
    isBestseller: true,
    isRare: true,
    isAntique: true,
    inStock: true,
  },
  {
    id: '5',
    title: 'قلمدان خاتم کاری',
    price: 9500000,
    discountedPrice: null,
    image: '/images/products/pen-case.jpg',
    rating: 4.8,
    storeId: 'store5',
    storeName: 'هنرهای سنتی',
    storeLogo: '/images/stores/traditional-arts.jpg',
    storeFloor: 8,
    category: 'خاتم',
    isNew: false,
    isBestseller: false,
    isRare: true,
    isAntique: true,
    inStock: true,
  },
  {
    id: '6',
    title: 'آینه قدیمی نقره‌کاری',
    price: 18000000,
    discountedPrice: 17000000,
    image: '/images/products/mirror.jpg',
    rating: 4.9,
    storeId: 'store6',
    storeName: 'آینه‌سرای قزوین',
    storeLogo: '/images/stores/mirror-store.jpg',
    storeFloor: 8,
    category: 'آینه',
    isNew: false,
    isBestseller: true,
    isRare: true,
    isAntique: true,
    inStock: true,
  },
];

// Mock data for antique stores
const antiqueStores = [
  {
    id: 1,
    name: 'عتیقه‌سرای تهران',
    description: 'مجموعه‌ای از نفیس‌ترین آثار تاریخی',
    image: '/images/stores/antique-store.jpg',
    products: 25,
  },
  {
    id: 2,
    name: 'گالری هنرهای قدیمی',
    description: 'نمایشگاه آثار هنری و تاریخی',
    image: '/images/stores/art-gallery.jpg',
    products: 18,
  },
  {
    id: 3,
    name: 'موزه سکه',
    description: 'مجموعه‌ای از سکه‌های تاریخی',
    image: '/images/stores/coin-museum.jpg',
    products: 12,
  },
  {
    id: 4,
    name: 'فرش‌سرای اصفهان',
    description: 'فرش‌های دستباف قدیمی',
    image: '/images/stores/carpet-store.jpg',
    products: 15,
  },
  {
    id: 5,
    name: 'هنرهای سنتی',
    description: 'آثار خاتم کاری و منبت کاری',
    image: '/images/stores/traditional-arts.jpg',
    products: 20,
  },
  {
    id: 6,
    name: 'آینه‌سرای قزوین',
    description: 'آینه‌های قدیمی و نقره‌کاری',
    image: '/images/stores/mirror-store.jpg',
    products: 10,
  },
];

export default function AntiqueFloorPage() {
  return (
    <div className="min-h-screen bg-primary-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/patterns/antique.jpg')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-12 h-12 bg-amber-400/20 rounded-full animate-float"></div>
            <div className="absolute top-40 left-40 w-10 h-10 bg-yellow-400/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-20 right-40 w-14 h-14 bg-orange-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-40 left-20 w-8 h-8 bg-amber-400/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
          </div>

          {/* Content */}
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Text Content */}
              <div className="text-center md:text-right space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-amber-800/40 text-amber-200 px-6 py-3 rounded-full text-sm font-medium border border-amber-700/30 backdrop-blur-sm">
                    <FaHistory className="text-amber-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span>طبقه محصولات نایاب و عتیقه</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                    گنجینه‌ای از تاریخ
                  </h1>
                  <p className="text-xl text-amber-200 max-w-2xl leading-relaxed">
                    مجموعه‌ای نفیس از آثار تاریخی، عتیقه‌جات و محصولات نایاب
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="group bg-amber-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-800/30 hover:border-amber-700/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 bg-amber-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-amber-700/40 transition-colors">
                      <FaHistory className="text-amber-300 text-2xl group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-base font-medium text-amber-200">آثار تاریخی</p>
                  </div>
                  <div className="group bg-amber-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-800/30 hover:border-amber-700/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 bg-amber-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-amber-700/40 transition-colors">
                      <FaGem className="text-amber-300 text-2xl group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-base font-medium text-amber-200">عتیقه‌جات</p>
                  </div>
                  <div className="group bg-amber-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-800/30 hover:border-amber-700/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 bg-amber-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-amber-700/40 transition-colors">
                      <FaClock className="text-amber-300 text-2xl group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-base font-medium text-amber-200">محصولات نایاب</p>
                  </div>
                  <div className="group bg-amber-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-800/30 hover:border-amber-700/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 bg-amber-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-amber-700/40 transition-colors">
                      <FaStore className="text-amber-300 text-2xl group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-base font-medium text-amber-200">فروشگاه‌های معتبر</p>
                  </div>
                </div>
              </div>

              {/* Image/Icon Section */}
              <div className="hidden md:block">
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-amber-800 to-yellow-800 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-[url('/images/patterns/antique.png')] opacity-10 rounded-full"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-amber-700/30 animate-pulse"></div>
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-32 h-32 bg-amber-900/40 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                        <FaHistory className="text-6xl text-amber-300 animate-spin-slow" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-2xl font-bold text-white">محصولات عتیقه</p>
                        <p className="text-base text-amber-200">نایاب و تاریخی</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-yellow-800 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <FaGem className="text-3xl text-amber-300 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">محصولات برتر</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-400">نمایش همه</span>
              <FaChevronLeft className="text-amber-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rareProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">دسته‌بندی محصولات</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-400">نمایش همه</span>
              <FaChevronLeft className="text-amber-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div className="group bg-amber-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-800/30 hover:border-amber-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-amber-700/40 transition-colors">
                <FaClock className="text-amber-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-amber-200 text-center">ساعت‌های قدیمی</p>
            </div>
            <div className="group bg-amber-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-800/30 hover:border-amber-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-amber-700/40 transition-colors">
                <FaGem className="text-amber-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-amber-200 text-center">جواهرات عتیقه</p>
            </div>
            <div className="group bg-amber-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-800/30 hover:border-amber-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-amber-700/40 transition-colors">
                <FaBook className="text-amber-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-amber-200 text-center">کتاب‌های نایاب</p>
            </div>
            <div className="group bg-amber-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-800/30 hover:border-amber-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-amber-700/40 transition-colors">
                <FaPaintBrush className="text-amber-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-amber-200 text-center">نقاشی‌های قدیمی</p>
            </div>
            <div className="group bg-amber-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-800/30 hover:border-amber-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-amber-700/40 transition-colors">
                <FaCoins className="text-amber-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-amber-200 text-center">سکه‌های قدیمی</p>
            </div>
            <div className="group bg-amber-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-800/30 hover:border-amber-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-amber-700/40 transition-colors">
                <FaCrown className="text-amber-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-amber-200 text-center">اشیاء سلطنتی</p>
            </div>
          </div>
        </div>

        {/* Stores Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">فروشگاه‌های عتیقه</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-400">نمایش همه</span>
              <FaChevronLeft className="text-amber-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {antiqueStores.map((store) => (
              <div
                key={store.id}
                className="bg-amber-900/40 rounded-xl p-6 hover:bg-amber-800/40 transition-colors"
              >
                <div className="aspect-video bg-amber-800/20 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{store.name}</h3>
                <p className="text-sm text-amber-200 mb-4">{store.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-400">
                    {store.products} محصول
                  </span>
                  <button className="text-sm text-white bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg transition-colors">
                    مشاهده فروشگاه
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 