"use client";

import React, { useState, useContext } from 'react';
import { FiHome, FiShoppingCart, FiMenu, FiCompass, FiUser } from 'react-icons/fi';
import { MdChatBubbleOutline, MdOutlineCategory } from 'react-icons/md';
import SearchBox from '@/components/common/SearchBox';
import Link from 'next/link';
import { HOME, CART } from '@/lib/routes';
import IconButton from '@/components/ui/button/IconButton';
import BottomMoreMenu from './menus/BottomMoreMenu';
import { FloatingMenuContext } from '@/components/common/FloatingMenu/FloatingMenuProvider';

export default function MobileHeader() {
  const [bottomMoreMenuOpen, setBottomMoreMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { openMenu: openFloatingMenu } = useContext(FloatingMenuContext);
  
  console.log('MobileHeader: FloatingMenuContext value:', useContext(FloatingMenuContext));
  
  const handleOpenMenu = () => {
    console.log('MobileHeader: handleOpenMenu called');
    if (openFloatingMenu) {
      openFloatingMenu();
    } else {
      console.error('MobileHeader: openFloatingMenu is undefined');
    }
  };

  const toggleBottomMoreMenu = () => {
    setBottomMoreMenuOpen(!bottomMoreMenuOpen);
    if (activeTab === 'more') {
      handleTabClick('more');
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <header className="lg:hidden">
      {/* Top Fixed Search Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-primary border-b border-primary-600 shadow-md">
        <div className="container mx-auto px-1 py-1.5 gap-2 flex items-center justify-between">
         
        <div className="flex-shrink-0">
            <button 
              onClick={handleOpenMenu}
              className="p-1.5 text-white rounded-full hover:bg-primary-700"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1">
            <SearchBox />
          </div>
          <div className="flex-shrink-0">
            <IconButton
              type="link"
              href="/auth/login"
              tooltip="ورود / ثبت‌نام"
              variant="default"
              className='inline-block pt-3'
              size="md"
            >
              <FiUser className="w-6 h-6" />
            </IconButton>
          </div>
       
        </div>
      </div>

      {/* Bottom More Menu */}
      <BottomMoreMenu 
        isOpen={bottomMoreMenuOpen}
        onClose={() => setBottomMoreMenuOpen(false)}
      />

      {/* Bottom Fixed Menu Bar - Creative Version */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary border-t border-primary-600">
        <div className="container mx-auto relative">
          {/* Center Action Button */}
          <Link 
            href={CART} 
            className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-secondary shadow-xl flex items-center justify-center outline outline-4 outline-transparent ring-4 ring-white/10 transition-transform duration-300 hover:scale-110"
            onClick={() => handleTabClick('cart')}
          >
            <FiShoppingCart className={`w-7 h-7 text-white ${activeTab === 'cart' ? 'animate-pulse' : ''}`} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">3</span>
          </Link>

          {/* Menu Items */}
          <div className="grid grid-cols-5 h-14">
            <Link 
              href={HOME} 
              className={`flex flex-col items-center justify-center ${activeTab === 'home' ? 'text-secondary' : 'text-white'} transition-all duration-300 hover:text-secondary relative pt-1.5`}
              onClick={() => handleTabClick('home')}
            >
              <FiHome className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium">خانه</span>
              {activeTab === 'home' && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-secondary rounded-t-md"></span>
              )}
            </Link>
            
            <Link 
              href="/categories" 
              className={`flex flex-col items-center justify-center ${activeTab === 'categories' ? 'text-secondary' : 'text-white'} transition-all duration-300 hover:text-secondary relative pt-1.5`}
              onClick={() => handleTabClick('categories')}
            >
              <MdOutlineCategory className={`w-5 h-5 mb-0.5 ${activeTab === 'categories' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium">دسته‌بندی</span>
              {activeTab === 'categories' && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-secondary rounded-t-md"></span>
              )}
            </Link>
            
            {/* Empty space for center button */}
            <div className="flex flex-col items-center justify-center opacity-0">
              <span className="w-5 h-5 mb-0.5"></span>
              <span className="text-[10px]">سبد خرید</span>
            </div>
            
            <Link 
              href="/messages" 
              className={`flex flex-col items-center justify-center ${activeTab === 'messages' ? 'text-secondary' : 'text-white'} transition-all duration-300 hover:text-secondary relative pt-1.5`}
              onClick={() => handleTabClick('messages')}
            >
              <div className="relative">
                <MdChatBubbleOutline className={`w-5 h-5 mb-0.5 ${activeTab === 'messages' ? 'scale-110' : ''}`} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              <span className="text-[10px] font-medium">گفتگو</span>
              {activeTab === 'messages' && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-secondary rounded-t-md"></span>
              )}
            </Link>
            
            <Link 
              href="/explore" 
              className={`flex flex-col items-center justify-center ${activeTab === 'explore' ? 'text-secondary' : 'text-white'} transition-all duration-300 hover:text-secondary relative pt-1.5`}
              onClick={() => handleTabClick('explore')}
            >
              <FiCompass className={`w-5 h-5 mb-0.5 ${activeTab === 'explore' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium">اکسپلور</span>
              {activeTab === 'explore' && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-secondary rounded-t-md"></span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer for fixed top bar */}
      <div className="h-11"></div>
      
      {/* Spacer for fixed bottom bar */}
      <div className="h-14"></div>
    </header>
  );
} 