'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// مؤلفه سکه پس‌زمینه برای انیمیشن
const BackgroundCoin = ({ delay }: { delay: number; index?: number }) => {
  // اندازه تصادفی برای هر سکه
  const size = 8 + Math.floor(Math.random() * 12);
  // موقعیت افقی تصادفی
  const leftPosition = Math.random() * 100;
  // مدت زمان تصادفی انیمیشن
  const duration = 2 + Math.random() * 4;
  // جهت چرخش تصادفی
  const rotateDir = Math.random() > 0.5 ? 180 : -180;
  
  return (
    <motion.div
      className="absolute z-10"
      initial={{ 
        bottom: -20, 
        left: `${leftPosition}%`,
        opacity: 0
      }}
      animate={{ 
        bottom: '120%', 
        opacity: [0, 0.7, 0],
        rotate: [0, rotateDir]
      }}
      transition={{ 
        duration: duration,
        delay: delay,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: Math.random() * 2
      }}
    >
      <div 
        className={`rounded-full bg-gradient-to-br from-amber-400/70 to-amber-600/70 shadow-lg`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </motion.div>
  );
};

export default function GoldReceivedPage() {
  const [animationStep, setAnimationStep] = useState(0);
  const [showBackgroundCoins, setShowBackgroundCoins] = useState(false);
  const goldAmount = 0.5;
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStep(1), 500),  // Show coin with overlay
      setTimeout(() => setAnimationStep(2), 2000), // Fade out overlay
      setTimeout(() => setAnimationStep(3), 3000), // Move coin to wallet
      setTimeout(() => setAnimationStep(4), 4000), // Show success message
      setTimeout(() => setShowBackgroundCoins(true), 1000), // Show background coins
    ];
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <div className="fixed inset-0 bg-black">
      {/* انیمیشن سکه‌های پس‌زمینه */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {showBackgroundCoins && (
          <>
            {[...Array(30)].map((_, index) => (
              <BackgroundCoin 
                key={index} 
                delay={Math.random() * 5} 
              />
            ))}
          </>
        )}
      </div>
      
      {/* Overlay */}
      <AnimatePresence>
        {animationStep === 1 && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-screen h-screen flex items-center justify-center">
          {/* کیف پول */}
          <motion.div 
            className="absolute z-10"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: animationStep >= 1 ? 1 : 0,
              scale: animationStep === 3 ? 1.1 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {/* کیف پول با طراحی جدید */}
              <div className="relative w-64 h-48">
                {/* بدنه اصلی کیف پول */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-900 rounded-2xl shadow-xl border border-amber-600/30 overflow-hidden">
                  {/* نوار بالای کیف پول */}
                  <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-amber-800 to-amber-950 rounded-t-2xl border-b border-amber-600/20 flex items-center justify-between px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-500/20 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-amber-500/40"></div>
                      </div>
                      <div className="text-amber-300 text-sm font-medium">Iranche Wallet</div>
                    </div>
                    <div className="w-16 h-2 bg-amber-600/30 rounded-full"></div>
                  </div>
                  
                  {/* بخش مرکزی کیف پول */}
                  <div className="absolute top-14 left-4 right-4 bottom-4 bg-gradient-to-br from-amber-600/20 to-amber-800/20 rounded-xl border border-amber-600/20 backdrop-blur-sm flex flex-col items-center justify-center">
                    {/* آیکون کیف پول */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10 text-amber-200" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                      </svg>
                    </div>
                    
                    {/* خطوط تزئینی */}
                    <div className="absolute top-20 left-6 w-10 h-0.5 bg-amber-500/20 rounded-full"></div>
                    <div className="absolute top-20 right-6 w-10 h-0.5 bg-amber-500/20 rounded-full"></div>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-amber-500/20 rounded-full"></div>
                  </div>
                </div>
                
                {/* Wallet glow effect when coin is about to enter */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-yellow-300/40 to-yellow-500/20 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: animationStep === 3 ? [0, 1, 0] : 0 
                  }}
                  transition={{ 
                    duration: 1,
                    times: [0, 0.5, 1],
                    repeat: 0
                  }}
                />
                
                {/* افکت درخشش کیف پول پس از دریافت سکه */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-amber-500/40 via-yellow-400/60 to-amber-500/40 rounded-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: animationStep >= 4 ? [0, 0.8, 0.2, 0.6, 0] : 0,
                    scale: animationStep >= 4 ? [0.8, 1.1, 1, 1.05, 1] : 0.8
                  }}
                  transition={{ 
                    duration: 1.5,
                    times: [0, 0.2, 0.4, 0.6, 1],
                    repeat: 0
                  }}
                />
              </div>
            </div>
          </motion.div>
          
          {/* نمایش مقدار طلای دریافتی زیر کیف پول */}
          <motion.div
            className="absolute z-10 mt-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: animationStep >= 4 ? 1 : 0,
              y: animationStep >= 4 ? 0 : -10
            }}
            transition={{ 
              duration: 0.5,
              delay: 0.7 // تاخیر برای نمایش بعد از درخشش
            }}
          >
            <div className="bg-gradient-to-r from-amber-600/60 to-amber-800/60 px-4 py-2 rounded-lg backdrop-blur-sm border border-amber-500/30 shadow-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-300" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80z"/>
                </svg>
                <span className="text-amber-300 font-bold">{goldAmount} گرم طلا دریافت شد</span>
              </div>
            </div>
          </motion.div>
          
          {/* سکه طلا */}
          <AnimatePresence>
            {animationStep < 4 && (
              <motion.div
                className="absolute z-20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: animationStep >= 3 ? 0.5 : (animationStep >= 1 ? 1 : 0),
                  opacity: 1,
                  y: animationStep >= 3 ? 50 : -120
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeInOut"
                }}
              >
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                    {/* افکت درخشش پالسی */}
                    <motion.div
                      className="absolute inset-0 bg-yellow-300/20 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.5, 0.2],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* افکت درخشش اضافی */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-amber-700/30 to-transparent rounded-full"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    <svg 
                      className="w-24 h-24 text-amber-900 drop-shadow-md relative z-10" 
                      fill="currentColor" 
                      viewBox="0 0 512 512"
                    >
                      <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V336zm0 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 500.7 251.6 512 192 512c-62.8 0-118.6-12.6-153.6-32C14.3 466.6 0 450 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V432z"/>
                    </svg>

                    {/* جرقه‌های طلایی */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut"
                      }}
                    >
                      <div className="relative w-full h-full">
                        <div className="absolute top-0 left-1/2 w-1 h-3 bg-yellow-300 rounded-full transform -translate-x-1/2 blur-sm"></div>
                        <div className="absolute top-1/4 right-1 w-2 h-2 bg-yellow-300 rounded-full blur-sm"></div>
                        <div className="absolute bottom-1/4 left-0 w-2 h-2 bg-yellow-300 rounded-full blur-sm"></div>
                        <div className="absolute bottom-0 right-1/3 w-1 h-3 bg-yellow-300 rounded-full blur-sm"></div>
                      </div>
                    </motion.div>
                    
                    {/* جرقه‌های چرخشی */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-yellow-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-sm"></div>
                      <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-yellow-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 rotate-45 blur-sm"></div>
                      <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-yellow-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 rotate-90 blur-sm"></div>
                      <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-yellow-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 rotate-135 blur-sm"></div>
                    </motion.div>
                    
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-300/70 px-3 py-1 rounded text-sm text-amber-900 font-bold backdrop-blur-sm">
                      {goldAmount} گرم
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* پیام موفقیت */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: animationStep >= 4 ? 1 : 0,
          y: animationStep >= 4 ? 0 : 20
        }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-white text-xl font-bold mb-2">طلای شما با موفقیت دریافت شد</h2>
        <p className="text-primary-300 text-sm">این طلا به کیف پول شما اضافه شد</p>
        
        <div className="flex gap-4 justify-center mt-6">
          <Link 
            href="/profile/wallet" 
            className="bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-6 py-3 rounded-lg text-center font-medium shadow-md hover:shadow-lg transition-all duration-300"
          >
            مشاهده کیف پول
          </Link>
          <Link 
            href="/" 
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg text-center font-medium border border-white/20 shadow-md hover:shadow-lg transition-all duration-300"
          >
            بازگشت به خانه
          </Link>
        </div>
      </motion.div>
    </div>
  );
}