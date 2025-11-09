'use client';

import React from 'react';
import { FiHome, FiPackage, FiDollarSign, FiSettings } from 'react-icons/fi';
import Header from '@/components/layout/Header/Header';
import Link from 'next/link';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const sections: Section[] = [
  {
    id: 'getting-started',
    title: 'شروع کار',
    icon: <FiHome className="text-xl" />,
    description: 'آموزش ثبت‌نام و شروع کار با پنل فروشندگان'
  },
  {
    id: 'products',
    title: 'مدیریت محصولات',
    icon: <FiPackage className="text-xl" />,
    description: 'آموزش افزودن و مدیریت محصولات در فروشگاه'
  },
  {
    id: 'orders',
    title: 'مدیریت سفارش‌ها',
    icon: <FiDollarSign className="text-xl" />,
    description: 'آموزش مدیریت سفارش‌ها و وضعیت‌های مختلف'
  },
  {
    id: 'settings',
    title: 'تنظیمات فروشگاه',
    icon: <FiSettings className="text-xl" />,
    description: 'آموزش تنظیمات فروشگاه و پیکربندی سیستم'
  }
];

export default function SellerGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">راهنمای فروشندگان</h1>
          <p className="text-xl text-gray-300 text-center mb-12">
            آموزش کامل استفاده از پنل فروشندگان ایرانچه
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`/guides/seller/${section.id}`}
                className="group"
              >
                <div className="bg-primary-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 hover:bg-purple-500/10 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-purple-500/20 p-3 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>
                  <p className="text-gray-300">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 