'use client';

import React from 'react';
import Link from 'next/link';
import { FaIndustry, FaStore, FaTruck, FaChartLine, FaHandshake } from 'react-icons/fa';
import ProductSlider from '@/components/common/ProductSlider/ProductSlider';
import StoreCard from '@/components/common/StoreCard/StoreCard';
import Header from '@/components/layout/Header/Header';

// Mock data for wholesale products
const wholesaleProducts = [
  {
    id: '1',
    title: 'دستگاه تولید پلاستیک',
    price: 250000000,
    discountedPrice: null,
    image: '/images/products/plastic-machine.jpg',
    rating: 4.8,
    storeId: '1',
    storeName: 'کارخانه پلاستیک سازی',
    storeLogo: '/images/stores/plastic-factory.jpg',
    storeFloor: 9,
    category: 'ماشین‌آلات',
    brand: 'صنعت پلاستیک',
    inStock: true,
    isFeatured: false,
    isNew: false,
    isSale: false,
    isOrganic: false,
    isAntique: false,
    isWholesale: true,
  },
  {
    id: '2',
    title: 'دستگاه بسته‌بندی',
    price: 180000000,
    discountedPrice: null,
    image: '/images/products/packaging-machine.jpg',
    rating: 4.6,
    storeId: '2',
    storeName: 'تولیدکننده ماشین‌آلات',
    storeLogo: '/images/stores/machinery-factory.jpg',
    storeFloor: 9,
    category: 'ماشین‌آلات',
    brand: 'صنعت بسته‌بندی',
    inStock: true,
    isFeatured: false,
    isNew: false,
    isSale: false,
    isOrganic: false,
    isAntique: false,
    isWholesale: true,
  },
  {
    id: '3',
    title: 'دستگاه تولید کاغذ',
    price: 320000000,
    discountedPrice: null,
    image: '/images/products/paper-machine.jpg',
    rating: 4.9,
    storeId: '3',
    storeName: 'کارخانه کاغذسازی',
    storeLogo: '/images/stores/paper-factory.jpg',
    storeFloor: 9,
    category: 'ماشین‌آلات',
    brand: 'صنعت کاغذ',
    inStock: true,
    isFeatured: false,
    isNew: false,
    isSale: false,
    isOrganic: false,
    isAntique: false,
    isWholesale: true,
  },
  {
    id: '4',
    title: 'دستگاه تولید مواد غذایی',
    price: 280000000,
    discountedPrice: null,
    image: '/images/products/food-machine.jpg',
    rating: 4.7,
    storeId: '4',
    storeName: 'تولیدکننده تجهیزات غذایی',
    storeLogo: '/images/stores/food-equipment.jpg',
    storeFloor: 9,
    category: 'ماشین‌آلات',
    brand: 'صنعت غذا',
    inStock: true,
    isFeatured: false,
    isNew: false,
    isSale: false,
    isOrganic: false,
    isAntique: false,
    isWholesale: true,
  },
  {
    id: '5',
    title: 'دستگاه تولید پوشاک',
    price: 210000000,
    discountedPrice: null,
    image: '/images/products/clothing-machine.jpg',
    rating: 4.5,
    storeId: '5',
    storeName: 'کارخانه ماشین‌آلات پوشاک',
    storeLogo: '/images/stores/clothing-machinery.jpg',
    storeFloor: 9,
    category: 'ماشین‌آلات',
    brand: 'صنعت پوشاک',
    inStock: true,
    isFeatured: false,
    isNew: false,
    isSale: false,
    isOrganic: false,
    isAntique: false,
    isWholesale: true,
  },
  {
    id: '6',
    title: 'دستگاه تولید لوازم خانگی',
    price: 290000000,
    discountedPrice: null,
    image: '/images/products/appliance-machine.jpg',
    rating: 4.8,
    storeId: '6',
    storeName: 'تولیدکننده لوازم خانگی',
    storeLogo: '/images/stores/appliance-factory.jpg',
    storeFloor: 9,
    category: 'ماشین‌آلات',
    brand: 'صنعت لوازم خانگی',
    inStock: true,
    isFeatured: false,
    isNew: false,
    isSale: false,
    isOrganic: false,
    isAntique: false,
    isWholesale: true,
  },
];

// Mock data for manufacturers
const manufacturers = [
  {
    id: 1,
    name: 'کارخانه تولید پلاستیک',
    description: 'تولیدکننده انواع محصولات پلاستیکی',
    image: '/images/stores/plastic-factory.jpg',
    productCount: 120,
  },
  {
    id: 2,
    name: 'کارخانه تولید مواد غذایی',
    description: 'تولیدکننده مواد غذایی با کیفیت',
    image: '/images/stores/food-factory.jpg',
    productCount: 85,
  },
  {
    id: 3,
    name: 'کارخانه تولید پوشاک',
    description: 'تولیدکننده پوشاک با کیفیت',
    image: '/images/stores/clothing-factory.jpg',
    productCount: 150,
  },
  {
    id: 4,
    name: 'کارخانه تولید لوازم خانگی',
    description: 'تولیدکننده لوازم خانگی مدرن',
    image: '/images/stores/appliance-factory.jpg',
    productCount: 95,
  },
  {
    id: 5,
    name: 'کارخانه تولید کاغذ',
    description: 'تولیدکننده انواع کاغذ و مقوا',
    image: '/images/stores/paper-factory.jpg',
    productCount: 75,
  },
  {
    id: 6,
    name: 'کارخانه تولید مواد شوینده',
    description: 'تولیدکننده مواد شوینده با کیفیت',
    image: '/images/stores/cleaning-factory.jpg',
    productCount: 60,
  },
];

export default function ManufacturersFloorPage() {
  return (
    <div className="min-h-screen">
        <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/patterns/industry.jpg')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative p-6">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 bg-blue-800/40 text-blue-200 px-4 py-2 rounded-full text-sm font-medium border border-blue-700/30 backdrop-blur-sm mb-6">
                <FaIndustry className="text-blue-300" />
                <span>طبقه تولیدکنندگان و عمده‌فروشان</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                مرکز تولید و توزیع
              </h1>

              <p className="text-lg text-blue-200 max-w-2xl mb-8">
                مجموعه‌ای از تولیدکنندگان و عمده‌فروشان معتبر در یک مکان
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
                <div className="group bg-blue-900/40 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-800/30 hover:border-blue-700/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-800/40 rounded-xl mx-auto mb-3 group-hover:bg-blue-700/40 transition-colors">
                    <FaIndustry className="text-blue-300 text-xl group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-sm font-medium text-blue-200">تولیدکنندگان</p>
                </div>
                <div className="group bg-blue-900/40 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-800/30 hover:border-blue-700/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-800/40 rounded-xl mx-auto mb-3 group-hover:bg-blue-700/40 transition-colors">
                    <FaStore className="text-blue-300 text-xl group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-sm font-medium text-blue-200">عمده‌فروشان</p>
                </div>
                <div className="group bg-blue-900/40 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-800/30 hover:border-blue-700/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-800/40 rounded-xl mx-auto mb-3 group-hover:bg-blue-700/40 transition-colors">
                    <FaTruck className="text-blue-300 text-xl group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-sm font-medium text-blue-200">توزیع‌کنندگان</p>
                </div>
                <div className="group bg-blue-900/40 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-800/30 hover:border-blue-700/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-800/40 rounded-xl mx-auto mb-3 group-hover:bg-blue-700/40 transition-colors">
                    <FaHandshake className="text-blue-300 text-xl group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-sm font-medium text-blue-200">همکاری تجاری</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">محصولات تولیدی</h2>
          <ProductSlider products={wholesaleProducts} />
        </div>

        {/* Stores Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">تولیدکنندگان و عمده‌فروشان</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manufacturers.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 