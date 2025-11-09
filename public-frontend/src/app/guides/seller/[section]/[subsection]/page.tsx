'use client';

import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import Header from '@/components/layout/Header/Header';
import Link from 'next/link';

interface SubsectionContent {
  title: string;
  content: React.ReactNode;
}

const subsectionContents: { [key: string]: { [key: string]: SubsectionContent } } = {
  'getting-started': {
    'registration': {
      title: 'ثبت‌نام و احراز هویت',
      content: (
        <div className="space-y-6">
          <div className="prose prose-invert max-w-none">
            <p>برای شروع کار در پنل فروشندگان ایرانچه، مراحل زیر را دنبال کنید:</p>
            <ol className="list-decimal pr-6 space-y-2">
              <li>ثبت‌نام در سایت ایرانچه</li>
              <li>تکمیل اطلاعات شخصی و فروشگاه</li>
              <li>ارسال مدارک احراز هویت</li>
              <li>تأیید اطلاعات توسط تیم ایرانچه</li>
              <li>فعال‌سازی پنل فروشنده</li>
            </ol>
          </div>
          <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
            <p className="font-medium mb-2">نکته مهم:</p>
            <p>مدت زمان تأیید اطلاعات معمولاً ۲۴ تا ۴۸ ساعت کاری است.</p>
          </div>
        </div>
      )
    },
    'dashboard': {
      title: 'آشنایی با داشبورد',
      content: (
        <div className="space-y-6">
          <div className="prose prose-invert max-w-none">
            <p>پنل مدیریت فروشندگان شامل بخش‌های زیر است:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>خلاصه عملکرد فروشگاه</li>
              <li>آمار فروش و درآمد</li>
              <li>سفارش‌های جدید</li>
              <li>پیام‌های دریافتی</li>
              <li>اعلان‌های مهم</li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">آمار سریع</h4>
              <p>مشاهده آمار مهم فروشگاه در یک نگاه</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">فعالیت‌های اخیر</h4>
              <p>پیگیری آخرین فعالیت‌های فروشگاه</p>
            </div>
          </div>
        </div>
      )
    }
  },
  'products': {
    'add-product': {
      title: 'افزودن محصول جدید',
      content: (
        <div className="space-y-6">
          <div className="prose prose-invert max-w-none">
            <p>برای افزودن محصول جدید به فروشگاه خود:</p>
            <ol className="list-decimal pr-6 space-y-2">
              <li>انتخاب دسته‌بندی مناسب</li>
              <li>وارد کردن اطلاعات محصول</li>
              <li>آپلود تصاویر با کیفیت</li>
              <li>تعیین قیمت و موجودی</li>
              <li>تنظیم گزینه‌های ارسال</li>
            </ol>
          </div>
          <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
            <p className="font-medium mb-2">نکات مهم:</p>
            <ul className="list-disc pr-6 space-y-1">
              <li>تصاویر باید با کیفیت و واضح باشند</li>
              <li>توضیحات محصول باید کامل و دقیق باشد</li>
              <li>قیمت‌گذاری باید رقابتی و منصفانه باشد</li>
            </ul>
          </div>
        </div>
      )
    },
    'manage-products': {
      title: 'مدیریت محصولات موجود',
      content: (
        <div className="space-y-6">
          <div className="prose prose-invert max-w-none">
            <p>امکانات مدیریت محصولات:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>ویرایش اطلاعات محصول</li>
              <li>به‌روزرسانی موجودی</li>
              <li>تغییر قیمت</li>
              <li>مدیریت تخفیف‌ها</li>
              <li>غیرفعال کردن محصول</li>
            </ul>
          </div>
        </div>
      )
    }
  },
  'orders': {
    'order-process': {
      title: 'فرآیند سفارش',
      content: (
        <div className="space-y-6">
          <div className="prose prose-invert max-w-none">
            <p>مراحل پردازش سفارش:</p>
            <ol className="list-decimal pr-6 space-y-2">
              <li>دریافت سفارش جدید</li>
              <li>تأیید موجودی محصولات</li>
              <li>آماده‌سازی سفارش</li>
              <li>ثبت کد رهگیری پست</li>
              <li>تغییر وضعیت سفارش</li>
            </ol>
          </div>
        </div>
      )
    },
    'order-status': {
      title: 'وضعیت‌های سفارش',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">در انتظار پرداخت</h4>
              <p>سفارش ثبت شده اما پرداخت انجام نشده</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">در حال پردازش</h4>
              <p>سفارش پرداخت شده و در حال آماده‌سازی</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">ارسال شده</h4>
              <p>سفارش به پست تحویل داده شده</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">تحویل شده</h4>
              <p>سفارش به مشتری تحویل داده شده</p>
            </div>
          </div>
        </div>
      )
    }
  },
  'settings': {
    'store-settings': {
      title: 'تنظیمات عمومی',
      content: (
        <div className="space-y-6">
          <div className="prose prose-invert max-w-none">
            <p>تنظیمات اصلی فروشگاه:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>اطلاعات فروشگاه</li>
              <li>تنظیمات ارسال</li>
              <li>تنظیمات مالی</li>
              <li>تنظیمات اعلان‌ها</li>
            </ul>
          </div>
        </div>
      )
    },
    'shipping-settings': {
      title: 'تنظیمات ارسال',
      content: (
        <div className="space-y-6">
          <div className="prose prose-invert max-w-none">
            <p>تنظیمات مربوط به ارسال کالا:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>تعیین روش‌های ارسال</li>
              <li>تنظیم هزینه ارسال</li>
              <li>تعیین محدوده ارسال رایگان</li>
              <li>تنظیم زمان تحویل</li>
            </ul>
          </div>
        </div>
      )
    }
  }
};

export default function SubsectionPage({ params }: { params: { section: string; subsection: string } }) {
  const content = subsectionContents[params.section]?.[params.subsection];

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">صفحه مورد نظر یافت نشد</h1>
            <Link href="/guides/seller" className="text-purple-400 hover:text-purple-300">
              بازگشت به راهنمای فروشندگان
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/guides/seller/${params.section}`}
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8"
          >
            <FiChevronLeft className="ml-1" />
            بازگشت به بخش قبلی
          </Link>

          <h1 className="text-4xl font-bold mb-8">{content.title}</h1>
          
          <div className="bg-primary-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8">
            {content.content}
          </div>
        </div>
      </div>
    </div>
  );
} 