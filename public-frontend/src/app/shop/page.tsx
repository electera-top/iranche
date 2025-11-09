'use client';

import React from 'react';
import Header from '@/components/layout/Header/Header';
import BannerSlider from '@/components/shop/BannerSlider/BannerSlider';
import StoreSlider from '@/components/shop/StoreSlider/StoreSlider';
import ProductSlider from '@/components/common/ProductSlider/ProductSlider';
import FloorSlider from '@/components/shop/FloorSlider/FloorSlider';
import Link from 'next/link';

const featuredProducts = [
  {
    id: '1',
    title: 'بازی موبایل جدید',
    price: 150000,
    discountedPrice: null,
    image: '/images/products/product-1.jpg',
    rating: 4.5,
    storeId: '1',
    storeName: 'فروشگاه بازی‌های موبایل',
    storeLogo: '/images/stores/store-1.jpg',
    storeFloor: 1,
    storeUnit: 'A12',
    category: 'بازی‌های موبایل',
    inStock: true
  },
  {
    id: '2',
    title: 'کتاب آموزشی',
    price: 85000,
    discountedPrice: 75000,
    image: '/images/products/product-2.jpg',
    rating: 4.2,
    storeId: '2',
    storeName: 'فروشگاه کتاب',
    storeLogo: '/images/stores/store-2.jpg',
    storeFloor: 2,
    storeUnit: 'B5',
    category: 'کتاب',
    inStock: true
  },
  {
    id: '3',
    title: 'اسباب‌بازی هوشمند',
    price: 250000,
    discountedPrice: null,
    image: '/images/products/product-3.jpg',
    rating: 4.8,
    storeId: '3',
    storeName: 'فروشگاه اسباب‌بازی',
    storeLogo: '/images/stores/store-3.jpg',
    storeFloor: 1,
    storeUnit: 'C8',
    category: 'اسباب‌بازی',
    inStock: true
  },
  {
    id: '4',
    title: 'هدست واقعیت مجازی',
    price: 3500000,
    discountedPrice: 3200000,
    image: '/images/products/product-4.jpg',
    rating: 4.6,
    storeId: '4',
    storeName: 'فروشگاه الکترونیک',
    storeLogo: '/images/stores/store-4.jpg',
    storeFloor: 3,
    storeUnit: 'D3',
    category: 'الکترونیک',
    inStock: true
  }
];

const categories = [
  {
    id: '1',
    name: 'بازی‌های موبایل',
    slug: 'mobile-games',
    products: featuredProducts.filter(p => p.category === 'بازی‌های موبایل')
  },
  {
    id: '2',
    name: 'کتاب و مجلات',
    slug: 'books',
    products: featuredProducts.filter(p => p.category === 'کتاب')
  },
  {
    id: '3',
    name: 'اسباب‌بازی',
    slug: 'toys',
    products: featuredProducts.filter(p => p.category === 'اسباب‌بازی')
  },
  {
    id: '4',
    name: 'الکترونیک',
    slug: 'electronics',
    products: featuredProducts.filter(p => p.category === 'الکترونیک')
  }
];

export default function ShopPage() {
  return (
    <div className="text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* بنر اسلایدی */}
          <BannerSlider />

          {/* فروشگاه‌های برتر */}
          <StoreSlider />

          {/* محصولات منتخب */}
          <div className="relative mb-16">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 rounded-2xl transform -rotate-1 shadow-xl hidden lg:block"></div>
            <div className="relative bg-primary-950 rounded-xl p-6 shadow-inner overflow-hidden">
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-white inline-block">محصولات منتخب</h2>
                  <p className="text-white mt-2">برترین محصولات با بهترین قیمت</p>
                </div>
                
              </div>
              
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary-500/20 rounded-full blur-xl hidden md:block"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-500/20 rounded-full blur-xl hidden md:block"></div>
                <ProductSlider products={featuredProducts} isFeatured={true} />
              </div>
            </div>
          </div>

          {/* لیست طبقات مجتمع */}
          <div className="mb-16">
            <FloorSlider />
          </div>

          {/* محصولات براساس دسته‌بندی */}
          {categories.map((category) => (
            <div key={category.id} className="py-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-secondary-500 hover:text-secondary-400"
                >
                  مشاهده همه
                </Link>
              </div>
              <ProductSlider products={category.products} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 