"use client";

import React from 'react';
import { FiPhone, FiHelpCircle, FiSettings, FiStar, FiShare2, FiInfo } from 'react-icons/fi';
import { BiSupport, BiGift } from 'react-icons/bi';
import { MdFeedback } from 'react-icons/md';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomMoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BottomMoreMenu({ isOpen, onClose }: BottomMoreMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 z-50 bg-black bg-opacity-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          
          <motion.div 
            className="fixed bottom-0 left-0 right-0 z-50 bg-primary border-t border-primary-600 rounded-t-2xl overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-2 pb-6 px-4 max-h-[75vh] overflow-y-auto">
              {/* Drag handle */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6"></div>
              
              <div className="flex flex-col space-y-3">
                <div className="text-white/70 text-sm mr-2 mb-1 font-medium">مدیریت حساب</div>
                
                <Link 
                  href="/settings" 
                  className="flex items-center gap-3 text-white hover:bg-primary-700/50 p-3 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
                    <FiSettings className="w-5 h-5" />
                  </div>
                  <span className="text-base">تنظیمات</span>
                </Link>

                <Link 
                  href="/favorites" 
                  className="flex items-center gap-3 text-white hover:bg-primary-700/50 p-3 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
                    <FiStar className="w-5 h-5" />
                  </div>
                  <span className="text-base">علاقه‌مندی‌ها</span>
                </Link>

                <div className="border-t border-primary-600/50 my-2"></div>
                <div className="text-white/70 text-sm mr-2 mb-1 font-medium">پشتیبانی</div>
                
                <Link 
                  href="/support" 
                  className="flex items-center gap-3 text-white hover:bg-primary-700/50 p-3 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
                    <BiSupport className="w-5 h-5" />
                  </div>
                  <span className="text-base">پشتیبانی آنلاین</span>
                </Link>
                
                <Link 
                  href="/contact" 
                  className="flex items-center gap-3 text-white hover:bg-primary-700/50 p-3 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
                    <FiPhone className="w-5 h-5" />
                  </div>
                  <span className="text-base">تماس با ما</span>
                </Link>
                
                <Link 
                  href="/feedback" 
                  className="flex items-center gap-3 text-white hover:bg-primary-700/50 p-3 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
                    <MdFeedback className="w-5 h-5" />
                  </div>
                  <span className="text-base">ارسال بازخورد</span>
                </Link>
                
                <Link 
                  href="/help" 
                  className="flex items-center gap-3 text-white hover:bg-primary-700/50 p-3 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
                    <FiHelpCircle className="w-5 h-5" />
                  </div>
                  <span className="text-base">راهنما</span>
                </Link>

                <div className="border-t border-primary-600/50 my-2"></div>
                <div className="text-white/70 text-sm mr-2 mb-1 font-medium">دیگر</div>
                
                <Link 
                  href="/gifts" 
                  className="flex items-center gap-3 text-white hover:bg-primary-700/50 p-3 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
                    <BiGift className="w-5 h-5" />
                  </div>
                  <span className="text-base">جایزه و هدایا</span>
                </Link>
                
                <Link 
                  href="/share" 
                  className="flex items-center gap-3 text-white hover:bg-primary-700/50 p-3 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
                    <FiShare2 className="w-5 h-5" />
                  </div>
                  <span className="text-base">دعوت از دوستان</span>
                </Link>
                
                <Link 
                  href="/about" 
                  className="flex items-center gap-3 text-white hover:bg-primary-700/50 p-3 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
                    <FiInfo className="w-5 h-5" />
                  </div>
                  <span className="text-base">درباره ما</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 