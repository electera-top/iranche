'use client';

import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';
import Header from '@/components/layout/Header/Header';
import Button from '@/components/ui/button/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // در اینجا می‌توانید منطق ارسال فرم را پیاده‌سازی کنید
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">تماس با ما</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            ما اینجا هستیم تا به سوالات شما پاسخ دهیم و پیشنهادات شما را بشنویم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* اطلاعات تماس */}
          <div className="space-y-8">
            <div className="bg-primary-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-bold mb-6">اطلاعات تماس</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <FiMail className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">ایمیل</h3>
                    <p className="text-gray-300">info@iranche.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <FiPhone className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">تلفن</h3>
                    <p className="text-gray-300">۰۲۱-۱۲۳۴۵۶۷۸</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <FiMapPin className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">آدرس</h3>
                    <p className="text-gray-300">تهران، خیابان آزادی، پلاک ۱۲۳</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <FiClock className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">ساعات کاری</h3>
                    <p className="text-gray-300">شنبه تا پنجشنبه: ۹ صبح تا ۵ عصر</p>
                  </div>
                </div>
              </div>
            </div>

            {/* نقشه */}
            <div className="bg-primary-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-bold mb-6">موقعیت ما</h2>
              <div className="aspect-video bg-gray-800 rounded-lg">
                {/* در اینجا می‌توانید نقشه گوگل را قرار دهید */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  نقشه گوگل
                </div>
              </div>
            </div>
          </div>

          {/* فرم تماس */}
          <div className="bg-primary-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-6">پیام خود را ارسال کنید</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">نام و نام خانوادگی</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white border border-purple-500/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
                  placeholder="نام و نام خانوادگی خود را وارد کنید"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">ایمیل</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white border border-purple-500/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
                  placeholder="ایمیل خود را وارد کنید"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">موضوع</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white border border-purple-500/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
                  placeholder="موضوع پیام خود را وارد کنید"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">پیام</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-gray-800 text-white border border-purple-500/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
                  placeholder="پیام خود را وارد کنید"
                  required
                ></textarea>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              >
                <FiSend className="ml-2" />
                ارسال پیام
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 