 'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiXCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentFailedPage() {
  const [animationStep, setAnimationStep] = useState(0);
  const orderNumber = "IR-" + Math.floor(100000 + Math.random() * 900000);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStep(1), 500),  // Show error message
      setTimeout(() => setAnimationStep(2), 2000), // Show error details
    ];
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-800 py-8 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-primary-800/80 backdrop-blur-sm rounded-xl shadow-xl border border-primary-700 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-700/70 to-primary-700/50 p-6 flex flex-col items-center">
            <div className={`relative transition-all duration-500 ${animationStep >= 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <FiXCircle className="text-red-500" size={40} />
              </div>
              <h1 className="text-white text-xl font-bold text-center">پرداخت ناموفق</h1>
              <p className="text-primary-300 text-sm text-center mt-2">
                متأسفانه پرداخت شما با مشکل مواجه شد
              </p>
            </div>
          </div>
          
          <div className="p-8 relative">
            <div className="rounded-lg bg-primary-900/50 backdrop-blur-md border border-primary-700/50 p-6 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-red-800/10 to-red-900/20"></div>
              
              <h2 className="text-white font-bold text-base mb-4 text-center relative z-10">
                علت احتمالی خطا
              </h2>
              
              <div className="space-y-3 text-sm">
                <motion.div
                  className="flex items-start gap-2 text-red-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animationStep >= 1 ? 1 : 0, y: animationStep >= 1 ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                  <p>عدم تأیید تراکنش توسط بانک</p>
                </motion.div>
                
                <motion.div
                  className="flex items-start gap-2 text-red-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animationStep >= 1 ? 1 : 0, y: animationStep >= 1 ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                  <p>عدم موجودی کافی در حساب</p>
                </motion.div>
                
                <motion.div
                  className="flex items-start gap-2 text-red-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animationStep >= 1 ? 1 : 0, y: animationStep >= 1 ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                  <p>مشکل در ارتباط با درگاه پرداخت</p>
                </motion.div>
              </div>
              
              <div className={`text-center mt-6 text-primary-300 text-sm transition-all duration-500
                ${animationStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                لطفاً مجدداً تلاش کنید یا با پشتیبانی تماس بگیرید
              </div>
            </div>
            
            <div className={`rounded-lg bg-primary-800/50 backdrop-blur-sm border border-primary-700/50 p-4 transition-all duration-1000
              ${animationStep >= 2 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              <h3 className="text-white font-medium text-sm mb-3">اطلاعات تراکنش</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-400">شماره تراکنش:</span>
                  <span className="text-white">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-400">زمان تلاش:</span>
                  <span className="text-white" dir="ltr">{new Date().toLocaleString('fa-IR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-400">وضعیت:</span>
                  <span className="text-red-400 font-bold">ناموفق</span>
                </div>
              </div>
            </div>
            
            <div className={`flex gap-3 mt-8 transition-all duration-1000
              ${animationStep >= 2 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              <Link 
                href="/cart" 
                className="flex-1 bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white py-3 rounded-lg text-center font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                تلاش مجدد
              </Link>
              <Link 
                href="/" 
                className="flex-1 bg-primary-700/50 hover:bg-primary-700 text-white py-3 rounded-lg text-center font-medium border border-primary-600/30 shadow-md hover:shadow-lg transition-all duration-300"
              >
                بازگشت به خانه
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}