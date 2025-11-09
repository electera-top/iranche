'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default function PaymentSuccessPage() {
  const [animationStep, setAnimationStep] = useState(0);
  // مقدار طلای کسب شده - می‌تواند از طریق URL پارامتر یا context انتقال داده شود
  const goldAmount = 0.5;
  const orderNumber = "IR-" + Math.floor(100000 + Math.random() * 900000);
  
  useEffect(() => {
    // تنظیم مراحل انیمیشن با زمان‌بندی
    const timers = [
      setTimeout(() => setAnimationStep(1), 500),  // شروع انیمیشن شمش طلا
      setTimeout(() => setAnimationStep(2), 2000), // شروع حرکت شمش طلا
      setTimeout(() => setAnimationStep(3), 3500), // رسیدن به کیف پول
      setTimeout(() => setAnimationStep(4), 4500)  // نمایش کامل پیام موفقیت
    ];
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-800 py-8 flex flex-col items-center">
      <style jsx global>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes scaleUp {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideToWallet {
          0% { transform: translate(200px, 0) rotate(0deg); }
          50% { transform: translate(100px, -50px) rotate(10deg); }
          100% { transform: translate(0, 0) rotate(25deg); }
        }
        
        @keyframes walletGlow {
          0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(255, 215, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
        }
        
        @keyframes moveToCenter {
          0% { transform: translate(0, -50%); }
          100% { transform: translate(50%, -50%); }
        }
        
        @keyframes coinPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 215, 0, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite;
        }
        
        .gold-texture {
          background: linear-gradient(45deg, #ffd700, #f5c71a, #ffcc00, #e6bc23);
          background-size: 200% 200%;
          animation: shimmer 5s infinite;
        }
      `}</style>

      <div className="w-full max-w-md mx-auto px-4">
        {/* کارت اصلی با نتیجه پرداخت */}
        <div className="bg-primary-800/80 backdrop-blur-sm rounded-xl shadow-xl border border-primary-700 overflow-hidden">
          {/* بخش بالایی با آیکون موفقیت */}
          <div className="bg-gradient-to-r from-primary-700/70 to-primary-700/50 p-6 flex flex-col items-center">
            <div className={`relative transition-all duration-500 ${animationStep >= 4 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4" 
                  style={{ animation: animationStep >= 4 ? 'successPulse 2s infinite' : 'none' }}>
                <FiCheckCircle className="text-green-500" size={40} />
              </div>
              <h1 className="text-white text-xl font-bold text-center">پرداخت با موفقیت انجام شد</h1>
              <p className="text-primary-300 text-sm text-center mt-2">
                سفارش شما با شماره {orderNumber} ثبت شد
              </p>
            </div>
          </div>
          
          {/* بخش میانی با انیمیشن افزودن طلا به کیف پول */}
          <div className="p-8 relative">
            <div className="rounded-lg bg-primary-900/50 backdrop-blur-md border border-primary-700/50 p-6 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-amber-800/10 to-amber-900/20"></div>
              
              <h2 className="text-white font-bold text-base mb-4 text-center relative z-10">
                طلای شما به کیف پول اضافه شد
              </h2>
              
              {/* صحنه انیمیشن */}
              <div className="relative h-48 flex justify-center items-center overflow-hidden">
                {/* کیف پول کاربر */}
                <div 
                  className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-500
                    ${animationStep >= 2 ? 'opacity-100' : 'opacity-0'}`}
                  style={{ 
                    animation: animationStep >= 3 ? 'moveToCenter 1s forwards, walletGlow 1.5s infinite' : 'none'
                  }}
                >
                  <div className="relative">
                    <div className="w-24 h-20 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex flex-col items-center justify-center border-2 border-amber-500/30">
                      <div className="w-12 h-1 bg-amber-500/30 rounded-full mb-2"></div>
                      <div className="text-amber-300 text-xs font-bold">کیف پول</div>
                      <div className={`absolute inset-0 rounded-lg transition-opacity duration-500
                        ${animationStep >= 3 ? 'bg-gradient-to-r from-yellow-500/10 via-yellow-300/20 to-yellow-500/10 opacity-100' : 'opacity-0'}`}>
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3">
                      <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center transition-all duration-500
                        ${animationStep >= 3 ? 'bg-yellow-500 text-yellow-900' : 'bg-amber-800 text-amber-300'}`}>
                        {animationStep >= 3 ? '+' : ''}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* طلای در حال حرکت */}
                <div 
                  className={`absolute right-0 top-1/2 -translate-y-1/2 transition-opacity duration-500
                    ${animationStep >= 1 && animationStep < 4 ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    animation: animationStep === 2 ? 'slideToWallet 1.5s forwards' : 'none',
                    zIndex: 20
                  }}
                >
                  <div className="relative">
                    <div className="w-20 h-16 gold-texture rounded-md shadow-lg flex items-center justify-center transform -rotate-12">
                      <div className="shimmer"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-700/50 to-transparent rounded-md"></div>
                      <div className="relative z-10 text-amber-900 font-bold text-center">
                        <div>طلا</div>
                        <div className="text-sm">{goldAmount} گرم</div>
                      </div>
                    </div>
                    
                    {/* ذرات طلایی */}
                    {animationStep === 2 && [...Array(6)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-yellow-400"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: Math.random() * 0.5 + 0.3,
                          animation: `coinPulse ${1 + Math.random()}s infinite`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* نتیجه نهایی - نمایش طلا در کیف پول */}
                <div 
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000
                    ${animationStep >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                >
                  <div className="bg-gradient-to-br from-primary-800 to-primary-900 p-5 rounded-full border-4 border-amber-500/30 shadow-xl shadow-amber-500/10">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full gold-texture flex items-center justify-center shadow-inner">
                        <div className="shimmer"></div>
                        <svg 
                          className="w-20 h-20 text-amber-800 drop-shadow-md" 
                          fill="currentColor" 
                          viewBox="0 0 512 512"
                          style={{ animation: 'rotate 10s linear infinite' }}
                        >
                          <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V336zm0 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 500.7 251.6 512 192 512c-62.8 0-118.6-12.6-153.6-32C14.3 466.6 0 450 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V432z"/>
                        </svg>
                      </div>
                      
                      <div className="absolute inset-0 rounded-full flex items-center justify-center">
                        <div className="text-amber-900 font-bold text-center bg-amber-300/40 px-3 py-1 rounded-lg backdrop-blur-sm shadow-sm">
                          {goldAmount} گرم
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`text-center mt-4 text-primary-300 text-sm transition-all duration-500
                ${animationStep >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                این طلا به حساب کاربری شما اضافه شد و می‌توانید در پروفایل خود آن را مشاهده کنید.
              </div>
            </div>
            
            {/* اطلاعات تکمیلی سفارش */}
            <div className={`rounded-lg bg-primary-800/50 backdrop-blur-sm border border-primary-700/50 p-4 transition-all duration-1000
              ${animationStep >= 4 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              <h3 className="text-white font-medium text-sm mb-3">اطلاعات سفارش</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-400">شماره سفارش:</span>
                  <span className="text-white">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-400">زمان پرداخت:</span>
                  <span className="text-white" dir="ltr">{new Date().toLocaleString('fa-IR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-400">روش پرداخت:</span>
                  <span className="text-white">درگاه بانکی</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-400">طلای دریافتی:</span>
                  <span className="text-amber-400 font-bold">{goldAmount} گرم</span>
                </div>
              </div>
            </div>
            
            {/* دکمه‌های اقدام */}
            <div className={`flex gap-3 mt-8 transition-all duration-1000
              ${animationStep >= 4 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              <Link 
                href="/profile/wallet" 
                className="flex-1 bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white py-3 rounded-lg text-center font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                مشاهده کیف پول
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