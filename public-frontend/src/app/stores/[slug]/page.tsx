import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import StoreHeader from '@/components/store/StoreHeader';
import StoreTabs from '@/components/store/StoreTabs';
import StoreBio from '@/components/store/StoreBio';
import StoreProducts from '@/components/store/StoreProducts';
import StoreReviews from '@/components/store/StoreReviews';
import { stores } from '@/lib/data/stores';
import Header from '@/components/layout/Header/Header';
import MobileHeader from '@/components/layout/Header/MobileHeader';

interface StorePageProps {
  params: {
    slug: string;
  };
  searchParams: {
    tab?: string;
  };
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const store = stores.find(s => s.slug === params.slug);
  
  if (!store) {
    return {
      title: 'فروشگاه یافت نشد',
      description: 'فروشگاه مورد نظر شما در ایران چه یافت نشد.'
    };
  }
  
  return {
    title: `${store.name} | ایران چه`,
    description: store.description,
    openGraph: {
      title: `${store.name} | ایران چه`,
      description: store.description,
      images: [store.bannerImage],
    },
  };
}

export default function StorePage({ params, searchParams }: StorePageProps) {
  // یافتن فروشگاه با اسلاگ
  const store = stores.find(s => s.slug === params.slug);
  
  // اگر فروشگاه پیدا نشد صفحه ۴۰۴ نمایش داده شود
  if (!store) {
    notFound();
  }
  
  // تب فعال
  const activeTab = searchParams.tab || 'profile';
  
  // اطلاعات فروشگاه غنی سازی شده
  const storeInfo = {
    ...store,
    followers: store.followersCount || 0,
    products: 128, // این داده‌ها موقتی است و در نسخه واقعی از API دریافت می‌شود
    sales: 1240,
    city: 'تهران',
    province: 'تهران',
    isOnline: true,
    joinDate: '۱۴۰۱/۰۸/۲۳',
    medals: [
      { name: 'فروشنده برتر', icon: 'award' },
      { name: 'پاسخگویی سریع', icon: 'clock' },
    ],
    bio: `${store.name} یکی از بهترین فروشگاه‌های حوزه ${store.category} می‌باشد که از سال ۱۳۹۸ فعالیت خود را آغاز کرده است. ما همواره تلاش می‌کنیم بهترین محصولات را با مناسب‌ترین قیمت و بالاترین کیفیت به مشتریان خود ارائه دهیم.

ما به خود می‌بالیم که طی سال‌های گذشته توانسته‌ایم رضایت مشتریان خود را جلب کنیم و به یکی از فروشگاه‌های معتبر در این حوزه تبدیل شویم.`,
    strengths: [
      'کیفیت بالای محصولات',
      'قیمت مناسب',
      'پاسخگویی سریع',
      'تنوع محصولات',
    ],
    weaknesses: [
      'تاخیر در ارسال برخی سفارشات',
    ],
  };
  
  // محصولات فروشگاه (موقت)
  const products = Array(12).fill(null).map((_, index) => ({
    id: `${store.id}-prod-${index + 1}`,
    title: `محصول ${index + 1}`,
    price: Math.floor(Math.random() * 1000000) + 100000,
    discountedPrice: Math.random() > 0.3 ? Math.floor(Math.random() * 900000) + 90000 : null,
    image: `/images/stores/products/product-${(index % 6) + 1}.jpg`,
    category: ['محبوب', 'جدید', 'پرفروش'][index % 3],
    inStock: Math.random() > 0.2,
  }));
  
  // بررسی‌های مشتریان (موقت)
  const reviews = Array(8).fill(null).map((_, index) => ({
    id: `review-${index + 1}`,
    user: `کاربر ${index + 1}`,
    rating: Math.floor(Math.random() * 3) + 3,
    date: '۱۴۰۳/۰۱/۲۵',
    text: `${store.name} یک فروشگاه عالی است. من از خرید خود بسیار راضی هستم. کیفیت محصولات عالی بود و بسته‌بندی مناسبی داشت. ارسال سفارش نیز به موقع انجام شد.`,
    productName: `محصول ${index + 1}`,
    likes: Math.floor(Math.random() * 20),
    dislikes: Math.floor(Math.random() * 5),
  }));
  
  return (
    <main className="min-h-screen overflow-x-hidden bg-primary">
        <Header />
      <MobileHeader />

      <div className="container mx-auto px-4 py-8 pb-16">
        {/* هدر فروشگاه */}
        <StoreHeader store={storeInfo} />
        
        {/* تب‌های فروشگاه */}
        <StoreTabs activeTab={activeTab} storeSlug={store.slug} />
        
        {/* محتوای تب‌ها */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          {activeTab === 'profile' && (
            <StoreBio store={storeInfo} />
          )}
          
          {activeTab === 'products' && (
            <StoreProducts products={products} />
          )}
          
          {activeTab === 'reviews' && (
            <StoreReviews reviews={reviews} store={storeInfo} />
          )}
        </div>
      </div>
    </main>
  );
} 