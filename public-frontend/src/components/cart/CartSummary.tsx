import React from 'react';
import Link from 'next/link';
import { FiShoppingBag, FiStar, FiAward } from 'react-icons/fi';

interface CartSummaryProps {
  totalPrice: number;
  shippingCost: number;
  storeCount: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalPrice, shippingCost, storeCount }) => {
  const finalPrice = totalPrice + shippingCost;
  
  // محاسبه امتیاز و سود طلا بر اساس قیمت نهایی
  const rewardPoints = Math.floor(finalPrice / 10000); // هر 10,000 تومان 1 امتیاز
  const goldProfit = Math.floor(finalPrice / 100000) / 10; // هر 100,000 تومان 0.1 سود طلا
  
  return (
    <div className="bg-primary-800/80 backdrop-blur-sm rounded-lg shadow-md border border-primary-700 p-6 sticky top-4">
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
            rgba(255, 215, 0, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 3s infinite;
        }
      `}</style>
      
      <h2 className="font-bold text-white mb-4">خلاصه سبد خرید</h2>
      <div className="space-y-3">
        <div className="text-primary-300 text-sm mb-3">
          شامل محصولات از <span className="text-secondary-400 font-medium">{storeCount}</span> فروشگاه
        </div>
        <div className="flex justify-between text-primary-300">
          <span>جمع کل:</span>
          <span>{totalPrice.toLocaleString()} تومان</span>
        </div>
        <div className="flex justify-between text-primary-300">
          <span>هزینه ارسال:</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-secondary-400">رایگان</span>
            ) : (
              `${shippingCost.toLocaleString()} تومان`
            )}
          </span>
        </div>
        <div className="border-t border-primary-700 pt-3 mt-3">
          <div className="flex justify-between font-bold text-white">
            <span>مبلغ کل:</span>
            <span>{finalPrice.toLocaleString()} تومان</span>
          </div>
        </div>
      </div>
      
      {/* بخش امتیازات و سود طلا */}
      <div className="mt-5 bg-gradient-to-br from-primary-900/90 to-primary-800/90 rounded-lg p-5 border border-primary-600/40 backdrop-blur-sm shadow-lg">
        <h3 className="text-white font-bold text-base mb-4 flex items-center justify-center">
          <FiAward className="ml-2 text-secondary-400" size={18} style={{ animation: 'float 2s ease-in-out infinite' }} />
          پاداش‌های این خرید
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-r from-purple-900/40 to-purple-700/40 rounded-lg p-4 border border-purple-500/30 flex items-center justify-between relative overflow-hidden">
            <div className="absolute left-0 top-0 w-24 h-24 bg-purple-500/10 rounded-full -ml-10 -mt-10 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center text-purple-400 mb-1">
                <FiStar className="ml-1" size={16} style={{ animation: 'pulse 2s infinite' }} />
                <span className="text-sm font-medium">امتیاز</span>
              </div>
              <div className="text-xs text-purple-300/80 mt-1">هر 10,000 تومان = 1 امتیاز</div>
            </div>
            <div className="text-white font-bold text-2xl bg-purple-800/50 py-2 px-4 rounded-lg shadow-inner">
              {rewardPoints}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-900/40 to-amber-700/40 rounded-lg p-4 border border-amber-500/30 flex items-center justify-between relative overflow-hidden hover:shadow-amber-500/20 hover:shadow-lg transition-all duration-300">
            <div className="absolute left-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full -ml-10 -mt-10 z-0"></div>
            <div className="absolute right-0 bottom-0 w-16 h-16 bg-yellow-500/20 rounded-full -mr-6 -mb-6 z-0" style={{ animation: 'pulse 3s infinite' }}></div>
            
            <div className="absolute inset-0 overflow-hidden opacity-20">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-40 h-1 bg-gradient-to-r from-amber-300/0 via-yellow-300 to-amber-300/0"
                  style={{ 
                    top: `${30 + i * 10}%`, 
                    left: '-20%', 
                    transform: `rotate(${i * 15}deg)`,
                    animation: `pulse ${2 + i * 0.2}s infinite ${i * 0.3}s`
                  }}
                ></div>
              ))}
            </div>
            <div className="shimmer"></div>
            <div className="relative z-10">
              <div className="flex items-center text-yellow-400 mb-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-1" 
                  fill="currentColor" 
                  viewBox="0 0 512 512"
                  style={{ animation: 'float 3s ease-in-out infinite' }}
                >
                  <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V336zm0 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 500.7 251.6 512 192 512c-62.8 0-118.6-12.6-153.6-32C14.3 466.6 0 450 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V432z"/>
                </svg>
                <span className="text-sm font-bold">سود طلا</span>
              </div>
              <div className="text-xs text-yellow-300/90 mt-1">هر 100,000 تومان = 0.1 گرم</div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-amber-300/20 to-yellow-300/20 rounded-lg blur-sm"></div>
              <div className="flex items-center bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 py-3 px-5 rounded-lg border border-yellow-400/30 shadow-lg relative overflow-hidden hover:from-yellow-400 hover:to-amber-500 transition-all duration-500">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-600/60 to-transparent opacity-70"></div>
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-full h-0.5 bg-yellow-300/30"
                      style={{ 
                        top: `${20 + i * 15}%`,
                        animation: `shimmer 4s infinite ${i * 0.7}s linear`
                      }}
                    ></div>
                  ))}
                </div>
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent"
                  style={{ animation: 'shimmer 2s infinite linear' }}
                ></div>
                <div className="text-white font-bold text-2xl drop-shadow-md relative z-10" style={{ animation: 'pulse 3s infinite' }}>{goldProfit}</div>
                <div className="text-yellow-200 text-xs mr-1 font-bold relative z-10">گرم</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 py-2 px-4 bg-primary-700/30 rounded-lg text-primary-300 text-xs text-center border border-primary-600/20">
          پس از تکمیل خرید، این پاداش‌ها به حساب کاربری شما اضافه خواهد شد
        </div>
      </div>
      
      <div className="bg-primary-700/30 rounded-lg p-4 mt-6">
        <div className="text-white text-sm mb-3">
          برای پرداخت هر سفارش، به بخش مربوط به فروشگاه مراجعه کنید.
        </div>
        <div className="flex items-center text-secondary-400 text-sm">
          <FiShoppingBag className="ml-1" />
          <span>هر فروشگاه درگاه پرداخت جداگانه دارد</span>
        </div>
      </div>
      
      <Link href="/explore" className="block text-center text-secondary-400 mt-4 hover:text-secondary-300">
        ادامه خرید
      </Link>
    </div>
  );
};

export default CartSummary; 