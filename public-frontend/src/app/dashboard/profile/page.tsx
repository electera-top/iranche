'use client';

import { useState } from 'react';
import { FiUser, FiMail, FiLock, FiPhone, FiCamera, FiSave, FiLogOut } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
  
  // فرم اطلاعات کاربر
  const [userInfo, setUserInfo] = useState({
    fullName: 'علی محمدی',
    username: 'ali_mohammadi',
    email: 'ali.mohammadi@example.com',
    phone: '09123456789',
    nationalCode: '0123456789',
    birthDate: '1370/05/15'
  });

  // تغییر اطلاعات کاربر
  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FiUser className="ml-2" />
          اطلاعات حساب کاربری
        </h1>
        <p className="text-gray-400">مدیریت اطلاعات شخصی و امنیتی حساب کاربری شما</p>
      </div>

      {/* تصویر و نام کاربر */}
      <div className="bg-primary-900/50 backdrop-blur-sm border border-primary-700/30 rounded-lg p-6 mb-8 flex flex-col items-center">
        <div className="relative group mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary-700/50 shadow-lg shadow-primary-700/20">
            <img 
              src="/images/avatar.jpg" 
              alt="تصویر پروفایل" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.fullName)}&background=0D2477&color=fff&size=200`;
              }}
            />
          </div>
          <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-md">
            <FiCamera size={18} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-white mb-1">{userInfo.fullName}</h2>
        <p className="text-blue-300/80 text-sm mb-1">{userInfo.username}@</p>
        <span className="bg-blue-500/20 text-blue-400 text-xs py-1 px-3 rounded-full border border-blue-500/30">
          کاربر طلایی
        </span>
      </div>

      {/* تب‌ها */}
      <div className="flex border-b border-primary-700/30 mb-6">
        <button 
          className={`px-4 py-3 text-sm font-medium ${activeTab === 'info' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('info')}
        >
          اطلاعات شخصی
        </button>
        <button 
          className={`px-4 py-3 text-sm font-medium ${activeTab === 'security' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('security')}
        >
          امنیت و رمز عبور
        </button>
      </div>

      {/* محتوای تب */}
      <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg overflow-hidden">
        {activeTab === 'info' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">نام و نام خانوادگی</label>
                <div className="relative">
                  <span className="absolute right-4 top-3.5 text-gray-400">
                    <FiUser size={18} />
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    value={userInfo.fullName}
                    onChange={handleUserInfoChange}
                    className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 pr-12 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">نام کاربری</label>
                <div className="relative">
                  <span className="absolute right-4 top-3.5 text-gray-400">@</span>
                  <input
                    type="text"
                    name="username"
                    value={userInfo.username}
                    onChange={handleUserInfoChange}
                    className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 pr-12 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">ایمیل</label>
                <div className="relative">
                  <span className="absolute right-4 top-3.5 text-gray-400">
                    <FiMail size={18} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleUserInfoChange}
                    className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 pr-12 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">شماره موبایل</label>
                <div className="relative">
                  <span className="absolute right-4 top-3.5 text-gray-400">
                    <FiPhone size={18} />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleUserInfoChange}
                    className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 pr-12 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">کد ملی</label>
                <input
                  type="text"
                  name="nationalCode"
                  value={userInfo.nationalCode}
                  onChange={handleUserInfoChange}
                  className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">تاریخ تولد</label>
                <input
                  type="text"
                  name="birthDate"
                  value={userInfo.birthDate}
                  onChange={handleUserInfoChange}
                  placeholder="YYYY/MM/DD"
                  className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                variant="primary"
                className="flex items-center gap-2"
              >
                <FiSave size={18} />
                ذخیره تغییرات
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-6">تغییر رمز عبور</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">رمز عبور فعلی</label>
                <div className="relative">
                  <span className="absolute right-4 top-3.5 text-gray-400">
                    <FiLock size={18} />
                  </span>
                  <input
                    type="password"
                    className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 pr-12 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm">رمز عبور جدید</label>
                <div className="relative">
                  <span className="absolute right-4 top-3.5 text-gray-400">
                    <FiLock size={18} />
                  </span>
                  <input
                    type="password"
                    className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 pr-12 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک و اعداد باشد.</p>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm">تکرار رمز عبور جدید</label>
                <div className="relative">
                  <span className="absolute right-4 top-3.5 text-gray-400">
                    <FiLock size={18} />
                  </span>
                  <input
                    type="password"
                    className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 pr-12 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between items-center">
              <Button
                variant="outline-primary"
                className="flex items-center gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10"
              >
                <FiLogOut size={18} />
                خروج از تمامی دستگاه‌ها
              </Button>
              
              <Button
                variant="primary"
                className="flex items-center gap-2"
              >
                <FiSave size={18} />
                ثبت رمز عبور جدید
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* بخش امنیت حساب کاربری */}
      <div className="mt-8 bg-primary-800/30 border border-primary-700/30 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">تنظیمات امنیتی حساب کاربری</h3>
        
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-white font-medium">احراز هویت دو مرحله‌ای</h4>
              <p className="text-gray-400 text-sm">با فعال‌سازی این گزینه، هنگام ورود کد تایید به شماره موبایل شما ارسال می‌شود.</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-white font-medium">اعلان‌های امنیتی</h4>
              <p className="text-gray-400 text-sm">در صورت ورود به حساب کاربری از دستگاه جدید، یک ایمیل هشدار دریافت خواهید کرد.</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 