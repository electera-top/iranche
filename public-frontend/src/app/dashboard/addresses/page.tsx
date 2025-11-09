'use client';

import { useState } from 'react';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

interface Address {
  id: number;
  title: string;
  fullName: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      title: 'منزل',
      fullName: 'علی محمدی',
      province: 'تهران',
      city: 'تهران',
      address: 'خیابان ولیعصر، بالاتر از میدان ونک، کوچه بهار، پلاک ۱۲، واحد ۵',
      postalCode: '۱۹۹۱۶۵۴۵۱۲',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      isDefault: true
    },
    {
      id: 2,
      title: 'محل کار',
      fullName: 'علی محمدی',
      province: 'تهران',
      city: 'تهران',
      address: 'سعادت آباد، بلوار دریا، خیابان گلستان، برج آرین، طبقه ۷، واحد ۳',
      postalCode: '۱۹۹۸۷۶۵۴۳۱',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      isDefault: false
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  
  // فرم خالی برای آدرس جدید
  const emptyAddress: Omit<Address, 'id'> = {
    title: '',
    fullName: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    phone: '',
    isDefault: false
  };
  
  // حذف آدرس
  const deleteAddress = (id: number) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };
  
  // تنظیم آدرس پیش‌فرض
  const setDefaultAddress = (id: number) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FiMapPin className="ml-2" />
          آدرس‌های من
        </h1>
        <p className="text-gray-400">مدیریت آدرس‌های ارسال سفارش</p>
      </div>
      
      {/* دکمه افزودن آدرس جدید */}
      <div className="mb-6">
        <Button 
          variant="primary"
          className="flex items-center justify-center gap-2"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FiPlus />
          افزودن آدرس جدید
        </Button>
      </div>
      
      {/* فرم افزودن آدرس جدید */}
      {showAddForm && (
        <div className="bg-primary-800/50 border border-primary-700/30 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">افزودن آدرس جدید</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">عنوان آدرس</label>
              <input
                type="text"
                placeholder="منزل، محل کار و..."
                className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 text-sm">نام و نام خانوادگی گیرنده</label>
              <input
                type="text"
                placeholder="نام و نام خانوادگی"
                className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 text-sm">استان</label>
              <select className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all">
                <option value="">انتخاب استان</option>
                <option value="تهران">تهران</option>
                <option value="اصفهان">اصفهان</option>
                <option value="مازندران">مازندران</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 text-sm">شهر</label>
              <select className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all">
                <option value="">انتخاب شهر</option>
                <option value="تهران">تهران</option>
                <option value="کرج">کرج</option>
                <option value="شیراز">شیراز</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2 text-sm">آدرس کامل</label>
              <textarea
                placeholder="آدرس کامل پستی"
                className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all h-24"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 text-sm">کد پستی</label>
              <input
                type="text"
                placeholder="کد پستی ۱۰ رقمی"
                className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 text-sm">شماره تماس</label>
              <input
                type="text"
                placeholder="شماره موبایل"
                className="w-full bg-primary-900/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-primary-900 border border-primary-700 rounded-md checked:bg-blue-500 checked:border-blue-500"
                />
                <span className="text-gray-300">این آدرس به عنوان آدرس پیش‌فرض استفاده شود</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline"
              className="border-primary-700/50 text-gray-300 hover:bg-primary-800"
              onClick={() => setShowAddForm(false)}
            >
              انصراف
            </Button>
            <Button 
              variant="primary"
              className="flex items-center gap-2"
            >
              <FiCheck />
              ثبت آدرس
            </Button>
          </div>
        </div>
      )}
      
      {/* لیست آدرس‌ها */}
      <div className="space-y-6">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div 
              key={address.id} 
              className={`bg-primary-800/30 border rounded-lg p-6 transition-all ${
                address.isDefault 
                  ? 'border-blue-500/50 shadow-md shadow-blue-500/5' 
                  : 'border-primary-700/30 hover:border-primary-600/50'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                  <div className={`p-1.5 rounded-md ${address.isDefault ? 'bg-blue-500/20 text-blue-400' : 'bg-primary-700/50 text-white'}`}>
                    <FiMapPin />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{address.title}</h3>
                      {address.isDefault && (
                        <span className="bg-blue-500/20 text-blue-400 text-xs py-0.5 px-2 rounded-full border border-blue-500/30">
                          پیش‌فرض
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{address.fullName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!address.isDefault && (
                    <Button 
                      variant="outline" 
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 p-2"
                      onClick={() => setDefaultAddress(address.id)}
                    >
                      <FiCheck size={16} />
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 p-2"
                    onClick={() => setEditingAddress(address.id)}
                  >
                    <FiEdit2 size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 p-2"
                    onClick={() => deleteAddress(address.id)}
                  >
                    <FiTrash2 size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="bg-primary-900/30 rounded-lg p-4 border border-primary-800/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm block mb-1">استان / شهر:</span>
                    <span className="text-white">{address.province} - {address.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block mb-1">کد پستی:</span>
                    <span className="text-white font-mono">{address.postalCode}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block mb-1">شماره تماس:</span>
                    <span className="text-white font-mono">{address.phone}</span>
                  </div>
                  <div className="md:col-span-3">
                    <span className="text-gray-400 text-sm block mb-1">آدرس:</span>
                    <span className="text-white">{address.address}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <FiMapPin className="text-gray-400 text-5xl" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">هیچ آدرسی ثبت نشده است</h3>
            <p className="text-gray-400 mb-4">برای ارسال سفارش نیاز به ثبت آدرس دارید.</p>
            <Button 
              variant="primary"
              className="inline-flex items-center justify-center gap-2"
              onClick={() => setShowAddForm(true)}
            >
              <FiPlus />
              افزودن آدرس جدید
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 