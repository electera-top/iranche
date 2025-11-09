'use client';

import React from 'react';
import { FiUsers, FiAward, FiHeart, FiTarget } from 'react-icons/fi';
import Header from '@/components/layout/Header/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* هدر */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">درباره ایرانچه</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            ما در ایرانچه به دنبال ایجاد تجربه‌ای متفاوت و لذت‌بخش برای کودکان و نوجوانان هستیم
          </p>
        </div>

        {/* داستان ما */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">داستان ما</h2>
            <p className="text-gray-300 leading-relaxed">
              ایرانچه در سال ۱۴۰۰ با هدف ایجاد یک پلتفرم بازی و سرگرمی امن و جذاب برای کودکان و نوجوانان ایرانی تأسیس شد. ما باور داریم که بازی و سرگرمی می‌تواند نقش مهمی در رشد و یادگیری کودکان داشته باشد.
            </p>
            <p className="text-gray-300 leading-relaxed">
              تیم ما متشکل از متخصصان حوزه بازی، روانشناسی کودک و فناوری است که با همکاری یکدیگر، تجربه‌ای منحصر به فرد برای کاربران فراهم می‌کنند.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl"></div>
            <div className="relative aspect-video bg-primary-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20">
              {/* در اینجا می‌توانید یک تصویر یا ویدیو قرار دهید */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                تصویر یا ویدیو
              </div>
            </div>
          </div>
        </div>

        {/* ارزش‌های ما */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">ارزش‌های ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-primary-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4">
                <FiUsers className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">جامعه محور</h3>
              <p className="text-gray-300">
                ما به ایجاد یک جامعه سالم و پویا برای کودکان و نوجوانان اعتقاد داریم
              </p>
            </div>

            <div className="bg-primary-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4">
                <FiAward className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">کیفیت</h3>
              <p className="text-gray-300">
                ارائه محتوای باکیفیت و استاندارد برای کاربران اولویت ماست
              </p>
            </div>

            <div className="bg-primary-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4">
                <FiHeart className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">امنیت</h3>
              <p className="text-gray-300">
                ایجاد محیطی امن و مناسب برای کودکان و نوجوانان
              </p>
            </div>

            <div className="bg-primary-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4">
                <FiTarget className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">توسعه</h3>
              <p className="text-gray-300">
                همگام با تکنولوژی‌های روز و نیازهای کاربران
              </p>
            </div>
          </div>
        </div>

        {/* تیم ما */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">تیم ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <div key={member} className="bg-primary-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20">
                <div className="aspect-square bg-gray-800">
                  {/* در اینجا می‌توانید تصاویر اعضای تیم را قرار دهید */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    تصویر عضو تیم
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">نام عضو تیم</h3>
                  <p className="text-purple-400 mb-4">سمت</p>
                  <p className="text-gray-300">
                    توضیحات کوتاه درباره نقش و مسئولیت‌های عضو تیم
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 