'use client';

import { 
  FiBarChart2, FiDollarSign, 
  FiPackage, FiStar, FiActivity, FiTrendingUp, FiTrello, 
  FiAward, FiShoppingBag, FiMessageCircle, FiCreditCard, FiMessageSquare
} from 'react-icons/fi';
import Button from '@/components/ui/button/Button';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  // State برای نمایش محتوا
  const [isLoaded, setIsLoaded] = useState(false);

  // ترفند برای اطمینان از رندر شدن محتوا
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Mock user data
  const user = {
    name: 'علی محمدی',
    email: 'ali.mohammadi@example.com',
    phone: '09123456789',
    avatar: '/avatars/default.jpg',
    joinDate: 'فروردین ۱۴۰۳',
    recentActivity: [
      { type: 'order', title: 'سفارش جدید', date: '۲ ساعت پیش', icon: FiPackage },
      { type: 'message', title: 'پیام جدید', date: '۳ ساعت پیش', icon: FiMessageSquare },
      { type: 'favorite', title: 'محصول جدید به علاقه‌مندی‌ها', date: '۵ ساعت پیش', icon: FiStar }
    ],
    statistics: {
      totalOrders: 45,
      totalSpent: '۱۲,۵۰۰,۰۰۰ تومان',
      averageOrder: '۲۷۸,۰۰۰ تومان',
      favoriteStores: 8
    }
  };

  // نمایش لودینگ تا زمانی که صفحه آماده شود
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-12 min-h-[500px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-500/30 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-blue-500/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dashboard-content">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-900 to-primary-950 p-6 mb-8 border border-primary-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"></div>
        <h2 className="text-2xl font-bold text-white mb-3 flex items-center relative z-10">
          <FiBarChart2 className="ml-2 text-secondary" />
          داشبورد شخصی
        </h2>
        <p className="text-gray-300 mb-2 relative z-10">خوش آمدید {user.name}!</p>
        <p className="text-gray-400 text-sm relative z-10">از این داشبورد می‌توانید تمام فعالیت‌های حساب کاربری خود را مدیریت کنید.</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-800/70 to-primary-900/90 p-5 border border-primary-700/30">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
          <div className="flex items-center mb-3">
            <div className="rounded-full bg-gradient-to-r from-amber-400 to-amber-600 p-2 ml-3">
              <FiPackage className="text-white text-lg" />
            </div>
            <h3 className="text-white font-bold">سفارش‌ها</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{user.statistics.totalOrders}</p>
          <p className="text-gray-400 text-sm flex items-center">
            <FiTrendingUp className="text-green-400 ml-1" />
            افزایش ۱۵٪ نسبت به ماه قبل
          </p>
        </div>
        
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-800/70 to-primary-900/90 p-5 border border-primary-700/30">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/10 rounded-full blur-xl"></div>
          <div className="flex items-center mb-3">
            <div className="rounded-full bg-gradient-to-r from-green-400 to-green-600 p-2 ml-3">
              <FiDollarSign className="text-white text-lg" />
            </div>
            <h3 className="text-white font-bold">مجموع خرید</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{user.statistics.totalSpent}</p>
          <p className="text-gray-400 text-sm flex items-center">
            <FiTrendingUp className="text-green-400 ml-1" />
            افزایش ۲۰٪ نسبت به ماه قبل
          </p>
        </div>
        
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-800/70 to-primary-900/90 p-5 border border-primary-700/30">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="flex items-center mb-3">
            <div className="rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-2 ml-3">
              <FiTrendingUp className="text-white text-lg" />
            </div>
            <h3 className="text-white font-bold">میانگین سفارش</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{user.statistics.averageOrder}</p>
          <p className="text-gray-400 text-sm flex items-center">
            <FiTrendingUp className="text-green-400 ml-1" />
            افزایش ۵٪ نسبت به ماه قبل
          </p>
        </div>
        
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-800/70 to-primary-900/90 p-5 border border-primary-700/30">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="flex items-center mb-3">
            <div className="rounded-full bg-gradient-to-r from-purple-400 to-purple-600 p-2 ml-3">
              <FiStar className="text-white text-lg" />
            </div>
            <h3 className="text-white font-bold">فروشگاه‌های مورد علاقه</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{user.statistics.favoriteStores}</p>
          <p className="text-gray-400 text-sm flex items-center">
            <FiTrendingUp className="text-green-400 ml-1" />
            افزایش ۱۰٪ نسبت به ماه قبل
          </p>
        </div>
      </div>
      
      {/* Recent Activity & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-800/70 to-primary-900/90 p-6 border border-primary-700/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <FiActivity className="ml-2 text-secondary" />
            فعالیت‌های اخیر
          </h3>
          <div className="space-y-4">
            {user.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-primary-950/50 rounded-lg border border-primary-800/30 hover:border-primary-700/50 transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-primary-800/80 ml-3">
                    <activity.icon className="text-secondary text-lg" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-sm">{activity.date}</p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-secondary hover:bg-secondary/90 text-primary-950 font-bold"
                >
                  مشاهده
                </Button>
              </div>
            ))}
          </div>
          <button className="mt-4 text-secondary hover:text-secondary/80 text-sm font-medium flex items-center justify-center w-full">
            مشاهده همه فعالیت‌ها
            <FiTrello className="mr-1" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-800/70 to-primary-900/90 p-6 border border-primary-700/30">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full blur-2xl"></div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <FiAward className="ml-2 text-secondary" />
            دسترسی سریع
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            <Button variant="secondary" className="w-full bg-gradient-to-r from-secondary/90 to-secondary text-primary-950 font-bold border-none hover:from-secondary hover:to-secondary/90 flex justify-center items-center">
              <FiShoppingBag className="ml-2" />
              مشاهده محصولات جدید
            </Button>
            
            <Button variant="outline-secondary" className="w-full border border-primary-700/50 text-white hover:bg-primary-800/50 flex justify-center items-center">
              <FiMessageCircle className="ml-2" />
              پیام‌های جدید
            </Button>
            
            <Button variant="outline-secondary" className="w-full border border-primary-700/50 text-white hover:bg-primary-800/50 flex justify-center items-center">
              <FiCreditCard className="ml-2" />
              افزایش موجودی کیف پول
            </Button>
            
            <Button variant="outline-secondary" className="w-full border border-primary-700/50 text-white hover:bg-primary-800/50 flex justify-center items-center">
              <FiStar className="ml-2" />
              علاقه‌مندی‌های من
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .dashboard-content {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
} 