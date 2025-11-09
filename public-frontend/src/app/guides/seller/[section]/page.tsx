'use client';

import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import Header from '@/components/layout/Header/Header';
import Link from 'next/link';

interface Subsection {
  id: string;
  title: string;
  description: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  subsections: Subsection[];
}

const sections: { [key: string]: Section } = {
  'getting-started': {
    id: 'getting-started',
    title: 'شروع کار',
    description: 'آموزش ثبت‌نام و شروع کار با پنل فروشندگان',
    subsections: [
      {
        id: 'registration',
        title: 'ثبت‌نام و احراز هویت',
        description: 'آموزش ثبت‌نام و تکمیل مراحل احراز هویت'
      },
      {
        id: 'dashboard',
        title: 'آشنایی با داشبورد',
        description: 'آموزش استفاده از پنل مدیریت فروشندگان'
      }
    ]
  },
  'products': {
    id: 'products',
    title: 'مدیریت محصولات',
    description: 'آموزش افزودن و مدیریت محصولات در فروشگاه',
    subsections: [
      {
        id: 'add-product',
        title: 'افزودن محصول جدید',
        description: 'آموزش افزودن محصول جدید به فروشگاه'
      },
      {
        id: 'manage-products',
        title: 'مدیریت محصولات موجود',
        description: 'آموزش مدیریت و ویرایش محصولات'
      }
    ]
  },
  'orders': {
    id: 'orders',
    title: 'مدیریت سفارش‌ها',
    description: 'آموزش مدیریت سفارش‌ها و وضعیت‌های مختلف',
    subsections: [
      {
        id: 'order-process',
        title: 'فرآیند سفارش',
        description: 'آموزش مراحل پردازش سفارش'
      },
      {
        id: 'order-status',
        title: 'وضعیت‌های سفارش',
        description: 'آموزش مدیریت وضعیت‌های مختلف سفارش'
      }
    ]
  },
  'settings': {
    id: 'settings',
    title: 'تنظیمات فروشگاه',
    description: 'آموزش تنظیمات فروشگاه و پیکربندی سیستم',
    subsections: [
      {
        id: 'store-settings',
        title: 'تنظیمات عمومی',
        description: 'آموزش تنظیمات اصلی فروشگاه'
      },
      {
        id: 'shipping-settings',
        title: 'تنظیمات ارسال',
        description: 'آموزش تنظیمات مربوط به ارسال کالا'
      }
    ]
  }
};

export default function SectionPage({ params }: { params: { section: string } }) {
  const section = sections[params.section];

  if (!section) {
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
            href="/guides/seller"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8"
          >
            <FiChevronLeft className="ml-1" />
            بازگشت به راهنمای فروشندگان
          </Link>

          <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
          <p className="text-xl text-gray-300 mb-12">{section.description}</p>
          
          <div className="grid grid-cols-1 gap-6">
            {section.subsections.map((subsection) => (
              <Link
                key={subsection.id}
                href={`/guides/seller/${section.id}/${subsection.id}`}
                className="group"
              >
                <div className="bg-primary-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 hover:bg-purple-500/10 transition-colors">
                  <h2 className="text-xl font-bold mb-2">{subsection.title}</h2>
                  <p className="text-gray-300">{subsection.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 