'use client';

import React from 'react';
import { FaTools, FaHandshake, FaUserTie, FaBriefcase, FaChevronLeft } from 'react-icons/fa';
import ProductCard from '@/components/common/ProductCard';
import Header from '@/components/layout/Header/Header';

// Mock data for service products
const serviceProducts = [
  {
    id: '1',
    title: 'خدمات مشاوره کسب و کار',
    price: 1500000,
    discountedPrice: null,
    image: '/images/services/business-consulting.jpg',
    rating: 4.8,
    storeId: '1',
    storeName: 'مشاوران برتر',
    storeLogo: '/images/stores/consulting.jpg',
    storeFloor: 10,
    storeUnit: 'A12',
    category: 'مشاوره',
    inStock: true,
  },
  {
    id: '2',
    title: 'خدمات طراحی گرافیک',
    price: 800000,
    discountedPrice: null,
    image: '/images/services/graphic-design.jpg',
    rating: 4.9,
    storeId: '2',
    storeName: 'استودیو طراحی',
    storeLogo: '/images/stores/design.jpg',
    storeFloor: 10,
    storeUnit: 'B15',
    category: 'طراحی',
    inStock: true,
  },
  {
    id: '3',
    title: 'خدمات حسابداری',
    price: 1200000,
    discountedPrice: null,
    image: '/images/services/accounting.jpg',
    rating: 4.7,
    storeId: '3',
    storeName: 'موسسه حسابداری',
    storeLogo: '/images/stores/accounting.jpg',
    storeFloor: 10,
    storeUnit: 'C08',
    category: 'مالی',
    inStock: true,
  },
  {
    id: '4',
    title: 'خدمات حقوقی',
    price: 2000000,
    discountedPrice: null,
    image: '/images/services/legal.jpg',
    rating: 4.9,
    storeId: '4',
    storeName: 'موسسه حقوقی',
    storeLogo: '/images/stores/legal.jpg',
    storeFloor: 10,
    storeUnit: 'D22',
    category: 'حقوقی',
    inStock: true,
  },
  {
    id: '5',
    title: 'خدمات بازاریابی',
    price: 1800000,
    discountedPrice: null,
    image: '/images/services/marketing.jpg',
    rating: 4.8,
    storeId: '5',
    storeName: 'آژانس بازاریابی',
    storeLogo: '/images/stores/marketing.jpg',
    storeFloor: 10,
    storeUnit: 'E17',
    category: 'بازاریابی',
    inStock: true,
  },
  {
    id: '6',
    title: 'خدمات ترجمه',
    price: 600000,
    discountedPrice: null,
    image: '/images/services/translation.jpg',
    rating: 4.7,
    storeId: '6',
    storeName: 'موسسه ترجمه',
    storeLogo: '/images/stores/translation.jpg',
    storeFloor: 10,
    storeUnit: 'F09',
    category: 'ترجمه',
    inStock: true,
  },
];

// Mock data for service businesses
const serviceBusinesses = [
  {
    id: 1,
    name: 'مشاوران برتر',
    description: 'ارائه خدمات مشاوره کسب و کار و مدیریت',
    image: '/images/stores/consulting.jpg',
    productCount: 12,
  },
  {
    id: 2,
    name: 'استودیو طراحی',
    description: 'طراحی گرافیک و برندینگ',
    image: '/images/stores/design.jpg',
    productCount: 8,
  },
  {
    id: 3,
    name: 'موسسه حسابداری',
    description: 'خدمات حسابداری و مالی',
    image: '/images/stores/accounting.jpg',
    productCount: 15,
  },
  {
    id: 4,
    name: 'موسسه حقوقی',
    description: 'مشاوره حقوقی و وکالت',
    image: '/images/stores/legal.jpg',
    productCount: 10,
  },
  {
    id: 5,
    name: 'آژانس بازاریابی',
    description: 'خدمات دیجیتال مارکتینگ',
    image: '/images/stores/marketing.jpg',
    productCount: 20,
  },
  {
    id: 6,
    name: 'موسسه ترجمه',
    description: 'ترجمه تخصصی و همزمان',
    image: '/images/stores/translation.jpg',
    productCount: 25,
  },
];

export default function ServiceFloorPage() {
  return (
    <div className="min-h-screen bg-primary-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/patterns/business.avif')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-12 h-12 bg-purple-400/20 rounded-full animate-float"></div>
            <div className="absolute top-40 left-40 w-10 h-10 bg-indigo-400/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-20 right-40 w-14 h-14 bg-blue-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-40 left-20 w-8 h-8 bg-purple-400/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
          </div>

          {/* Content */}
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Text Content */}
              <div className="text-center md:text-right space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-purple-800/40 text-purple-200 px-6 py-3 rounded-full text-sm font-medium border border-purple-700/30 backdrop-blur-sm">
                    <FaUserTie className="text-purple-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span>طبقه مشاغل خدماتی</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                    خدمات تخصصی کسب و کار
                  </h1>
                  <p className="text-xl text-purple-200 max-w-2xl leading-relaxed">
                    دسترسی به بهترین خدمات کسب و کار، مشاوره، طراحی و سایر خدمات تخصصی
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="group bg-purple-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 bg-purple-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-purple-700/40 transition-colors">
                      <FaUserTie className="text-purple-300 text-2xl group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-base font-medium text-purple-200">مشاوره کسب و کار</p>
                  </div>
                  <div className="group bg-purple-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 bg-purple-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-purple-700/40 transition-colors">
                      <FaTools className="text-purple-300 text-2xl group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-base font-medium text-purple-200">خدمات تخصصی</p>
                  </div>
                  <div className="group bg-purple-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 bg-purple-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-purple-700/40 transition-colors">
                      <FaHandshake className="text-purple-300 text-2xl group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-base font-medium text-purple-200">مشاوره حقوقی</p>
                  </div>
                  <div className="group bg-purple-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 bg-purple-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-purple-700/40 transition-colors">
                      <FaBriefcase className="text-purple-300 text-2xl group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-base font-medium text-purple-200">خدمات مالی</p>
                  </div>
                </div>
              </div>

              {/* Image/Icon Section */}
              <div className="hidden md:block">
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-purple-800 to-indigo-800 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-[url('/images/patterns/business.png')] opacity-10 rounded-full"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-purple-700/30 animate-pulse"></div>
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-32 h-32 bg-purple-900/40 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                        <FaUserTie className="text-6xl text-purple-300 animate-spin-slow" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-2xl font-bold text-white">خدمات تخصصی</p>
                        <p className="text-base text-purple-200">مشاوره و کسب و کار</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-indigo-800 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <FaBriefcase className="text-3xl text-purple-300 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">خدمات برتر</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-400">نمایش همه</span>
              <FaChevronLeft className="text-purple-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {serviceProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Service Categories Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">دسته‌بندی خدمات</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-400">نمایش همه</span>
              <FaChevronLeft className="text-purple-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div className="group bg-purple-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-purple-700/40 transition-colors">
                <FaUserTie className="text-purple-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-purple-200 text-center">مشاوره کسب و کار</p>
            </div>
            <div className="group bg-purple-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-purple-700/40 transition-colors">
                <FaTools className="text-purple-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-purple-200 text-center">خدمات تخصصی</p>
            </div>
            <div className="group bg-purple-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-purple-700/40 transition-colors">
                <FaHandshake className="text-purple-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-purple-200 text-center">مشاوره حقوقی</p>
            </div>
            <div className="group bg-purple-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-purple-700/40 transition-colors">
                <FaBriefcase className="text-purple-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-purple-200 text-center">خدمات مالی</p>
            </div>
            <div className="group bg-purple-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-purple-700/40 transition-colors">
                <FaUserTie className="text-purple-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-purple-200 text-center">مشاوره مدیریت</p>
            </div>
            <div className="group bg-purple-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-800/40 rounded-2xl mx-auto mb-4 group-hover:bg-purple-700/40 transition-colors">
                <FaTools className="text-purple-300 text-2xl group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-base font-medium text-purple-200 text-center">خدمات فنی</p>
            </div>
          </div>
        </div>

        {/* Stores Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">مراکز خدماتی</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-400">نمایش همه</span>
              <FaChevronLeft className="text-purple-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {serviceBusinesses.map((store) => (
              <div
                key={store.id}
                className="bg-purple-900/40 rounded-xl p-6 hover:bg-purple-800/40 transition-colors"
              >
                <div className="aspect-video bg-purple-800/20 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{store.name}</h3>
                <p className="text-sm text-purple-200 mb-4">{store.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-400">
                    {store.productCount} محصول
                  </span>
                  <button className="text-sm text-white bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg transition-colors">
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