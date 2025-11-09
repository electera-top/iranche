"use client";

import Image from 'next/image'
import Header from '@/components/layout/Header/Header'
import MobileHeader from '@/components/layout/Header/MobileHeader'
import Button from '@/components/ui/button/Button'
import { IoChevronDown, IoAdd } from 'react-icons/io5'
import { SHOP, USER } from '@/lib/routes'
import { useEffect, useState, useCallback } from 'react'
import FreePrisonerModal from '@/components/common/FreePrisonerModal/FreePrisonerModal'

// تعریف نوع برای ویندوز با متد اضافی
interface CustomWindow extends Window {
  updateIrancheTheme?: () => void;
}

export default function Home() {
  const [textStrokeColor, setTextStrokeColor] = useState<'black' | 'white'>('white');
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [showPrisonerModal, setShowPrisonerModal] = useState(true);

  // Set mounted to true after first render (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // مدیریت تغییر رنگ استروک بر اساس تم
  const updateStrokeColor = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // دریافت تم از localStorage
      const theme = localStorage.getItem('theme');
      
      // ذخیره تم فعلی برای مقایسه بعدی
      setCurrentTheme(theme);
      
      // تم‌هایی که باید استروک مشکی داشته باشند
      const blackStrokeThemes = ['navy-blue', 'navy-gold', 'navy-cream', 'navy-pink'];
      
      // تعیین رنگ استروک بر اساس تم
      // const newStrokeColor = theme && blackStrokeThemes.includes(theme) ? 'black' : 'white';
      const newStrokeColor = 'black';
      
      console.log(`تم فعلی: ${theme}, رنگ استروک: ${newStrokeColor}`);
      setTextStrokeColor(newStrokeColor);
    } catch (error) {
      console.error('خطا در دسترسی به localStorage:', error);
    }
  }, []);

  // بروزرسانی اولیه و راه‌اندازی event listener
  useEffect(() => {
    if (!mounted) return;
    
    // بروزرسانی اولیه
    updateStrokeColor();
    
    // فعال کردن event listener برای تغییرات localStorage
    const handleStorageChange = () => {
      updateStrokeColor();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // بررسی مداوم تغییرات تم با interval
    const checkThemeInterval = setInterval(() => {
      const theme = localStorage.getItem('theme');
      if (theme !== currentTheme) {
        updateStrokeColor();
      }
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkThemeInterval);
    };
  }, [mounted, updateStrokeColor, currentTheme]);

  // اضافه کردن یک event listener برای دریافت event های custom
  useEffect(() => {
    if (!mounted) return;
    
    const handleThemeChange = () => {
      console.log('رویداد تغییر تم دریافت شد');
      updateStrokeColor();
    };
    
    // اضافه کردن یک event listener به window
    window.addEventListener('themechange', handleThemeChange);
    
    // اضافه کردن یک متد global برای فراخوانی مستقیم
    if (typeof window !== 'undefined') {
      const customWindow = window as CustomWindow;
      customWindow.updateIrancheTheme = updateStrokeColor;
    }
    
    return () => {
      window.removeEventListener('themechange', handleThemeChange);
      if (typeof window !== 'undefined') {
        const customWindow = window as CustomWindow;
        delete customWindow.updateIrancheTheme;
      }
    };
  }, [mounted, updateStrokeColor]);

  // Don't render anything until mounted (to prevent hydration errors)
  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-primary">
      <Header />
      <MobileHeader />

      {/* مودال آزادی زندانیان */}
      {showPrisonerModal && (
        <FreePrisonerModal onClose={() => setShowPrisonerModal(false)} />
      )}

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-180px)] lg:h-[calc(100vh-114.7px)] flex flex-col justify-between relative pb-20 lg:pb-0">
        <div className="container mx-auto text-center py-6 lg:py-10 relative z-10 px-4">
          <h1 className="text-6xl sm:text-4xl md:text-5xl lg:text-5xl 2xl:text-9xl font-bold mb-6 lg:mb-10 relative">
            <span 
              className={`iran-colors relative text-secondary font-kaman z-10 ${
                textStrokeColor === 'black' ? 'text-stroke-creative-black' : 'text-stroke-creative-white'
              }`}
            >
              ایرانچه
            </span>
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-white mb-6 lg:mb-8">اولین و بزرگترین مجتمع تجاری آنلاین ایران</p>
        </div>
          
        <div className="max-w-3xl w-full mx-auto flex flex-col md:flex-row justify-center items-center gap-4 mb-24 relative z-10 px-4">
          <Button 
            type="link" 
            href={SHOP} 
            variant="outline-secondary-primary"
            className="w-full flex justify-center animate-text"
          >
            <span>مشاهده طبقات و محصولات</span>
            <IoChevronDown className="w-5 h-5" />
          </Button>
          
          <Button 
            type="link" 
            href={USER.REGISTER} 
            variant="outline-secondary-primary"
            className="w-full flex justify-center animate-text-2"
          >
            <IoAdd className="w-5 h-5" />
            <span>فروشگاه من رو هم به مجتمع اضافه کن!</span>
          </Button>
        </div>

        {/* Background Building Image */}
        <div className="absolute inset-0 top-[60px] lg:top-[0px] -z-0">
          <Image
            src="/images/building.jpg"
            alt="ساختمان مجتمع تجاری"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </section>
    </main>
  )
}