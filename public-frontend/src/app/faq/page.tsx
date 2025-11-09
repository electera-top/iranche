'use client';

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiShoppingBag, FiPlay, FiShield, FiTruck, FiUser } from 'react-icons/fi';
import Header from '@/components/layout/Header/Header';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'general',
    title: 'معرفی ایرانچه',
    icon: <FiUser className="text-xl" />,
    items: [
      {
        question: "ایرانچه چیست؟",
        answer: "ایرانچه یک پلتفرم جامع است که دو بخش اصلی دارد: ۱) پلتفرم بازی و سرگرمی برای کودکان و نوجوانان ایرانی ۲) فروشگاه ساز و پلتفرم فروش محصولات. ما با هدف ایجاد محیطی امن و جذاب برای یادگیری، سرگرمی و تجارت تأسیس شده‌ایم."
      },
      {
        question: "چگونه می‌توانم در ایرانچه ثبت‌نام کنم؟",
        answer: "برای ثبت‌نام در ایرانچه، کافیست روی دکمه ثبت‌نام در صفحه اصلی کلیک کنید و اطلاعات مورد نیاز را وارد نمایید. ثبت‌نام برای کودکان زیر ۱۳ سال نیاز به تأیید والدین دارد."
      }
    ]
  },
  {
    id: 'gaming',
    title: 'بخش بازی و سرگرمی',
    icon: <FiPlay className="text-xl" />,
    items: [
      {
        question: "آیا بازی‌های ایرانچه رایگان هستند؟",
        answer: "بله، بسیاری از بازی‌های ایرانچه رایگان هستند. برخی از بازی‌های ویژه ممکن است نیاز به خرید داشته باشند که با قیمت‌های مناسب ارائه می‌شوند."
      },
      {
        question: "چگونه می‌توانم از امنیت فرزندم مطمئن باشم؟",
        answer: "ما در ایرانچه به امنیت کاربران اهمیت ویژه‌ای می‌دهیم. تمام محتواها قبل از انتشار بررسی می‌شوند و سیستم‌های پیشرفته فیلترینگ و نظارت والدین در اختیار شما قرار دارد."
      },
      {
        question: "آیا امکان محدود کردن زمان استفاده وجود دارد؟",
        answer: "بله، والدین می‌توانند از طریق پنل مدیریت، زمان استفاده فرزندشان را محدود کنند و برنامه‌های زمانی مشخصی را تعیین نمایند."
      }
    ]
  },
  {
    id: 'store',
    title: 'فروشگاه ساز و فروش محصولات',
    icon: <FiShoppingBag className="text-xl" />,
    items: [
      {
        question: "چگونه می‌توانم فروشگاه خود را در ایرانچه راه‌اندازی کنم؟",
        answer: "برای راه‌اندازی فروشگاه، ابتدا در پنل فروشندگان ثبت‌نام کنید. پس از تأیید اطلاعات، می‌توانید محصولات خود را آپلود کرده و فروشگاه خود را شخصی‌سازی کنید."
      },
      {
        question: "چه نوع محصولاتی می‌توانم در ایرانچه بفروشم؟",
        answer: "شما می‌توانید انواع محصولات فیزیکی و دیجیتال را در ایرانچه به فروش برسانید. محصولات باید مطابق با قوانین و مقررات ایرانچه باشند."
      },
      {
        question: "سیستم پرداخت ایرانچه چگونه است؟",
        answer: "ایرانچه از سیستم پرداخت امن و مطمئن استفاده می‌کند. مشتریان می‌توانند از طریق درگاه‌های بانکی معتبر پرداخت خود را انجام دهند."
      }
    ]
  },
  {
    id: 'security',
    title: 'امنیت و حریم خصوصی',
    icon: <FiShield className="text-xl" />,
    items: [
      {
        question: "اطلاعات من چگونه محافظت می‌شود؟",
        answer: "ما از آخرین استانداردهای امنیتی برای محافظت از اطلاعات کاربران استفاده می‌کنیم. تمام داده‌ها رمزنگاری شده و در سرورهای امن ذخیره می‌شوند."
      },
      {
        question: "آیا اطلاعات پرداخت من امن است؟",
        answer: "بله، تمام تراکنش‌های مالی از طریق درگاه‌های بانکی معتبر و امن انجام می‌شود. ما هیچ اطلاعات پرداختی را ذخیره نمی‌کنیم."
      }
    ]
  },
  {
    id: 'shipping',
    title: 'حمل و نقل و تحویل',
    icon: <FiTruck className="text-xl" />,
    items: [
      {
        question: "هزینه ارسال چگونه محاسبه می‌شود؟",
        answer: "هزینه ارسال بر اساس وزن محصول، مسافت و روش ارسال انتخابی محاسبه می‌شود. شما می‌توانید قبل از پرداخت، هزینه دقیق ارسال را مشاهده کنید."
      },
      {
        question: "مدت زمان تحویل محصول چقدر است؟",
        answer: "مدت زمان تحویل بستگی به نوع محصول، محل ارسال و روش ارسال انتخابی دارد. معمولاً محصولات بین ۲ تا ۷ روز کاری تحویل داده می‌شوند."
      }
    ]
  }
];

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestions, setOpenQuestions] = useState<{ [key: string]: boolean }>({});

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const toggleQuestion = (categoryId: string, questionIndex: number) => {
    const key = `${categoryId}-${questionIndex}`;
    setOpenQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">سوالات متداول</h1>
          
          <div className="space-y-4">
            {faqCategories.map((category) => (
              <div
                key={category.id}
                className="bg-primary-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-right hover:bg-purple-500/10 transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                      {category.icon}
                    </div>
                    <span className="text-lg font-medium">{category.title}</span>
                  </div>
                  {openCategory === category.id ? (
                    <FiChevronUp className="text-purple-400" />
                  ) : (
                    <FiChevronDown className="text-purple-400" />
                  )}
                </button>
                
                {openCategory === category.id && (
                  <div className="px-6 py-4 border-t border-purple-500/20">
                    <div className="space-y-4">
                      {category.items.map((item, index) => (
                        <div key={index} className="border-b border-purple-500/20 last:border-0 pb-4 last:pb-0">
                          <button
                            className="w-full text-right flex items-center justify-between"
                            onClick={() => toggleQuestion(category.id, index)}
                          >
                            <span className="text-gray-300">{item.question}</span>
                            {openQuestions[`${category.id}-${index}`] ? (
                              <FiChevronUp className="text-purple-400" />
                            ) : (
                              <FiChevronDown className="text-purple-400" />
                            )}
                          </button>
                          
                          {openQuestions[`${category.id}-${index}`] && (
                            <div className="mt-2 pr-6 text-gray-400">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 