'use client';

import React from 'react';
import { FaCrown, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header/Header';
import StoreCard from '@/components/common/StoreCard/StoreCard';
import ProductCard from '@/components/common/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Mock data for banner slides
const bannerSlides = [
  {
    id: 1,
    image: '/images/banners/vip-banner-1.jpg',
    title: 'فروش ویژه محصولات VIP',
    description: 'تخفیف‌های ویژه برای محصولات لوکس و برند'
  },
  {
    id: 2,
    image: '/images/banners/vip-banner-2.jpg',
    title: 'کالکشن جدید ساعت‌های لوکس',
    description: 'جدیدترین مدل‌های ساعت‌های برندهای معتبر'
  },
  {
    id: 3,
    image: '/images/banners/vip-banner-3.jpg',
    title: 'جواهرات سلطنتی',
    description: 'مجموعه‌ای از زیباترین جواهرات و زیورآلات'
  }
];

// Mock data for VIP stores
const vipStores = [
  {
    id: 1,
    name: 'جواهرات سلطنتی',
    description: 'فروشگاه تخصصی جواهرات و زیورآلات لوکس',
    image: '/images/stores/jewelry-store.jpg',
    productCount: 150
  },
  {
    id: 2,
    name: 'لوازم خانگی لوکس',
    description: 'فروشگاه تخصصی لوازم خانگی برندهای معتبر جهانی',
    image: '/images/stores/home-appliances.jpg',
    productCount: 200
  },
  {
    id: 3,
    name: 'پوشاک برند',
    description: 'فروشگاه تخصصی پوشاک برندهای معتبر جهانی',
    image: '/images/stores/clothing-store.jpg',
    productCount: 300
  },
  {
    id: 4,
    name: 'عطر و ادکلن لوکس',
    description: 'فروشگاه تخصصی عطر و ادکلن برندهای معتبر',
    image: '/images/stores/perfume-store.jpg',
    productCount: 100
  },
  {
    id: 5,
    name: 'ساعت‌های لوکس',
    description: 'فروشگاه تخصصی ساعت‌های برندهای معتبر جهانی',
    image: '/images/stores/watch-store.jpg',
    productCount: 80
  },
  {
    id: 6,
    name: 'لوازم الکترونیکی لوکس',
    description: 'فروشگاه تخصصی لوازم الکترونیکی برندهای معتبر',
    image: '/images/stores/electronics-store.jpg',
    productCount: 250
  }
];

// Mock data for featured products
const featuredProducts = [
  {
    id: '1',
    title: 'ساعت مچی رولکس',
    price: 250000000,
    discountedPrice: 230000000,
    image: '/images/products/rolex-watch.jpg',
    rating: 4.9,
    storeId: 'store1',
    storeName: 'ساعت‌سرای لوکس',
    storeLogo: '/images/stores/watch-store.jpg',
    storeFloor: 3,
    category: 'ساعت',
    inStock: true,
  },
  {
    id: '2',
    title: 'گردنبند الماس',
    price: 180000000,
    discountedPrice: null,
    image: '/images/products/diamond-necklace.jpg',
    rating: 4.8,
    storeId: 'store2',
    storeName: 'جواهرات سلطنتی',
    storeLogo: '/images/stores/jewelry-store.jpg',
    storeFloor: 8,
    category: 'جواهرات',
    inStock: true,
  },
  {
    id: '3',
    title: 'عطر چنل',
    price: 12000000,
    discountedPrice: 11000000,
    image: '/images/products/chanel-perfume.jpg',
    rating: 4.7,
    storeId: 'store3',
    storeName: 'عطر و ادکلن لوکس',
    storeLogo: '/images/stores/perfume-store.jpg',
    storeFloor: 4,
    category: 'عطر و ادکلن',
    inStock: true,
  },
  {
    id: '4',
    title: 'تلویزیون سامسونگ',
    price: 35000000,
    discountedPrice: 32000000,
    image: '/images/products/samsung-tv.jpg',
    rating: 4.6,
    storeId: 'store4',
    storeName: 'لوازم الکترونیکی لوکس',
    storeLogo: '/images/stores/electronics-store.jpg',
    storeFloor: 2,
    category: 'الکترونیک',
    inStock: true,
  }
];

// Mock data for product categories
const productCategories = [
  {
    id: 1,
    name: 'ساعت‌های لوکس',
    image: '/images/categories/watches.jpg',
    productCount: 80
  },
  {
    id: 2,
    name: 'جواهرات',
    image: '/images/categories/jewelry.jpg',
    productCount: 150
  },
  {
    id: 3,
    name: 'عطر و ادکلن',
    image: '/images/categories/perfume.jpg',
    productCount: 100
  },
  {
    id: 4,
    name: 'پوشاک برند',
    image: '/images/categories/clothing.jpg',
    productCount: 300
  },
  {
    id: 5,
    name: 'لوازم الکترونیکی',
    image: '/images/categories/electronics.jpg',
    productCount: 250
  },
  {
    id: 6,
    name: 'لوازم خانگی',
    image: '/images/categories/home-appliances.jpg',
    productCount: 200
  }
];

const VIPStoresPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaCrown className="text-yellow-500 text-3xl" />
            <h1 className="text-3xl font-bold text-gray-800">فروشگاه‌های VIP</h1>
          </div>
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-yellow-500 transition-colors">
            <span>بازگشت به صفحه اصلی</span>
            <FaChevronLeft />
          </Link>
        </div>

        {/* Banner Slider */}
        <div className="mb-12">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 5000 }}
            className="rounded-2xl overflow-hidden"
          >
            {bannerSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative h-[400px]">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                  <div className="absolute right-8 bottom-8 text-white max-w-md">
                    <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-lg">{slide.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* VIP Stores Slider */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">فروشگاه‌های VIP</h2>
            <Link href="/vip/stores" className="text-yellow-500 hover:text-yellow-600 transition-colors">
              مشاهده همه
            </Link>
          </div>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
          >
            {vipStores.map((store) => (
              <SwiperSlide key={store.id}>
                <StoreCard store={store} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Featured Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">محصولات منتخب VIP</h2>
            <Link href="/vip/products" className="text-yellow-500 hover:text-yellow-600 transition-colors">
              مشاهده همه
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Product Categories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">دسته‌بندی محصولات VIP</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {productCategories.map((category) => (
              <Link
                key={category.id}
                href={`/vip/categories/${category.id}`}
                className="group relative h-40 rounded-xl overflow-hidden"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 right-4 text-white">
                  <h3 className="font-bold mb-1">{category.name}</h3>
                  <p className="text-sm">{category.productCount} محصول</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPStoresPage; 