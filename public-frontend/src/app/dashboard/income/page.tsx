'use client';

import { useState } from 'react';
import { FiTrendingUp, FiCopy, FiLink, FiCheck, FiUsers, FiShoppingBag, FiDownload, FiCalendar, FiFilter, FiExternalLink, FiShare2, FiDollarSign, FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

// تعریف نوع‌های داده
interface ReferralIncome {
  id: string;
  date: string;
  referredUser: string;
  storeId: string;
  storeName: string;
  commission: number;
  status: 'pending' | 'completed';
}

interface StoreCommission {
  id: string;
  date: string;
  storeName: string;
  storeId: string;
  revenue: number;
  commission: number;
  status: 'pending' | 'completed';
}

export default function IncomePage() {
  // داده‌های نمونه
  const [referralLink, setReferralLink] = useState('https://iranche.com/ref/ali_mohammadi');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'referrals' | 'stores'>('referrals');
  const [dateFilter, setDateFilter] = useState<'all' | 'month' | 'week'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const [totalIncome, setTotalIncome] = useState({
    total: 12580000,
    referrals: 4850000,
    stores: 7730000,
    pendingPayments: 3250000,
  });

  // لیست درآمدهای ارجاع کاربر
  const [referralIncomes, setReferralIncomes] = useState<ReferralIncome[]>([
    {
      id: 'REF-123456',
      date: '۱۵ فروردین ۱۴۰۲',
      referredUser: 'حسین رضایی',
      storeId: 'STORE-789',
      storeName: 'گالری طلای نفیس',
      commission: 1500000,
      status: 'completed'
    },
    {
      id: 'REF-123455',
      date: '۸ فروردین ۱۴۰۲',
      referredUser: 'مریم حسینی',
      storeId: 'STORE-456',
      storeName: 'جواهری پرنیان',
      commission: 950000,
      status: 'completed'
    },
    {
      id: 'REF-123454',
      date: '۲ فروردین ۱۴۰۲',
      referredUser: 'علی محمدی',
      storeId: 'STORE-123',
      storeName: 'طلای ماندگار',
      commission: 1200000,
      status: 'pending'
    },
    {
      id: 'REF-123453',
      date: '۲۵ اسفند ۱۴۰۱',
      referredUser: 'فاطمه کریمی',
      storeId: 'STORE-345',
      storeName: 'زیورآلات ایرانی',
      commission: 1200000,
      status: 'completed'
    }
  ]);

  // لیست کمیسیون از فروشگاه‌ها
  const [storeCommissions, setStoreCommissions] = useState<StoreCommission[]>([
    {
      id: 'COM-123456',
      date: '۱۸ فروردین ۱۴۰۲',
      storeName: 'گالری طلای نفیس',
      storeId: 'STORE-789',
      revenue: 25000000,
      commission: 2500000,
      status: 'completed'
    },
    {
      id: 'COM-123455',
      date: '۱۲ فروردین ۱۴۰۲',
      storeName: 'جواهری پرنیان',
      storeId: 'STORE-456',
      revenue: 18000000,
      commission: 1800000,
      status: 'completed'
    },
    {
      id: 'COM-123454',
      date: '۵ فروردین ۱۴۰۲',
      storeName: 'طلای ماندگار',
      storeId: 'STORE-123',
      revenue: 15000000,
      commission: 1500000,
      status: 'pending'
    },
    {
      id: 'COM-123453',
      date: '۲۸ اسفند ۱۴۰۱',
      storeName: 'زیورآلات ایرانی',
      storeId: 'STORE-345',
      revenue: 19300000,
      commission: 1930000,
      status: 'completed'
    }
  ]);

  // کپی کردن لینک ارجاع
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // فیلتر کردن لیست درآمدها بر اساس تاریخ و وضعیت
  const filteredReferrals = referralIncomes.filter(income => {
    const statusMatch = statusFilter === 'all' || income.status === statusFilter;
    // در اینجا فیلتر تاریخ به صورت ساده پیاده‌سازی شده است
    // در پروژه واقعی باید منطق دقیق‌تری برای فیلتر تاریخ پیاده‌سازی شود
    return statusMatch;
  });

  const filteredStoreCommissions = storeCommissions.filter(commission => {
    const statusMatch = statusFilter === 'all' || commission.status === statusFilter;
    return statusMatch;
  });

  // فرمت کردن مبلغ
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('fa-IR');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FiTrendingUp className="ml-2" />
          مدیریت درآمد
        </h1>
        <p className="text-gray-400">کسب درآمد از معرفی کاربران و فروش از طریق فروشگاه‌ها</p>
      </div>

      {/* کارت‌های آمار درآمد */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* درآمد کلی */}
        <div className="bg-gradient-to-r from-primary-800/70 via-primary-700/60 to-primary-800/70 rounded-xl p-5 border border-primary-600/30 shadow-lg backdrop-blur-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-gray-300 text-sm">درآمد کل</h3>
              <p className="text-white text-2xl font-bold mt-1">{formatCurrency(totalIncome.total)} <span className="text-sm font-normal">تومان</span></p>
            </div>
            <div className="p-2 rounded-lg bg-white/10">
              <FiDollarSign className="text-blue-400" size={20} />
            </div>
          </div>
          <div className="mt-3 text-xs text-blue-300 flex items-center">
            <FiArrowUpRight className="text-green-400 ml-1" size={14} />
            <span>۱۵٪ رشد نسبت به ماه قبل</span>
          </div>
        </div>

        {/* درآمد از ارجاع */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-indigo-800/40 to-indigo-900/40 rounded-xl p-5 border border-indigo-700/30 shadow-lg backdrop-blur-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-indigo-300/90 text-sm">درآمد از ارجاع</h3>
              <p className="text-white text-2xl font-bold mt-1">{formatCurrency(totalIncome.referrals)} <span className="text-sm font-normal">تومان</span></p>
            </div>
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <FiUsers className="text-indigo-400" size={20} />
            </div>
          </div>
          <div className="mt-3 text-xs text-indigo-300/80 flex items-center">
            <span>از {referralIncomes.length} کاربر معرفی شده</span>
          </div>
        </div>

        {/* درآمد از فروشگاه‌ها */}
        <div className="bg-gradient-to-r from-emerald-900/40 via-emerald-800/40 to-emerald-900/40 rounded-xl p-5 border border-emerald-700/30 shadow-lg backdrop-blur-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-emerald-300/90 text-sm">درآمد از فروشگاه‌ها</h3>
              <p className="text-white text-2xl font-bold mt-1">{formatCurrency(totalIncome.stores)} <span className="text-sm font-normal">تومان</span></p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <FiShoppingBag className="text-emerald-400" size={20} />
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-300/80 flex items-center">
            <span>از {storeCommissions.length} فروشگاه فعال</span>
          </div>
        </div>

        {/* در انتظار پرداخت */}
        <div className="bg-gradient-to-r from-amber-900/40 via-amber-800/40 to-amber-900/40 rounded-xl p-5 border border-amber-700/30 shadow-lg backdrop-blur-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-amber-300/90 text-sm">در انتظار پرداخت</h3>
              <p className="text-white text-2xl font-bold mt-1">{formatCurrency(totalIncome.pendingPayments)} <span className="text-sm font-normal">تومان</span></p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <FiArrowDownLeft className="text-amber-400" size={20} />
            </div>
          </div>
          <div className="mt-3 text-xs text-amber-300/80 flex items-center">
            <span>در تاریخ ۲۵ فروردین واریز می‌شود</span>
          </div>
        </div>
      </div>

      {/* کارت لینک ارجاع */}
      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl p-6 border border-blue-700/30 shadow-lg backdrop-blur-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
              <FiLink className="ml-2 text-blue-400" />
              لینک دعوت اختصاصی شما
            </h3>
            <p className="text-gray-400 text-sm mb-4 md:mb-0">با اشتراک‌گذاری این لینک، برای هر فروشگاهی که از طریق آن ایجاد شود، کمیسیون دریافت می‌کنید</p>
          </div>

          <div className="flex-grow md:max-w-md">
            <div className="relative">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="w-full py-3 px-4 pr-10 bg-primary-800/50 border border-blue-700/40 rounded-lg text-blue-300 focus:outline-none focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiLink className="text-blue-500" />
              </div>
              <Button
                variant="primary"
                className="absolute left-1 top-1 bottom-1 px-3 gap-2 flex items-center justify-center bg-blue-600/90 hover:bg-blue-600 border border-blue-500/20"
                onClick={handleCopyLink}
              >
                {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                <span>{copied ? 'کپی شد' : 'کپی لینک'}</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <Button 
            variant="outline-primary"
            className="flex items-center gap-2 border-blue-700/40 text-blue-300 hover:bg-blue-600/10"
            onClick={() => {/* اشتراک در تلگرام */}}
          >
            <FiShare2 size={16} />
            اشتراک در تلگرام
          </Button>
          <Button 
            variant="outline-primary"
            className="flex items-center gap-2 border-blue-700/40 text-blue-300 hover:bg-blue-600/10"
            onClick={() => {/* اشتراک در واتساپ */}}
          >
            <FiShare2 size={16} />
            اشتراک در واتساپ
          </Button>
          <Button 
            variant="outline-primary"
            className="flex items-center gap-2 border-blue-700/40 text-blue-300 hover:bg-blue-600/10"
            onClick={() => {/* اشتراک در اینستاگرام */}}
          >
            <FiShare2 size={16} />
            اشتراک در اینستاگرام
          </Button>
          <Button 
            variant="outline-primary"
            className="flex items-center gap-2 border-blue-700/40 text-blue-300 hover:bg-blue-600/10"
            onClick={() => {/* تنظیمات لینک */}}
          >
            <FiExternalLink size={16} />
            مشاهده مستندات همکاری در فروش
          </Button>
        </div>
      </div>

      {/* تب‌های نمایش تراکنش‌ها */}
      <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              variant={activeTab === 'referrals' ? 'primary' : 'outline-primary'}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 ${activeTab === 'referrals' ? '' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveTab('referrals')}
            >
              <FiUsers size={18} />
              درآمد از ارجاع
            </Button>
            
            <Button 
              variant={activeTab === 'stores' ? 'primary' : 'outline-primary'}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 ${activeTab === 'stores' ? '' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveTab('stores')}
            >
              <FiShoppingBag size={18} />
              کمیسیون فروشگاه‌ها
            </Button>
          </div>

          <div className="flex gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'primary' : 'outline-primary'}
                className={`text-xs px-3 ${statusFilter === 'all' ? 'bg-blue-600' : 'border-primary-700/50 text-gray-300'}`}
                onClick={() => setStatusFilter('all')}
              >
                همه
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'primary' : 'outline-primary'}
                className={`text-xs px-3 ${statusFilter === 'completed' ? 'bg-green-600' : 'border-primary-700/50 text-gray-300'}`}
                onClick={() => setStatusFilter('completed')}
              >
                پرداخت شده
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'primary' : 'outline-primary'}
                className={`text-xs px-3 ${statusFilter === 'pending' ? 'bg-amber-600' : 'border-primary-700/50 text-gray-300'}`}
                onClick={() => setStatusFilter('pending')}
              >
                در انتظار
              </Button>
            </div>
            
            <Button
              variant="outline-primary"
              className="flex items-center gap-1 p-2 border-primary-700/50 text-white hover:bg-primary-800/70"
            >
              <FiCalendar size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* لیست درآمدها */}
      <div className="space-y-4">
        {activeTab === 'referrals' ? (
          filteredReferrals.length > 0 ? (
            filteredReferrals.map((income) => (
              <div 
                key={income.id} 
                className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary-600/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                    <FiUsers size={20} />
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium flex items-center">
                      معرفی <span className="text-indigo-400 mx-1">{income.referredUser}</span> - {income.storeName}
                    </h4>
                    <span className="text-gray-400 text-sm">{income.date} | {income.id}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-0 sm:ml-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    income.status === 'completed' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                      : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                  }`}>
                    {income.status === 'completed' ? 'پرداخت شده' : 'در انتظار پرداخت'}
                  </span>
                  
                  <span className="font-bold text-green-400">
                    {formatCurrency(income.commission)} تومان
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiUsers className="text-gray-400 text-5xl" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">درآمدی از ارجاع یافت نشد</h3>
              <p className="text-gray-400 mb-4">می‌توانید با اشتراک‌گذاری لینک دعوت خود، دوستان و آشنایانتان را دعوت کنید.</p>
              <Button
                variant="primary"
                className="inline-flex items-center justify-center gap-2"
                onClick={handleCopyLink}
              >
                <FiCopy size={18} />
                کپی لینک دعوت
              </Button>
            </div>
          )
        ) : (
          filteredStoreCommissions.length > 0 ? (
            filteredStoreCommissions.map((commission) => (
              <div 
                key={commission.id} 
                className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary-600/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                    <FiShoppingBag size={20} />
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium flex items-center">
                      کمیسیون فروشگاه <span className="text-emerald-400 mx-1">{commission.storeName}</span>
                    </h4>
                    <span className="text-gray-400 text-sm">{commission.date} | {commission.id}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 ml-0 sm:ml-auto">
                  <span className="text-gray-400 text-sm">
                    فروش: <span className="text-white">{formatCurrency(commission.revenue)} تومان</span>
                  </span>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    commission.status === 'completed' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                      : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                  }`}>
                    {commission.status === 'completed' ? 'پرداخت شده' : 'در انتظار پرداخت'}
                  </span>
                  
                  <span className="font-bold text-green-400">
                    {formatCurrency(commission.commission)} تومان
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiShoppingBag className="text-gray-400 text-5xl" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">کمیسیون فروشگاهی یافت نشد</h3>
              <p className="text-gray-400 mb-4">شما می‌توانید با معرفی کاربران و ایجاد فروشگاه‌های جدید، کمیسیون دریافت کنید.</p>
              <Button
                variant="primary"
                className="inline-flex items-center justify-center gap-2"
                onClick={handleCopyLink}
              >
                <FiCopy size={18} />
                کپی لینک دعوت
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
} 