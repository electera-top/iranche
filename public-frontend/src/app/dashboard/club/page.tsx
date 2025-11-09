'use client';

import { useState } from 'react';
import { FiAward, FiGift, FiCheck, FiCalendar, FiClock, FiTrendingUp, FiStar, FiShoppingCart, FiUsers, FiMessageCircle, FiPercent } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

// تعریف نوع داده‌ها
interface PointsTransaction {
  id: string;
  title: string;
  points: number;
  isPositive: boolean;
  date: string;
  time: string;
  type: 'purchase' | 'reward' | 'expired' | 'referral' | 'review' | 'exchange';
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  image: string;
  category: 'discount' | 'gift' | 'service' | 'coupon';
}

export default function ClubPage() {
  // State های صفحه
  const [activeTab, setActiveTab] = useState<'transactions' | 'rewards' | 'benefits'>('transactions');
  const [filterType, setFilterType] = useState<string>('all');

  // داده های نمونه
  const userPoints = {
    current: 3450,
    lifetime: 12750,
    level: 'طلایی',
    nextLevel: 'پلاتینیوم',
    pointsToNextLevel: 1550,
    memberSince: '۱۸ اردیبهشت ۱۴۰۳',
    rank: 232,
  };

  const pointsTransactions: PointsTransaction[] = [
    { id: '1', title: 'خرید محصول گوشی موبایل', points: 450, isPositive: true, date: '۲۵ خرداد ۱۴۰۳', time: '۱۴:۳۰', type: 'purchase' },
    { id: '2', title: 'ثبت نظر درباره لپتاپ ایسوس', points: 120, isPositive: true, date: '۲۰ خرداد ۱۴۰۳', time: '۱۰:۱۵', type: 'review' },
    { id: '3', title: 'دعوت از دوست', points: 200, isPositive: true, date: '۱۵ خرداد ۱۴۰۳', time: '۰۹:۴۵', type: 'referral' },
    { id: '4', title: 'استفاده از کد تخفیف ویژه', points: 300, isPositive: false, date: '۱۰ خرداد ۱۴۰۳', time: '۱۶:۲۰', type: 'exchange' },
    { id: '5', title: 'پاداش تولد', points: 500, isPositive: true, date: '۵ خرداد ۱۴۰۳', time: '۰۰:۰۱', type: 'reward' },
  ];

  const rewards: Reward[] = [
    { 
      id: '1', 
      title: 'کد تخفیف ۳۰ درصدی', 
      description: 'کد تخفیف ۳۰٪ برای خرید بعدی شما',
      pointsCost: 1200, 
      image: '/images/rewards/discount.jpg',
      category: 'discount',
    },
    { 
      id: '2', 
      title: 'ارسال رایگان سفارش', 
      description: 'یک بار ارسال رایگان برای سفارش',
      pointsCost: 800, 
      image: '/images/rewards/shipping.jpg',
      category: 'service',
    },
    { 
      id: '3', 
      title: 'کارت هدیه ۲۰۰ هزار تومانی', 
      description: 'کارت هدیه دیجیتال برای خرید',
      pointsCost: 3500, 
      image: '/images/rewards/gift-card.jpg',
      category: 'gift',
    },
  ];

  const clubBenefits = [
    {
      level: 'برنزی',
      minPoints: 0,
      color: 'from-amber-700 to-amber-900',
      benefits: [
        'جمع‌آوری امتیاز از خریدها',
        'امتیاز برای نظرات',
        'دسترسی به کدهای تخفیف عمومی',
      ]
    },
    {
      level: 'نقره‌ای',
      minPoints: 2000,
      color: 'from-gray-300 to-gray-500',
      benefits: [
        'تمام مزایای سطح برنزی',
        'امتیاز دو برابر برای خریدها',
        'تخفیف ۵٪ برای ارسال سفارش',
      ]
    },
    {
      level: 'طلایی',
      minPoints: 5000,
      color: 'from-amber-400 to-amber-600',
      benefits: [
        'تمام مزایای سطح نقره‌ای',
        'پشتیبانی اختصاصی',
        'ارسال رایگان ماهانه',
        'تخفیف ۱۰٪ روز تولد',
      ]
    },
    {
      level: 'پلاتینیوم',
      minPoints: 10000,
      color: 'from-blue-400 to-indigo-600',
      benefits: [
        'تمام مزایای سطح طلایی',
        'امتیاز سه برابر برای خریدها',
        'ارسال رایگان برای تمام سفارش‌ها',
        'هدیه سالگرد عضویت',
      ]
    },
  ];

  // فیلتر تراکنش‌ها
  const filteredTransactions = pointsTransactions.filter(transaction => 
    filterType === 'all' || transaction.type === filterType
  );

  return (
    <div className="p-6">
      {/* هدر صفحه */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-900 to-primary-950 p-6 mb-8 border border-primary-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl"></div>
        <h2 className="text-2xl font-bold text-white mb-3 flex items-center relative z-10">
          <FiAward className="ml-2 text-amber-400" />
          باشگاه مشتریان
        </h2>
        <p className="text-gray-300 mb-2 relative z-10">سطح فعلی شما: <span className="text-amber-400 font-bold">{userPoints.level}</span></p>
        <p className="text-gray-400 text-sm relative z-10">از امتیازات خود استفاده کنید و از مزایای ویژه بهره‌مند شوید.</p>
      </div>
      
      {/* کارت اطلاعات امتیازات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* کارت امتیازات فعلی */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-600/10 p-5 border border-amber-500/30">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl"></div>
          <div className="flex flex-col items-center text-center mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center mb-3 shadow-lg shadow-amber-400/20">
              <FiStar className="text-primary-950 text-xl" />
            </div>
            <h3 className="text-white font-bold">امتیازات فعلی</h3>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-amber-400 mb-2">{userPoints.current.toLocaleString()}</p>
            <div className="bg-primary-800/40 rounded-lg p-2 text-gray-300 text-sm">
              کل امتیازات کسب شده: {userPoints.lifetime.toLocaleString()}
            </div>
          </div>
        </div>
        
        {/* کارت سطح عضویت */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-800/70 to-primary-900/90 p-5 border border-primary-700/30">
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl"></div>
          <div className="flex flex-col items-center text-center mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20">
              <FiAward className="text-primary-950 text-xl" />
            </div>
            <h3 className="text-white font-bold">سطح عضویت</h3>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-amber-400 mb-2">{userPoints.level}</p>
            <div className="w-full bg-primary-700/30 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full" 
                style={{ width: `${((userPoints.current - 5000) / (10000 - 5000)) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-300 text-sm mb-1">
              {userPoints.pointsToNextLevel.toLocaleString()} امتیاز تا سطح {userPoints.nextLevel}
            </p>
            <div className="bg-primary-800/40 rounded-lg p-2 text-gray-300 text-sm">
              عضویت از تاریخ: {userPoints.memberSince}
            </div>
          </div>
        </div>
        
        {/* کارت رتبه */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-800/70 to-primary-900/90 p-5 border border-primary-700/30">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="flex flex-col items-center text-center mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
              <FiTrendingUp className="text-primary-950 text-xl" />
            </div>
            <h3 className="text-white font-bold">رتبه شما</h3>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-400 mb-2">{userPoints.rank}</p>
            <div className="bg-primary-800/40 rounded-lg p-2 text-gray-300 text-sm">
              از میان ۵,۴۳۰ عضو
            </div>
          </div>
        </div>
      </div>
      
      {/* تب‌های صفحه */}
      <div className="mb-6 border-b border-primary-700/30">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-3 text-sm border-b-2 font-medium transition-all ${
              activeTab === 'transactions' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-gray-400 hover:text-white hover:border-primary-700'
            }`}
          >
            تاریخچه امتیازات
          </button>
          <button 
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-3 text-sm border-b-2 font-medium transition-all ${
              activeTab === 'rewards' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-gray-400 hover:text-white hover:border-primary-700'
            }`}
          >
            جوایز قابل دریافت
          </button>
          <button 
            onClick={() => setActiveTab('benefits')}
            className={`px-4 py-3 text-sm border-b-2 font-medium transition-all ${
              activeTab === 'benefits' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-gray-400 hover:text-white hover:border-primary-700'
            }`}
          >
            مزایای عضویت
          </button>
        </div>
      </div>
      
      {/* تاریخچه امتیازات */}
      {activeTab === 'transactions' && (
        <div className="bg-primary-900/50 border border-primary-800/50 rounded-xl overflow-hidden">
          <div className="p-4 flex items-center justify-between bg-primary-900/50 border-b border-primary-800/50">
            <div className="flex items-center">
              <div className="text-white font-bold ml-2">فیلتر:</div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-primary-800 border border-primary-700 rounded-lg px-3 py-1.5 text-sm text-white"
              >
                <option value="all">همه تراکنش‌ها</option>
                <option value="purchase">خرید</option>
                <option value="reward">پاداش</option>
                <option value="expired">منقضی شده</option>
                <option value="referral">دعوت از دوستان</option>
                <option value="review">نظرات</option>
                <option value="exchange">استفاده امتیاز</option>
              </select>
            </div>
          </div>
          
          <div className="divide-y divide-primary-800/30">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-primary-800/20 transition-colors flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    transaction.isPositive 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {transaction.type === 'purchase' && <FiShoppingCart />}
                    {transaction.type === 'reward' && <FiGift />}
                    {transaction.type === 'expired' && <FiClock />}
                    {transaction.type === 'referral' && <FiUsers />}
                    {transaction.type === 'review' && <FiMessageCircle />}
                    {transaction.type === 'exchange' && <FiPercent />}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{transaction.title}</h4>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <FiCalendar className="ml-1" size={12} />
                      {transaction.date}
                      <span className="mx-2">•</span>
                      <FiClock className="ml-1" size={12} />
                      {transaction.time}
                    </div>
                  </div>
                </div>
                <div className={`text-xl font-bold ${
                  transaction.isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.isPositive ? '+ ' : '- '}
                  {transaction.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* جوایز قابل دریافت */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-primary-900/50 border border-primary-800/50 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all group">
              <div className="h-36 bg-gradient-to-b from-primary-800 to-primary-900 relative overflow-hidden">
                <img 
                  src={reward.image} 
                  alt={reward.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-white font-bold mb-2">{reward.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{reward.description}</p>
                <div className="text-amber-400 font-bold flex items-center mb-4">
                  <FiAward className="ml-1" />
                  {reward.pointsCost} امتیاز
                </div>
                
                <Button 
                  className={userPoints.current >= reward.pointsCost 
                    ? "w-full bg-gradient-to-r from-amber-500 to-amber-600 text-primary-950" 
                    : "w-full bg-primary-800/50 text-gray-400 cursor-not-allowed"}
                >
                  {userPoints.current >= reward.pointsCost ? "دریافت جایزه" : "امتیاز ناکافی"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* مزایای سطوح مختلف */}
      {activeTab === 'benefits' && (
        <div className="space-y-6">
          {clubBenefits.map((level, index) => (
            <div key={index} className="bg-primary-900/50 border border-primary-800/50 rounded-xl overflow-hidden">
              <div className={`bg-gradient-to-r ${level.color} p-4`}>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                    <FiAward className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{level.level}</h3>
                    <p className="text-white/70 text-sm">از {level.minPoints.toLocaleString()} امتیاز</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <ul className="space-y-2">
                  {level.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-white text-sm">
                      <FiCheck className="text-green-400 ml-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 