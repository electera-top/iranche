"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { FiHome, FiSearch, FiMessageCircle, FiUser, FiSettings, FiHelpCircle, FiX, FiShoppingBag, FiGift, FiCreditCard, FiPlus, FiShoppingCart, FiPlusCircle } from 'react-icons/fi';
import { BiCoinStack, BiSolidBadgeCheck, BiMoviePlay, BiStore, BiSupport } from 'react-icons/bi';
import { MdChatBubbleOutline, MdOutlineAccountBalanceWallet, MdOutlineSupportAgent } from 'react-icons/md';
import { IoMdColorPalette } from 'react-icons/io';
import { PiGameControllerBold, PiMailbox, PiMailboxBold } from 'react-icons/pi';
import { useTheme, ThemeType } from '@/context/ThemeContext';
import { USER, STORES } from '@/lib/routes';
import { GiOpenTreasureChest } from 'react-icons/gi';
import { IoLayersOutline } from 'react-icons/io5';
import { GoChecklist } from 'react-icons/go';
import { TbCategoryPlus, TbClipboardList, TbTemplate, TbTruckDelivery, TbUserQuestion } from 'react-icons/tb';
import { FaRegHeart } from 'react-icons/fa';
import { GrCircleInformation } from 'react-icons/gr';
import { FaListCheck, FaRegCircleQuestion } from 'react-icons/fa6';
import { AiOutlineTruck } from 'react-icons/ai';
import { BsPlugin } from 'react-icons/bs';

// تعریف ساختار آیتم منو برای جستجو
interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  href: string;
}

// تعریف نوع برای گزینه‌های تم
interface ThemeOption {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  textStroke: 'black' | 'white';
}

// تعریف پراپ‌های ورودی کامپوننت
interface FloatingMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FloatingMenu({ isOpen, onClose }: FloatingMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const { theme, setTheme } = useTheme();

  // اطلاعات فرضی کاربر - در حالت واقعی از context یا API دریافت می‌شود
  const user = {
    isLoggedIn: true,
    name: "کاربر ایرانچه",
    avatar: "/images/avatar-placeholder.jpg", // آدرس تصویر پروفایل کاربر
    coins: 1250987, // موجودی کیف پول عادی - برای تست با عدد بزرگتر
    goldCoins: 8542, // موجودی کیف پول طلا - برای تست با عدد بزرگتر
    vipStatus: true, // وضعیت VIP کاربر
    vipLevel: "طلایی", // سطح عضویت VIP
  };

  // لیست تمام آیتم‌های منو برای جستجو
  const allMenuItems: MenuItem[] = useMemo(() => [
    // دسترسی سریع
    { id: 'home', title: 'خانه', icon: <FiHome className="w-5 h-5 text-secondary" />, href: '/' },
    { id: 'search', title: 'جستجو', icon: <FiSearch className="w-5 h-5 text-secondary" />, href: '/search' },
    { id: 'shop', title: 'فروشگاه', icon: <FiShoppingBag className="w-5 h-5 text-secondary" />, href: '/shop' },
    { id: 'explore', title: 'اکسپلور', icon: <BiMoviePlay className="w-5 h-5 text-secondary" />, href: '/explore' },
    { id: 'games', title: 'بازی و سرگرمی', icon: <PiGameControllerBold className="w-5 h-5 text-secondary" />, href: '/games' },
    { id: 'store-register', title: 'ثبت فروشگاه', icon: <FiPlus className="w-5 h-5 text-secondary" />, href: USER.REGISTER },
    { id: 'floor-guide', title: 'راهنمای طبقات', icon: <BiStore className="w-5 h-5 text-secondary" />, href: STORES },
    
    // حساب کاربری
    { id: 'profile', title: 'پروفایل', icon: <FiUser className="w-5 h-5 text-secondary" />, href: USER.LOGIN },
    { id: 'wallet', title: 'کیف پول', icon: <MdOutlineAccountBalanceWallet className="w-5 h-5 text-secondary" />, href: '/wallet' },
    { id: 'gifts', title: 'جوایز', icon: <FiGift className="w-5 h-5 text-secondary" />, href: '/gifts' },
    
    // پشتیبانی
    { id: 'support', title: 'پشتیبانی', icon: <FiMessageCircle className="w-5 h-5 text-secondary" />, href: '/support' },
    { id: 'settings', title: 'تنظیمات', icon: <FiSettings className="w-5 h-5 text-secondary" />, href: '/settings' },
    { id: 'help', title: 'راهنما', icon: <FiHelpCircle className="w-5 h-5 text-secondary" />, href: '/help' },
  ], []);

  // جستجو در آیتم‌های منو
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = allMenuItems.filter(item => 
      item.title.toLowerCase().includes(query)
    );
    
    setSearchResults(results);
  }, [searchQuery, allMenuItems]);

  // تابع بستن منو و پاک کردن جستجو
  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  // به روز رسانی مقدار context
  useEffect(() => {
    // اینجا می‌توان کد اضافی برای به‌روزرسانی مرتبط با منو قرار داد
    // این useEffect برای کارهای آینده است
  }, [isOpen]);

  // تابع کمکی برای فرمت کردن اعداد بزرگ
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'mg';
    }
    return num.toString();
  };

  // Theme options configuration
  const themeOptions: ThemeOption[] = [
    { id: 'navy-cream', name: 'کرمی (اصلی)', primaryColor: '#0A1A35', secondaryColor: '#f3ddb9', textStroke: 'black' },
    { id: 'navy-pink', name: 'صورتی', primaryColor: '#0A1A35', secondaryColor: '#ff8da1', textStroke: 'black' },
    { id: 'navy-blue', name: 'فیروزه‌ای', primaryColor: '#0A1A35', secondaryColor: '#00f7ff', textStroke: 'black' },
    { id: 'navy-gold', name: 'طلایی', primaryColor: '#0A1A35', secondaryColor: '#ffff3c', textStroke: 'black' },
    { id: 'navy-orange', name: 'نارنجی', primaryColor: '#0A1A35', secondaryColor: '#ff8400', textStroke: 'white' },
    { id: 'default', name: 'قرمز', primaryColor: '#0A1A35', secondaryColor: '#ed1c24', textStroke: 'white' }
  ];

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    
    // Store stroke color information related to theme
    const selectedTheme = themeOptions.find(theme => theme.id === newTheme);
    if (selectedTheme) {
      // Set text-stroke-color directly in localStorage
      localStorage.setItem('text-stroke-color', selectedTheme.textStroke);
      
      // Dispatch a custom event for theme change
      const themeChangeEvent = new CustomEvent('themechange', {
        detail: {
          theme: newTheme,
          textStroke: selectedTheme.textStroke
        }
      });
      window.dispatchEvent(themeChangeEvent);
      
      // Call the global method if it exists (as a fallback)
      if (typeof window !== 'undefined' && (window as any).updateIrancheTheme) {
        try {
          (window as any).updateIrancheTheme();
        } catch (error) {
          console.error('Error calling updateIrancheTheme:', error);
        }
      }
      
      console.log(`Theme changed to: ${newTheme}, text stroke: ${selectedTheme.textStroke}`);
    }
  };

  return (
    <>
      {/* منوی بازشو */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* پس‌زمینه تیره */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
            />

            {/* منوی اصلی */}
            <motion.div
              className="fixed top-0 right-0 h-full z-50 bg-primary border-l border-primary-600 shadow-xl w-80 overflow-y-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col">
                {/* دکمه بستن منو */}
                <motion.button
                  className="absolute top-4 right-4 text-white hover:text-secondary rounded-full p-2 transition-colors z-20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                >
                  <FiX className="w-5 h-5" />
                </motion.button>

                {/* بخش پروفایل کاربر */}
                <div className="relative">
                  {/* پس‌زمینه تزئینی */}
                  <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-r from-secondary/30 to-primary-600/80 overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-[url('/images/pattern-luxury.png')] bg-repeat opacity-20"
                      animate={{ 
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      }}
                      transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary"></div>
                  </div>
                  
                  {/* محتوای پروفایل */}
                  <div className="relative z-10 pt-14 px-5 pb-5">
                    {user.isLoggedIn ? (
                      <div className="flex flex-col items-center">
                        {/* بخش آواتار و نام کاربری */}
                        <div className="flex flex-col items-center mb-5">
                          <div className="relative">
                            {/* قاب تزئینی آواتار */}
                            <motion.div 
                              className="absolute inset-0 rounded-full border-2 border-secondary/60"
                              animate={{ 
                                boxShadow: ['0 0 0px rgba(249, 115, 22, 0.4)', '0 0 15px rgba(249, 115, 22, 0.4)', '0 0 0px rgba(249, 115, 22, 0.4)']
                              }}
                              transition={{ 
                                duration: 3,
                                repeat: Infinity
                              }}
                            />
                            <div className="w-20 h-20 rounded-full bg-white/10 overflow-hidden border-2 border-secondary flex items-center justify-center relative">
                              {/* تصویر پروفایل یا آیکون پیش‌فرض */}
                              <FiUser className="w-10 h-10 text-white" />
                              
                              {/* نشانگر آنلاین */}
                              <motion.div 
                                className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                              >
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </motion.div>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-center">
                            <motion.div 
                              className="text-white font-bold text-xl"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {user.name}
                            </motion.div>
                            
                        
                          </div>
                        </div>
                        
                        {/* کارت ترکیبی کیف پول و سکه طلا */}
                        <div className="w-full mt-1">
                          <motion.div 
                            className="relative w-full overflow-hidden rounded-xl shadow-lg"
                            whileHover={{ y: -3 }}
                          >
                            {/* کارت اصلی - تغییر به دو بخش جداگانه */}
                            <div className="relative overflow-hidden">
                              {/* بخش اول (کیف پول) */}
                              <div className="p-3 relative overflow-hidden">
                                {/* پس‌زمینه گرادیانی کارت کیف پول */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-900 to-primary-900"></div>

                                {/* افکت نور متحرک */}
                                <motion.div 
                                  className="absolute inset-0 opacity-30"
                                  style={{ 
                                    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)' 
                                  }}
                                  animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                  }}
                                  transition={{ 
                                    duration: 8,
                                    repeat: Infinity
                                  }}
                                />
                                
                               
                              
                                {/* محتوای کارت - عنوان  */}
                                <div className="relative z-10">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="text-sm text-white font-medium">کیف پول‌ شما</div>
                                    <Link 
                                      href="/wallet"
                                      className="bg-white/20 text-white text-xs py-1 px-2 rounded hover:bg-white/30 transition-colors"
                                      onClick={handleClose}
                                    >
                                      مدیریت
                                    </Link>
                                  </div>
                                  
                                  {/* فضای اصلی کیف پول‌ها */}
                                  <div className="grid grid-cols-2 gap-3 mt-3">
                                    {/* کیف پول اصلی */}
                                    <div className="flex-1 bg-lime-500 backdrop-blur-sm rounded-lg p-3">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-lime-600 p-1.5 rounded-md">
                                          <MdOutlineAccountBalanceWallet className="text-primary w-4 h-4" />
                                        </div>
                                        <div className="text-xs text-primary">کیف پول</div>
                                      </div>
                                     <div className='flex flex-col items-center'>
                                     <div className="text-primary font-bold text-lg flex items-baseline">
                                        <span className="text-primary">{user.coins}</span>
                                      </div>
                                       
                                       <span className="text-primary">
                                       تومان
                                       </span>
                                     </div>
                                       
                                    </div>
                                    
                                    {/* کیف پول سکه طلا با رنگ طلایی برجسته */}
                                    <div className="flex-1 rounded-lg p-2 relative overflow-hidden">
                                      {/* پس‌زمینه گرادیانی طلایی */}
                                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-amber-400 to-yellow-600"></div>

                                      {/* افکت درخشش طلایی */}
                                      <motion.div 
                                        className="absolute inset-0"
                                        style={{ 
                                          background: 'radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0) 70%)' 
                                        }}
                                        animate={{ 
                                          opacity: [0.4, 0.6, 0.4]
                                        }}
                                        transition={{ 
                                          duration: 4,
                                          repeat: Infinity
                                        }}
                                      />

                                      {/* محتوای کیف پول طلا */}
                                      <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            {/* <BiCoinStack /> */}
                                            <GiOpenTreasureChest  className="text-primary w-6 h-6"/>

                                          <div className="text-xs text-primary font-medium">موجودی طلا</div>
                                        </div>
                                        <div className="font-bold text-lg flex  flex-col items-center">
                                          <span className="text-primary">{user.goldCoins}</span>
                                          <span className="text-[10px] mr-1 text-primary">صوت طلا</span>
                                        </div>
                                      
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* دکمه های عملیات */}
                                  <div className="mt-3 grid grid-cols-2 gap-2">
                                    <Link 
                                      href="/transactions"
                                      className="text-center text-xs bg-white/10 text-white py-1.5 px-1 rounded-md hover:bg-white/20 transition-colors flex items-center justify-center gap-1"
                                      onClick={handleClose}
                                    >
                                      <FiCreditCard className="w-3 h-3" />
                                      <span>تراکنش‌ها</span>
                                    </Link>
                                    <Link 
                                      href="/exchange"
                                      className="text-center text-xs bg-white/10 text-white py-1.5 px-1 rounded-md hover:bg-white/20 transition-colors flex items-center justify-center gap-1"
                                      onClick={handleClose}
                                    >
                                      <span>برداشت </span>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-white/10 overflow-hidden border-2 border-secondary/50 flex items-center justify-center">
                          <FiUser className="w-10 h-10 text-white/50" />
                        </div>
                        <div className="text-center">
                          <div className="text-white/80 mb-2">برای دسترسی به امکانات بیشتر وارد شوید</div>
                          <Link 
                            href={USER.LOGIN}
                            onClick={handleClose}
                            className="bg-secondary py-2.5 px-6 rounded-lg text-white font-medium hover:bg-secondary-600 transition-colors inline-flex items-center gap-2"
                          >
                            <FiUser className="w-4 h-4" />
                            <span>ورود / ثبت‌نام</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 py-3">
                  {/* جستجوی سریع */}
                  <div className="relative mb-4 mt-2">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"></div>
                    <input 
                      type="text" 
                      placeholder="جستجو در گزینه ها ..."
                      className="w-full bg-transparent text-white rounded-xl py-3 px-10 focus:outline-none focus:ring-1 focus:ring-secondary/30 relative z-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <motion.div 
                      className="absolute top-1 mt-3 right-3 -translate-y-1/2 text-secondary z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiSearch className="w-5 h-5" />
                    </motion.div>
                    
                    {/* دکمه پاک کردن جستجو */}
                    {searchQuery && (
                      <motion.button 
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-white/70 z-10 p-1 hover:text-white"
                        onClick={() => setSearchQuery('')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiX className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>

                  {/* نمایش نتایج جستجو */}
                  {searchResults.length > 0 ? (
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <div className="w-1 h-4 bg-secondary rounded-full mr-2"></div>
                        <h3 className="text-white text-sm font-medium">نتایج جستجو</h3>
                      </div>
                      
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10">
                        {searchResults.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors group"
                            onClick={handleClose}
                          >
                            <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center">
                              {item.icon}
                            </div>
                            <span className="text-white/90 group-hover:text-white">{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : searchQuery ? (
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6 text-center">
                      <span className="text-white/70 text-sm">موردی یافت نشد</span>
                    </div>
                  ) : null}

                  {/* منوی اصلی - فقط نمایش در صورتی که جستجویی انجام نشده باشد */}
                  {!searchQuery && (
                    <div className="flex flex-col space-y-5">
                      {/* دسترسی سریع */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center mb-3">
                          <h3 className="text-white text-sm font-medium">منوی اصلی</h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Link 
                            href="/"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <FiHome className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">خانه</span>
                          </Link>

                          <Link 
                            href="/search"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <IoLayersOutline className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">طبقات</span>
                          </Link>
                          
                          <Link 
                            href="/shop"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <BiMoviePlay className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">اکسپلور</span>
                          </Link>
                        </div>
                      </div>

                     
                      
                      {/* حساب کاربری */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center mb-3">
                          <h3 className="text-white text-sm font-medium">حساب کاربری</h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Link 
                            href={USER.LOGIN}
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <FiUser className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">پروفایل</span>
                          </Link>

                          <Link 
                            href="/wallet"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <MdOutlineAccountBalanceWallet className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">کیف پول</span>
                          </Link>
                          
                          <Link 
                            href="/gifts"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <FaRegHeart className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">علاقه‌مندی‌ها</span>
                          </Link>
                        </div>
                      </div>

                         {/* خرید  */}
                         <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center mb-3">
                          <h3 className="text-white text-sm font-medium">خرید</h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Link 
                            href="/"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <BiStore className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">فروشگاه</span>
                          </Link>

                          <Link 
                            href="/search"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <FiShoppingCart className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">سبد خرید</span>
                          </Link>
                          
                          <Link 
                            href="/shop"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <TbClipboardList className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">سفارشات</span>
                          </Link>
                        </div>
                      </div>
                    
                         

    {/* ثبت فروشگاه */}
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center mb-3">
                          <h3 className="text-white text-sm font-medium">ثبت فروشگاه</h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Link 
                            href="/support"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <FiPlusCircle className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">ثبت‌فروشگاه</span>
                          </Link>

                          <Link 
                            href="/settings"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <FaRegCircleQuestion className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">راهنما</span>
                          </Link>
                          
                          <Link 
                            href="/help"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <FaListCheck className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">ویژگی ها</span>
                          </Link>
                        </div>
                      </div>
                      
                       {/* ثبت فروشگاه */}
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center mb-3">
                          <h3 className="text-white text-sm font-medium">جعبه ابزار</h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Link 
                            href="/support"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <TbTemplate className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">قالب ها</span>
                          </Link>

                          <Link 
                            href="/settings"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <BsPlugin className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">افزونه ها</span>
                          </Link>
                          
                          <Link 
                            href="/help"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <TbCategoryPlus className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">خدمات</span>
                          </Link>
                        </div>
                      </div>
                      
                    
                        
                      {/* پشتیبانی */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center mb-3">
                          <h3 className="text-white text-sm font-medium">پشتیبانی</h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Link 
                            href="/support"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <MdChatBubbleOutline className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">گفتگو</span>
                          </Link>

                          <Link 
                            href="/settings"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <BiSupport className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">پشتیبانی</span>
                          </Link>
                          
                          <Link 
                            href="/help"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <AiOutlineTruck className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">پیگیری‌سفارش</span>
                          </Link>
                        </div>
                      </div>

                          {/* اطلاعات */}
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center mb-3">
                          <h3 className="text-white text-sm font-medium">اطلاعات</h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Link 
                            href="/support"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <GrCircleInformation className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">درباره ما</span>
                          </Link>

                          <Link 
                            href="/settings"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <TbUserQuestion className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">سوالات‌متدوال</span>
                          </Link>
                          
                          <Link 
                            href="/help"
                            className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-white/10 group"
                            onClick={handleClose}
                          >
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mb-2 relative"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                              <PiMailboxBold className="w-5 h-5 text-secondary relative z-10" />
                            </motion.div>
                            <span className="text-white/80 text-xs group-hover:text-white">انتقادات</span>
                          </Link>
                        </div>
                      </div>


                      {/* بخش تغییر تم */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 overflow-hidden relative">
                        {/* پس زمینه تزئینی */}
                        <div className="absolute inset-0 overflow-hidden opacity-10">
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-transparent"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          />
                          <div className="absolute top-0 left-0 right-0 h-full opacity-30">
                            <svg className="absolute top-0 right-0 h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <path d="M0,0 L100,0 C70,20 50,50 100,100 L0,100 Z" fill="white" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center mb-4">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white text-sm font-medium">انتخاب تم</h3>
                            </div>
                          </div>
                          
                          <motion.div 
                            className="grid grid-cols-3 gap-2 mb-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {themeOptions.map((option, index) => (
                              <motion.button
                                key={option.id}
                                onClick={() => handleThemeChange(option.id as ThemeType)}
                                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg relative overflow-hidden ${
                                  theme === option.id 
                                    ? 'ring-2 ring-secondary/50' 
                                    : 'hover:bg-white/10'
                                }`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {/* Indicate active theme */}
                                {theme === option.id && (
                                  <motion.div 
                                    className="absolute inset-0 bg-white/10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  />
                                )}
                                
                                {/* Color preview */}
                                <div className="relative w-full h-10 rounded-md overflow-hidden shadow-md">
                                  <div 
                                    className="absolute inset-0 w-full h-full"
                                    style={{ backgroundColor: option.primaryColor }}
                                  />
                                  <div 
                                    className="absolute bottom-0 left-0 right-0 h-3"
                                    style={{ backgroundColor: option.secondaryColor }}
                                  />
                                </div>
                                
                                {/* Theme name */}
                                <span className="text-white/80 text-[10px] font-semibold text-center mt-1 line-clamp-1">
                                  {option.name.split('(')[0].trim()}
                                </span>
                                
                                {/* Active indicator */}
                               
                              </motion.button>
                            ))}
                          </motion.div>
                          
                       
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 