'use client';

import { useState } from 'react';
import { FiBell, FiPackage, FiCreditCard, FiShield, FiPercent, FiInfo, FiCheck, FiTrash2, FiAlertTriangle, FiFilter, FiCalendar } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

// تعریف نوع داده‌ها
interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  time: string;
  type: 'order' | 'payment' | 'security' | 'promotion' | 'system';
  isRead: boolean;
}

export default function NotificationsPage() {
  // داده‌های نمونه
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'NOTIF-123456',
      title: 'سفارش شما ارسال شد',
      message: 'سفارش شما با کد پیگیری ORD-789456 به آدرس شما ارسال شده است. مدت زمان تخمینی تحویل 48 ساعت می‌باشد.',
      date: '۱۵ فروردین ۱۴۰۲',
      time: '۱۴:۳۰',
      type: 'order',
      isRead: true
    },
    {
      id: 'NOTIF-123455',
      title: 'پرداخت موفق',
      message: 'پرداخت شما به مبلغ ۹۵۰,۰۰۰ تومان با موفقیت انجام شد. سفارش شما در حال آماده‌سازی می‌باشد.',
      date: '۱۴ فروردین ۱۴۰۲',
      time: '۱۰:۱۵',
      type: 'payment',
      isRead: true
    },
    {
      id: 'NOTIF-123454',
      title: 'تخفیف ویژه عید',
      message: 'به مناسبت عید نوروز، کد تخفیف 20 درصدی NOWRUZ1402 برای شما فعال شده است. این کد تا پایان فروردین معتبر است.',
      date: '۱۰ فروردین ۱۴۰۲',
      time: '۱۸:۲۰',
      type: 'promotion',
      isRead: false
    },
    {
      id: 'NOTIF-123453',
      title: 'تغییر رمز عبور',
      message: 'رمز عبور حساب کاربری شما با موفقیت تغییر کرد. اگر شما این تغییر را انجام نداده‌اید، لطفا سریعا با پشتیبانی تماس بگیرید.',
      date: '۵ فروردین ۱۴۰۲',
      time: '۰۹:۴۵',
      type: 'security',
      isRead: false
    },
    {
      id: 'NOTIF-123452',
      title: 'بروزرسانی شرایط استفاده از خدمات',
      message: 'شرایط استفاده از خدمات و قوانین حریم خصوصی سایت بروزرسانی شده است. برای مشاهده جزئیات به بخش قوانین مراجعه کنید.',
      date: '۲۸ اسفند ۱۴۰۱',
      time: '۱۱:۳۰',
      type: 'system',
      isRead: false
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'order' | 'payment' | 'security' | 'promotion' | 'system'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // تعداد اعلان‌های خوانده نشده
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // علامت‌گذاری یک اعلان به عنوان خوانده شده
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  // علامت‌گذاری همه اعلانات به عنوان خوانده شده
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // حذف یک اعلان
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    setDeleteConfirm(null);
  };

  // حذف همه اعلانات
  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  // فیلتر کردن اعلانات
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.isRead;
    return notification.type === activeFilter;
  });

  // نمایش آیکون مناسب برای هر نوع اعلان
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return <FiPackage className="text-blue-400" size={18} />;
      case 'payment': return <FiCreditCard className="text-green-400" size={18} />;
      case 'security': return <FiShield className="text-red-400" size={18} />;
      case 'promotion': return <FiPercent className="text-amber-400" size={18} />;
      case 'system': return <FiInfo className="text-purple-400" size={18} />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FiBell className="ml-2" />
          اعلانات
          {unreadCount > 0 && (
            <span className="mr-2 inline-flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-full h-5 min-w-[20px] px-1">
              {unreadCount}
            </span>
          )}
        </h1>
        <p className="text-gray-400">اطلاعیه‌ها و پیام‌های سیستمی مربوط به حساب کاربری شما</p>
      </div>

      {/* هدر و فیلترها */}
      <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* فیلترهای اعلانات */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <Button 
              variant={activeFilter === 'all' ? 'primary' : 'outline-primary'}
              className={`min-w-[80px] text-sm ${activeFilter === 'all' ? '' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('all')}
            >
              همه
            </Button>
            <Button 
              variant={activeFilter === 'unread' ? 'primary' : 'outline-primary'}
              className={`min-w-[80px] text-sm ${activeFilter === 'unread' ? 'bg-blue-600 hover:bg-blue-700 border-blue-500' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('unread')}
            >
              خوانده نشده
            </Button>
            <Button 
              variant={activeFilter === 'order' ? 'primary' : 'outline-primary'}
              className={`min-w-[80px] text-sm ${activeFilter === 'order' ? 'bg-indigo-600 hover:bg-indigo-700 border-indigo-500' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('order')}
            >
              سفارش‌ها
            </Button>
            <Button 
              variant={activeFilter === 'payment' ? 'primary' : 'outline-primary'}
              className={`min-w-[80px] text-sm ${activeFilter === 'payment' ? 'bg-green-600 hover:bg-green-700 border-green-500' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('payment')}
            >
              پرداخت
            </Button>
            <Button 
              variant={activeFilter === 'security' ? 'primary' : 'outline-primary'}
              className={`min-w-[80px] text-sm ${activeFilter === 'security' ? 'bg-red-600 hover:bg-red-700 border-red-500' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('security')}
            >
              امنیتی
            </Button>
          </div>

          {/* دکمه‌های مدیریت */}
          <div className="flex gap-2 w-full md:w-auto justify-end">
            {unreadCount > 0 && (
              <Button 
                variant="outline-primary"
                className="text-sm border-primary-700/50 text-blue-400 hover:bg-blue-600/10"
                onClick={markAllAsRead}
              >
                <FiCheck size={16} className="ml-1" />
                خواندن همه
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="outline-primary"
                className="text-sm border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={deleteAllNotifications}
              >
                <FiTrash2 size={16} className="ml-1" />
                حذف همه
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* لیست اعلانات */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-primary-800/30 border ${notification.isRead ? 'border-primary-700/30' : 'border-blue-700/50'} rounded-lg p-4 transition-all hover:border-primary-600/50 ${notification.isRead ? '' : 'relative bg-primary-800/50'}`}
            >
              {/* نشانگر خوانده نشده */}
              {!notification.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
              
              <div className="flex">
                {/* آیکون نوع اعلان */}
                <div className={`p-2 rounded-lg bg-${
                  notification.type === 'order' ? 'blue' : 
                  notification.type === 'payment' ? 'green' : 
                  notification.type === 'security' ? 'red' : 
                  notification.type === 'promotion' ? 'amber' : 
                  'purple'
                }-500/10 ml-4 self-start mt-1`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h3 className="font-bold text-white">{notification.title}</h3>
                    <div className="flex items-center space-x-2 space-x-reverse text-gray-400 text-xs">
                      <span>{notification.date}</span>
                      <span>•</span>
                      <span>{notification.time}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mt-2 mb-3">{notification.message}</p>
                  
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    {!notification.isRead && (
                      <Button 
                        variant="outline-primary"
                        className="text-xs border-primary-700/50 text-blue-400 hover:bg-blue-600/10"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <FiCheck size={14} className="ml-1" />
                        علامت خوانده شده
                      </Button>
                    )}
                    
                    {deleteConfirm === notification.id ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline-primary"
                          className="text-xs border-primary-700/50 text-gray-300"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          انصراف
                        </Button>
                        <Button 
                          variant="primary"
                          className="text-xs bg-red-600 hover:bg-red-700 border-red-500"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          تایید حذف
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline-primary"
                        className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => setDeleteConfirm(notification.id)}
                      >
                        <FiTrash2 size={14} className="ml-1" />
                        حذف
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <FiBell className="text-gray-400 text-5xl" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">اعلانی یافت نشد</h3>
            <p className="text-gray-400 mb-4">در حال حاضر اعلانی با فیلتر انتخاب شده وجود ندارد.</p>
            <Button
              variant="primary"
              className="inline-flex items-center justify-center gap-2"
              onClick={() => setActiveFilter('all')}
            >
              <FiFilter size={18} />
              نمایش همه اعلانات
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 