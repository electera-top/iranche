'use client';

import React from 'react';
import Header from '@/components/layout/Header/Header';
import ProductSlider from '@/components/common/ProductSlider/ProductSlider';
import { FaLeaf, FaStore, FaChevronLeft, FaHeart } from 'react-icons/fa';

// Mock data for organic and local products
const organicProducts = [
  {
    id: '1',
    title: 'عسل طبیعی کوهستان',
    price: 250000,
    discountedPrice: null,
    image: '/images/products/honey.jpg',
    rating: 4.8,
    storeId: 'store1',
    storeName: 'عسل‌سرای کوهستان',
    storeLogo: '/images/stores/honey-store.jpg',
    storeFloor: 7,
    category: 'عسل',
    isNew: true,
    isBestseller: true,
    isOrganic: true,
    isLocal: true,
    inStock: true,
  },
  {
    id: '2',
    title: 'روغن زیتون ارگانیک',
    price: 180000,
    discountedPrice: 160000,
    image: '/images/products/olive-oil.jpg',
    rating: 4.6,
    storeId: 'store2',
    storeName: 'مزرعه زیتون شمال',
    storeLogo: '/images/stores/olive-store.jpg',
    storeFloor: 7,
    category: 'روغن',
    isNew: true,
    isBestseller: false,
    isOrganic: true,
    isLocal: true,
    inStock: true,
  },
  {
    id: '3',
    title: 'چای سبز ارگانیک',
    price: 95000,
    discountedPrice: null,
    image: '/images/products/green-tea.jpg',
    rating: 4.7,
    storeId: 'store3',
    storeName: 'چای‌سرای گیلان',
    storeLogo: '/images/stores/tea-store.jpg',
    storeFloor: 7,
    category: 'چای',
    isNew: false,
    isBestseller: true,
    isOrganic: true,
    isLocal: true,
    inStock: true,
  },
  {
    id: '4',
    title: 'عسل گون',
    price: 220000,
    discountedPrice: 200000,
    image: '/images/products/gon-honey.jpg',
    rating: 4.9,
    storeId: 'store1',
    storeName: 'عسل‌سرای کوهستان',
    storeLogo: '/images/stores/honey-store.jpg',
    storeFloor: 7,
    category: 'عسل',
    isNew: false,
    isBestseller: true,
    isOrganic: true,
    isLocal: true,
    inStock: true,
  },
  {
    id: '5',
    title: 'روغن کنجد محلی',
    price: 150000,
    discountedPrice: null,
    image: '/images/products/sesame-oil.jpg',
    rating: 4.5,
    storeId: 'store4',
    storeName: 'روغن‌سرای اصفهان',
    storeLogo: '/images/stores/oil-store.jpg',
    storeFloor: 7,
    category: 'روغن',
    isNew: true,
    isBestseller: false,
    isOrganic: true,
    isLocal: true,
    inStock: true,
  },
  {
    id: '6',
    title: 'زعفران قائنات',
    price: 320000,
    discountedPrice: 300000,
    image: '/images/products/saffron.jpg',
    rating: 4.8,
    storeId: 'store5',
    storeName: 'زعفران‌سرای خراسان',
    storeLogo: '/images/stores/saffron-store.jpg',
    storeFloor: 7,
    category: 'زعفران',
    isNew: false,
    isBestseller: true,
    isOrganic: true,
    isLocal: true,
    inStock: true,
  },
];

// Mock data for local stores
const localStores = [
  {
    id: 1,
    name: 'عسل‌سرای کوهستان',
    description: 'تولید کننده عسل طبیعی و ارگانیک',
    image: '/images/stores/honey-store.jpg',
    products: 12,
  },
  {
    id: 2,
    name: 'مزرعه زیتون شمال',
    description: 'تولید کننده روغن زیتون ارگانیک',
    image: '/images/stores/olive-store.jpg',
    products: 8,
  },
  {
    id: 3,
    name: 'چای‌سرای گیلان',
    description: 'تولید کننده چای سبز ارگانیک',
    image: '/images/stores/tea-store.jpg',
    products: 15,
  },
  {
    id: 4,
    name: 'روغن‌سرای اصفهان',
    description: 'تولید کننده روغن کنجد محلی',
    image: '/images/stores/oil-store.jpg',
    products: 10,
  },
  {
    id: 5,
    name: 'زعفران‌سرای خراسان',
    description: 'تولید کننده زعفران مرغوب',
    image: '/images/stores/saffron-store.jpg',
    products: 6,
  },
];

export default function OrganicFloorPage() {
  return (
    <div className="min-h-screen bg-primary-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/patterns/leaves.jpg')] opacity-5"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Text Content */}
              <div className="text-center md:text-right space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    <FaLeaf className="text-green-600" />
                    <span>طبقه محصولات ارگانیک</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900">
                    طبیعت در دستان شما
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl">
                    محصولات طبیعی و ارگانیک از بهترین تولیدکنندگان محلی، برای سلامتی شما و خانواده‌تان
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-green-100">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                      <FaLeaf className="text-green-600 text-xl" />
                    </div>
                    <p className="text-sm text-gray-700">محصولات ارگانیک</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-green-100">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                      <FaStore className="text-green-600 text-xl" />
                    </div>
                    <p className="text-sm text-gray-700">تولیدکنندگان محلی</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-green-100">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                      <FaHeart className="text-green-600 text-xl" />
                    </div>
                    <p className="text-sm text-gray-700">تضمین کیفیت</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-green-100">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                      <FaLeaf className="text-green-600 text-xl" />
                    </div>
                    <p className="text-sm text-gray-700">محصولات طبیعی</p>
                  </div>
                </div>
              </div>

              {/* Image/Icon Section */}
              <div className="hidden md:block">
                <div className="relative">
                  <div className="w-64 h-64 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-lg">
                    <div className="absolute inset-0 bg-[url('/images/patterns/leaves.png')] opacity-10 rounded-full"></div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
                        <FaLeaf className="text-5xl text-green-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-800">محصولات ارگانیک</p>
                        <p className="text-sm text-gray-600">طبیعی و سالم</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center shadow-md">
                    <FaHeart className="text-2xl text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">محصولات ارگانیک و محلی</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-emerald-400">نمایش همه</span>
              <FaChevronLeft className="text-emerald-400" />
            </div>
          </div>
          <ProductSlider products={organicProducts} />
        </div>

        {/* Stores Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">فروشگاه‌های محلی</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-emerald-400">نمایش همه</span>
              <FaChevronLeft className="text-emerald-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {localStores.map((store) => (
              <div
                key={store.id}
                className="bg-primary-900 rounded-xl p-6 hover:bg-primary-800 transition-colors"
              >
                <div className="aspect-video bg-primary-800 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{store.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{store.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-400">
                    {store.products} محصول
                  </span>
                  <button className="text-sm text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-colors">
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