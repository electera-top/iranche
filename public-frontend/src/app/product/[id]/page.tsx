'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShare2, FiShoppingCart, FiStar, FiUsers, FiMessageSquare, FiEye, FiDollarSign, FiVideo } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import Tooltip from '@/components/ui/tooltip/Tooltip';
import Countdown from '@/components/ui/countdown/Countdown';
import ProductCard from '@/components/common/ProductCard';
import MobileProductHeader from '@/components/layout/Header/MobileProductHeader';
import MobileProductFooter from '@/components/layout/Footer/MobileProductFooter';
import MobileHeader from '@/components/layout/Header/MobileHeader';
import Header from '@/components/layout/Header/Header';

const ProductGallery = dynamic(() => import('@/components/ui/gallery/ProductGallery'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
  </div>
});

const Select = dynamic(() => import('react-select'), {
  ssr: false
});

interface Comment {
  id: number;
  user: string;
  rating: number;
  date: string;
  text: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  store: string;
}

interface VariantOption {
  value: number;
  label: string;
}

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectStyles, setSelectStyles] = useState<any>(null);
  const [productMedia, setProductMedia] = useState<Array<{ type: 'image' | 'video', url: string, thumbnail?: string }>>([]);
  const [userReviews, setUserReviews] = useState<Array<{
    id: number;
    user: string;
    image: string;
    rating: number;
    date: string;
    comment: string;
    pros: string[];
    cons: string[];
  }>>([]);

  useEffect(() => {
    setMounted(true);
    setSelectStyles({
      control: (base: any) => ({
        ...base,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        color: '#fff',
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
      }),
      singleValue: (base: any) => ({
        ...base,
        color: '#fff',
      }),
      menuPortal: (base: any) => ({
        ...base,
        zIndex: 9999,
      }),
      menu: (base: any) => ({
        ...base,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        marginTop: 0,
      }),
      menuList: (base: any) => ({
        ...base,
        position: 'relative',
      }),
      option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? 'var(--secondary)' : 'transparent',
        color: state.isSelected ? '#fff' : '#e5e7eb',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }),
    });

    // Set initial data
    setProductMedia([
      { type: 'image' as const, url: '/images/products/product-1.jpg' },
      { type: 'image' as const, url: '/images/products/product-2.jpg' },
      { type: 'video' as const, url: '/videos/products/product-video.mp4', thumbnail: '/images/products/product-video-thumb.jpg' },
      { type: 'image' as const, url: '/images/products/product-3.jpg' },
    ]);

    setUserReviews([
      {
        id: 1,
        user: 'علی محمدی',
        image: '/images/products/product-1.jpg',
        rating: 5,
        date: '1402/12/15',
        comment: 'محصول بسیار با کیفیت و بسته‌بندی عالی بود. پیشنهاد می‌کنم.',
        pros: ['کیفیت ساخت بالا', 'بسته‌بندی مناسب', 'ارسال سریع'],
        cons: ['قیمت نسبتاً بالا']
      },
      {
        id: 2,
        user: 'مریم احمدی',
        image: '/images/users/user-2.jpg',
        rating: 4,
        date: '1402/12/10',
        comment: 'کیفیت خوبی دارد اما قیمت کمی بالاست.',
        pros: ['طراحی زیبا', 'عملکرد خوب'],
        cons: ['قیمت بالا', 'باتری کم دوام']
      },
      {
        id: 3,
        user: 'رضا کریمی',
        image: '/images/users/user-3.jpg',
        rating: 5,
        date: '1402/12/05',
        comment: 'خرید خوبی بود. از عملکرد محصول راضی هستم.',
        pros: ['سرعت بالا', 'حافظه زیاد', 'دوربین با کیفیت'],
        cons: []
      }
    ]);
  }, []);

  // تاریخ پایان تخفیف (مثال: 3 روز بعد از امروز)
  const discountEndDate = new Date();
  discountEndDate.setDate(discountEndDate.getDate() + 3);

  // اطلاعات نمونه
  const product = {
    name: 'گوشی موبایل سامسونگ گلکسی S23',
    price: 25000000,
    originalPrice: 32000000,
    discount: 22,
    media: [
      { type: 'image' as const, url: '/images/products/product-1.jpg' },
      { type: 'image' as const, url: '/images/products/product-2.jpg' },
      { type: 'video' as const, url: '/videos/products/product-video.mp4', thumbnail: '/images/products/product-video-thumb.jpg' },
      { type: 'image' as const, url: '/images/products/product-3.jpg' },
    ],
    colors: [
      { id: 0, name: 'مشکی', hex: '#000000', backgroundColor: '#000000' },
      { id: 1, name: 'نقره‌ای', hex: '#C0C0C0', backgroundColor: '#C0C0C0' },
      { id: 2, name: 'سبز', hex: '#2E7D32', backgroundColor: '#2E7D32' },
      { id: 3, name: 'آبی', hex: '#1976D2', backgroundColor: '#1976D2' },
    ],
    variants: [
      { id: 0, name: '128 گیگابایت', price: 25000000 },
      { id: 1, name: '256 گیگابایت', price: 28000000 },
      { id: 2, name: '512 گیگابایت', price: 32000000 },
    ],
    description: 'گوشی موبایل سامسونگ گلکسی S23 با پردازنده قدرتمند، دوربین پیشرفته و باتری با دوام بالا',
    specifications: {
      'برند': 'سامسونگ',
      'مدل': 'Galaxy S23',
      'رنگ': 'مشکی',
      'حافظه داخلی': '256 گیگابایت',
      'RAM': '8 گیگابایت',
    },
    store: {
      name: 'فروشگاه دیجی‌کالا',
      rating: 4.8,
      floor: 'طبقه 2',
      unit: 'پلاک 15',
      location: 'مجتمع تجاری آنلاین ایرانچه',
    },
  };

  // تصاویر نمونه کاربران
  const userImages = [
    '/images/products/product-1.jpg',
    '/images/products/product-2.jpg',
    '/images/products/product-3.jpg',
    '/images/products/product-4.jpg',
    '/images/products/product-5.jpg',
  ];

  const comments: Comment[] = [
    {
      id: 1,
      user: 'علی محمدی',
      rating: 5,
      date: '1402/12/15',
      text: 'محصول بسیار با کیفیت و بسته‌بندی عالی بود. پیشنهاد می‌کنم.',
    },
    {
      id: 2,
      user: 'مریم احمدی',
      rating: 4,
      date: '1402/12/10',
      text: 'کیفیت خوبی دارد اما قیمت کمی بالاست.',
    },
  ];

  const relatedProducts: RelatedProduct[] = [
    {
      id: 1,
      name: 'گوشی موبایل آیفون 14',
      price: 30000000,
      originalPrice: 35000000,
      discount: 15,
      image: '/images/related1.jpg',
      store: 'فروشگاه دیجی‌کالا',
    },
    {
      id: 2,
      name: 'گوشی موبایل شیائومی 13',
      price: 15000000,
      originalPrice: 18000000,
      discount: 17,
      image: '/images/related2.jpg',
      store: 'فروشگاه دیجی‌کالا',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <Header />



      <MobileProductHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 overflow-x-auto no-scrollbar overflow-y-hidden">
          <div className="flex items-center gap-2 text-sm text-gray-400 min-w-max">
            <Link href="/" className="hover:text-gray-300 transition-colors">خانه</Link>
            <span className="text-gray-600">/</span>
            <Link href="/category/mobile" className="hover:text-gray-300 transition-colors">موبایل</Link>
            <span className="text-gray-600">/</span>
            <Link href="/category/mobile/samsung" className="hover:text-gray-300 transition-colors">سامسونگ</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-300">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* بخش راست - تصاویر محصول */}
          <div className="lg:col-span-4 order-1">
            <div 
              className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              onClick={() => setIsGalleryOpen(true)}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full">
                  <FiEye className="text-white text-2xl" />
                </div>
              </div>
              <div className="absolute top-0 left-0 right-0 z-10">
                <div className="bg-gradient-to-r from-red-500/90 to-red-600/90 backdrop-blur-sm text-white px-4 py-2">
                  <div className="text-center text-lg font-bold mb-1">تخفیف به مدت محدود!</div>
                  <Countdown endDate={discountEndDate} />
                </div>
              </div>
              <Image
                src={product.media[selectedImage].url}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <FiHeart className="text-gray-500 hover:text-red-500" size={20} />
                </button>
                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <FiShare2 className="text-gray-500 hover:text-blue-500" size={20} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {product.media.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border ${
                    selectedImage === index ? 'ring-2 ring-indigo-600 border-indigo-600' : 'border-gray-200'
                  }`}
                >
                  {item.type === 'video' ? (
                    <>
                      <Image
                        src={item.thumbnail || item.url}
                        alt={`ویدئو ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <FiVideo className="text-white text-xl" />
                      </div>
                    </>
                  ) : (
                    <Image
                      src={item.url}
                      alt={`تصویر ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>

            {mounted && productMedia.length > 0 && userReviews.length > 0 && (
              <ProductGallery
                productMedia={productMedia}
                userReviews={userReviews}
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
              />
            )}
          </div>

          {/* بخش وسط - مشخصات و رنگ‌ها */}
          <div className="lg:col-span-5 order-2">
            {/* نام محصول */}
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <div className="border-t border-gray-700 pt-2">
                <p className="text-sm text-gray-400 text-left">Samsung Galaxy S23</p>
              </div>
            </div>

            {/* انتخاب رنگ */}
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">انتخاب رنگ</h2>
              <div className="flex gap-4">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === index
                        ? 'border-secondary scale-110'
                        : 'border-gray-300 hover:border-secondary'
                    }`}
                    style={{ backgroundColor: color.backgroundColor }}
                  />
                ))}
              </div>
            </div>

            {/* انتخاب ویژگی‌ها */}
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">انتخاب ویژگی‌ها</h2>
              <div className="relative">
                {mounted && selectStyles && (
                  <Select
                    options={product.variants.map(variant => ({
                      value: variant.id,
                      label: variant.name
                    }))}
                    value={{
                      value: product.variants[selectedVariant].id,
                      label: product.variants[selectedVariant].name
                    }}
                    onChange={(option: any) => setSelectedVariant(option?.value || 0)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isRtl={true}
                    menuPortalTarget={mounted ? document.body : undefined}
                    styles={selectStyles}
                  />
                )}
              </div>
              
              {/* باکس ویژگی‌های محصول */}
              <div className="mt-6">
                <h3 className="text-base font-bold mb-4">
                  ویژگی‌های محصول
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-700">
                    <div>
                      <p className="text-gray-300 font-medium text-sm">پردازنده</p>
                      <p className="text-gray-400 text-xs">Snapdragon 8 Gen 2</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-700">
                    <div>
                      <p className="text-gray-300 font-medium text-sm">دوربین اصلی</p>
                      <p className="text-gray-400 text-xs">50 مگاپیکسل</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-700">
                    <div>
                      <p className="text-gray-300 font-medium text-sm">باتری</p>
                      <p className="text-gray-400 text-xs">3900 میلی‌آمپر</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-700">
                    <div>
                      <p className="text-gray-300 font-medium text-sm">نمایشگر</p>
                      <p className="text-gray-400 text-xs">6.1 اینچ</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-700">
                    <div>
                      <p className="text-gray-300 font-medium text-sm">وزن</p>
                      <p className="text-gray-400 text-xs">168 گرم</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-700">
                    <div>
                      <p className="text-gray-300 font-medium text-sm">ابعاد</p>
                      <p className="text-gray-400 text-xs">70.9 × 146.3 × 7.6 میلی‌متر</p>
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 px-4 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-700/50 transition-colors flex items-center justify-between">
                  <span>مشاهده بیشتر</span>
                  <span className="text-lg rotate-180">→</span>
                </button>
              </div>
            </div>

            {/* هدایای خرید */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-blue-500/5 opacity-30"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
              <div className="absolute inset-0 bg-[url('/images/gold-pattern.png')] opacity-5"></div>
              <div className="relative z-10">
                <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                  <span className="text-yellow-400">🎁</span>
                  با خرید این محصول دریافت کنید:
                </h3>
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="relative overflow-hidden p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 flex-1 group hover:from-yellow-500/20 hover:to-yellow-600/20 transition-all duration-300">
                    <div className="absolute inset-0 bg-[url('/images/gold-pattern.png')] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/20 rounded-full blur-xl"></div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 flex items-center justify-center border-2 border-yellow-500/40 shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
                        <FiDollarSign className="text-2xl text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-yellow-400 font-bold text-base">۵ گرم طلا</p>
                          <span className="text-yellow-400/70 text-xs bg-yellow-500/20 px-2 py-0.5 rounded-full">هدیه ویژه</span>
                        </div>
                        <p className="text-yellow-400/70 text-xs mt-1">ارزش: ۵,۰۰۰,۰۰۰ تومان</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 flex-1 group hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
                      <FiStar className="text-2xl text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-400 font-medium text-base">۵۰۰ امتیاز</p>
                      <p className="text-blue-400/70 text-xs">برای خرید بعدی</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* بخش چپ - قیمت و مشخصات فروشگاه */}
          <div className="lg:col-span-3 order-3">
            {/* مشخصات فروشنده */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center border border-secondary/20 overflow-hidden">
                    <Image
                      src="/images/store-logo.png"
                      alt="لوگوی فروشگاه"
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center border-2 border-white/50 shadow-lg shadow-green-500/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-base mb-1">{product.store.name}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                      <FiStar className="text-yellow-400" size={14} />
                      <span className="text-yellow-400">{product.store.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-full">
                      <FiUsers className="text-blue-400" size={14} />
                      <span className="text-blue-400">۲.۵K دنبال‌کننده</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* دکمه‌های عملیاتی */}
              <div className="flex items-center gap-2 mb-6">
                <Tooltip text="دنبال کردن فروشگاه">
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20 hover:bg-secondary/30 text-secondary transition-colors border border-secondary sm:px-2 sm:py-1 sm:w-auto sm:h-auto sm:rounded-lg sm:gap-1 sm:text-[10px]">
                    <FiHeart size={14} />
                    <span className="hidden sm:inline">دنبال</span>
                  </button>
                </Tooltip>
                <Tooltip text="چت و پشتیبانی محصولات">
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors border border-blue-400 sm:px-2 sm:py-1 sm:w-auto sm:h-auto sm:rounded-lg sm:gap-1 sm:text-[10px]">
                    <FiMessageSquare size={14} />
                    <span className="hidden sm:inline">چت</span>
                  </button>
                </Tooltip>
                <Tooltip text="مشاهده صفحه و محصولات">
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white sm:px-2 sm:py-1 sm:w-auto sm:h-auto sm:rounded-lg sm:gap-1 sm:text-[10px]">
                    <FiEye size={14} />
                    <span className="hidden sm:inline">مشاهده</span>
                  </button>
                </Tooltip>
              </div>

              <div className="mb-6">
                <p className="text-gray-300 text-xs leading-relaxed">
                  فروشگاه تخصصی طلا و جواهرات با بیش از ۱۰ سال سابقه درخشان در زمینه طراحی و تولید زیورآلات دست‌ساز. 
                  ما با استفاده از بهترین مواد اولیه و بهره‌گیری از هنر استادکاران مجرب، زیورآلاتی منحصر به فرد و با کیفیت را به شما عرضه می‌کنیم.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-xs bg-white/5 p-2 rounded-lg">
                  <span className="text-secondary">طبقه</span>
                  <span className="text-gray-300">{product.store.floor}</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-white/5 p-2 rounded-lg">
                  <span className="text-secondary">پلاک</span>
                  <span className="text-gray-300">{product.store.unit}</span>
                </div>
              </div>
            </div>

            {/* تعداد و دکمه خرید */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg mt-4">
              {/* قیمت */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-end">
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg">{product.discount}٪ تخفیف</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="line-through text-gray-400 text-sm">{product.originalPrice.toLocaleString()} تومان</span>
                    <span className="text-2xl font-bold text-secondary">{product.price.toLocaleString()} تومان</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 mb-3 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                    <span className="text-xl">🛒</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-green-400 font-medium">ارسال رایگان</p>
                    <p className="text-green-400/70 text-sm">برای خرید بالای ۵۰۰ هزار تومان</p>
                  </div>
                </div>
              <div className="flex items-center gap-4">
                <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  <FiShoppingCart className="inline-block ml-2" />
                  افزودن به سبد خرید
                </button>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-400">
                با افزایش مجموعه مبلغ سبد خرید خود از این فروشگاه به{' '}
                <span className="text-green-400">۵۰۰ هزار تومان</span>{' '}
                هزینه ارسال رایگان خواهد شد
              </p>
            </div>
          </div>
        </div>

        {/* بخش‌های اطلاعات محصول */}
        <div className="mb-8 mt-12">
          <div className="flex flex-col gap-8">
            {/* مشخصات */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">مشخصات</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-500">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* نظرات */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">نظرات</h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-700 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{comment.user}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              size={16}
                              className={i < comment.rating ? 'fill-current' : ''}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-600">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* توضیحات */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">توضیحات</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>

        {/* محصولات مرتبط */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">محصولات مشابه</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id.toString()}
                title={product.name}
                price={product.price}
                discountedPrice={product.originalPrice}
                image={product.image}
                rating={4.5}
                storeId="1"
                storeName={product.store}
                storeLogo="/images/store-logo.png"
                storeFloor={2}
                storeUnit="A12"
                colors={[
                  { name: 'مشکی', code: '#000000' },
                  { name: 'نقره‌ای', code: '#C0C0C0' }
                ]}
                isVIP={false}
                isAds={false}
                hasDiscount={product.discount > 0}
                discountEndsAt={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)}
                limitedStock={5}
                category="موبایل"
                inStock={true}
              />
            ))}
          </div>
        </div>
      </div>

      <MobileProductFooter 
        originalPrice={product.originalPrice}
        price={product.price}
        discount={product.discount}
      />
    </div>
  );
};

export default ProductPage; 