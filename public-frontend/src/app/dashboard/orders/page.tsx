'use client';

import { useState } from 'react';
import { FiPackage, FiSearch, FiFilter, FiClock, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'processing' | 'delivered' | 'canceled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // داده‌های نمونه سفارش‌ها
  const orders = [
    {
      id: 'ORD-123456',
      date: '۱۲ فروردین ۱۴۰۲',
      total: '۸,۵۶۰,۰۰۰ تومان',
      status: 'pending',
      statusText: 'در انتظار پرداخت',
      items: [
        { id: 1, name: 'گوشی موبایل سامسونگ گلکسی A53', quantity: 1, price: '۸,۵۰۰,۰۰۰ تومان' }
      ]
    },
    {
      id: 'ORD-123455',
      date: '۸ فروردین ۱۴۰۲',
      total: '۱,۲۵۰,۰۰۰ تومان',
      status: 'processing',
      statusText: 'در حال پردازش',
      items: [
        { id: 2, name: 'هدفون بی‌سیم سونی WH-1000XM4', quantity: 1, price: '۱,۲۵۰,۰۰۰ تومان' }
      ]
    },
    {
      id: 'ORD-123454',
      date: '۲۵ اسفند ۱۴۰۱',
      total: '۷,۹۰۰,۰۰۰ تومان',
      status: 'delivered',
      statusText: 'تحویل داده شده',
      items: [
        { id: 3, name: 'لپتاپ ایسوس VivoBook', quantity: 1, price: '۷,۹۰۰,۰۰۰ تومان' }
      ]
    },
    {
      id: 'ORD-123453',
      date: '۱۰ اسفند ۱۴۰۱',
      total: '۵۶۰,۰۰۰ تومان',
      status: 'canceled',
      statusText: 'لغو شده',
      items: [
        { id: 4, name: 'کیبورد گیمینگ ریزر', quantity: 1, price: '۵۶۰,۰۰۰ تومان' }
      ]
    }
  ];

  // فیلتر کردن سفارش‌ها بر اساس وضعیت
  const filteredOrders = orders.filter(order => 
    (activeFilter === 'all' || order.status === activeFilter) && 
    (order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
     order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // نمایش آیکون مناسب بر اساس وضعیت سفارش
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'processing': return <FiTruck className="text-blue-500" />;
      case 'delivered': return <FiCheckCircle className="text-green-500" />;
      case 'canceled': return <FiXCircle className="text-red-500" />;
      default: return <FiPackage className="text-gray-500" />;
    }
  };

  // کلاس رنگ پس‌زمینه بر اساس وضعیت سفارش
  const getStatusBgClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'canceled': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FiPackage className="ml-2" />
          سفارش‌های من
        </h1>
        <p className="text-gray-400">لیست تمام سفارش‌های شما و وضعیت آنها</p>
      </div>

      {/* فیلترها و جستجو */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="جستجوی سفارش..."
            className="w-full bg-primary-800/50 border border-primary-700/50 rounded-lg p-3 pl-12 text-white focus:outline-none focus:border-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex items-center justify-center gap-2 overflow-x-auto">
          <Button
            variant={activeFilter === 'all' ? 'primary' : 'outline'}
            className={`min-w-[100px] ${activeFilter === 'all' ? '' : 'border-primary-700/50 text-gray-300'}`}
            onClick={() => setActiveFilter('all')}
          >
            همه سفارش‌ها
          </Button>
          <Button
            variant={activeFilter === 'pending' ? 'primary' : 'outline'}
            className={`min-w-[100px] ${activeFilter === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700 border-yellow-500' : 'border-primary-700/50 text-gray-300'}`}
            onClick={() => setActiveFilter('pending')}
          >
            در انتظار
          </Button>
          <Button
            variant={activeFilter === 'processing' ? 'primary' : 'outline'}
            className={`min-w-[100px] ${activeFilter === 'processing' ? 'bg-blue-600 hover:bg-blue-700 border-blue-500' : 'border-primary-700/50 text-gray-300'}`}
            onClick={() => setActiveFilter('processing')}
          >
            در حال پردازش
          </Button>
          <Button
            variant={activeFilter === 'delivered' ? 'primary' : 'outline'}
            className={`min-w-[100px] ${activeFilter === 'delivered' ? 'bg-green-600 hover:bg-green-700 border-green-500' : 'border-primary-700/50 text-gray-300'}`}
            onClick={() => setActiveFilter('delivered')}
          >
            تحویل شده
          </Button>
          <Button
            variant={activeFilter === 'canceled' ? 'primary' : 'outline'}
            className={`min-w-[100px] ${activeFilter === 'canceled' ? 'bg-red-600 hover:bg-red-700 border-red-500' : 'border-primary-700/50 text-gray-300'}`}
            onClick={() => setActiveFilter('canceled')}
          >
            لغو شده
          </Button>
        </div>
      </div>

      {/* لیست سفارش‌ها */}
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-primary-800/30 border border-primary-700/30 rounded-lg overflow-hidden hover:border-primary-600/50 transition-all">
              {/* هدر سفارش */}
              <div className="bg-primary-800/50 border-b border-primary-700/30 p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white">{order.id}</span>
                  <span className="text-gray-400 text-sm">{order.date}</span>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  <span className="text-white font-medium">{order.total}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusBgClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.statusText}</span>
                  </span>
                </div>
              </div>
              
              {/* محتوای سفارش */}
              <div className="p-4">
                <h3 className="text-white font-medium mb-3">محصولات</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-primary-800/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2 md:mb-0">
                        <div className="w-10 h-10 rounded-md bg-primary-700 flex items-center justify-center text-white">
                          <FiPackage />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{item.name}</h4>
                          <p className="text-gray-400 text-sm">تعداد: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-white">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* فوتر سفارش */}
              <div className="border-t border-primary-700/30 p-4 flex justify-between items-center">
                <Button variant="outline-secondary" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                  مشاهده جزئیات
                </Button>
                
                {order.status === 'delivered' && (
                  <Button variant="outline-secondary" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                    ثبت نظر
                  </Button>
                )}
                
                {order.status === 'pending' && (
                  <Button variant="outline-secondary" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                    لغو سفارش
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <FiPackage className="text-gray-400 text-5xl" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">سفارشی یافت نشد</h3>
            <p className="text-gray-400">سفارشی با معیارهای جستجوی شما وجود ندارد.</p>
          </div>
        )}
      </div>
    </div>
  );
} 