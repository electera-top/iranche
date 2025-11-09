'use client';

import { useState } from 'react';
import { FiEye, FiTrash2, FiStar, FiShoppingCart, FiFilter, FiCalendar, FiHeart, FiArrowRight } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

// تعریف نوع داده‌ها
interface RecentProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  discount?: number;
  rating: number;
  viewDate: string;
  viewTime: string;
  category: string;
  isAvailable: boolean;
}

export default function RecentViewsPage() {
  // داده‌های نمونه
  const [recentViews, setRecentViews] = useState<RecentProduct[]>([
    {
      id: 'PROD-12345',
      name: 'گردنبند طلا طرح قلب',
      image: '/images/products/necklace1.jpg',
      price: 12500000,
      discount: 10,
      rating: 4.5,
      viewDate: '۱۵ فروردین ۱۴۰۲',
      viewTime: '۱۴:۳۰',
      category: 'گردنبند',
      isAvailable: true
    },
    {
      id: 'PROD-12344',
      name: 'انگشتر طلا با نگین الماس',
      image: '/images/products/ring1.jpg',
      price: 8700000,
      rating: 4.8,
      viewDate: '۱۴ فروردین ۱۴۰۲',
      viewTime: '۱۱:۴۵',
      category: 'انگشتر',
      isAvailable: true
    },
    {
      id: 'PROD-12343',
      name: 'دستبند طلا طرح زنجیری',
      image: '/images/products/bracelet1.jpg',
      price: 5900000,
      discount: 15,
      rating: 4.2,
      viewDate: '۱۲ فروردین ۱۴۰۲',
      viewTime: '۱۶:۱۰',
      category: 'دستبند',
      isAvailable: true
    },
    {
      id: 'PROD-12342',
      name: 'سرویس طلا نگین دار',
      image: '/images/products/set1.jpg',
      price: 45000000,
      rating: 4.9,
      viewDate: '۱۰ فروردین ۱۴۰۲',
      viewTime: '۰۹:۲۰',
      category: 'سرویس کامل',
      isAvailable: false
    },
    {
      id: 'PROD-12341',
      name: 'گوشواره طلا آویزدار',
      image: '/images/products/earring1.jpg',
      price: 4200000,
      discount: 5,
      rating: 4.1,
      viewDate: '۸ فروردین ۱۴۰۲',
      viewTime: '۱۷:۰۵',
      category: 'گوشواره',
      isAvailable: true
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // استخراج دسته‌بندی‌های منحصر به فرد
  const categories = ['all', ...Array.from(new Set(recentViews.map(product => product.category)))];

  // حذف یک محصول از تاریخچه بازدید
  const removeFromHistory = (id: string) => {
    setRecentViews(recentViews.filter(product => product.id !== id));
    setDeleteConfirm(null);
  };

  // پاک کردن کل تاریخچه بازدید
  const clearAllHistory = () => {
    setRecentViews([]);
  };

  // اعمال فیلترها
  const filteredProducts = recentViews.filter(product => {
    // فیلتر دسترس‌پذیری
    if (activeFilter === 'available' && !product.isAvailable) return false;
    if (activeFilter === 'unavailable' && product.isAvailable) return false;
    
    // فیلتر دسته‌بندی
    if (activeCategoryFilter !== 'all' && product.category !== activeCategoryFilter) return false;
    
    return true;
  });

  // فرمت کردن قیمت
  const formatPrice = (price: number): string => {
    return price.toLocaleString('fa-IR');
  };

  // محاسبه قیمت با تخفیف
  const calculateDiscountedPrice = (price: number, discount?: number): number => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FiEye className="ml-2" />
          بازدید‌های اخیر
        </h1>
        <p className="text-gray-400">لیست محصولاتی که اخیراً مشاهده کرده‌اید</p>
      </div>

      {/* فیلترها و دسته‌بندی‌ها */}
      <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* فیلتر وضعیت موجودی */}
          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
            <Button 
              variant={activeFilter === 'all' ? 'primary' : 'outline-primary'}
              className={`min-w-[100px] ${activeFilter === 'all' ? '' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('all')}
            >
              همه محصولات
            </Button>
            <Button 
              variant={activeFilter === 'available' ? 'primary' : 'outline-primary'}
              className={`min-w-[100px] ${activeFilter === 'available' ? 'bg-green-600 hover:bg-green-700 border-green-500' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('available')}
            >
              موجود
            </Button>
            <Button 
              variant={activeFilter === 'unavailable' ? 'primary' : 'outline-primary'}
              className={`min-w-[100px] ${activeFilter === 'unavailable' ? 'bg-red-600 hover:bg-red-700 border-red-500' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('unavailable')}
            >
              ناموجود
            </Button>
          </div>

          {/* دکمه پاک کردن تاریخچه */}
          {recentViews.length > 0 && (
            <Button 
              variant="outline-primary"
              className="text-sm border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={clearAllHistory}
            >
              <FiTrash2 size={16} className="ml-1" />
              پاک کردن تاریخچه
            </Button>
          )}
        </div>

        {/* فیلتر دسته‌بندی‌ها */}
        {categories.length > 2 && (
          <div className="mt-4 border-t border-primary-700/30 pt-4">
            <h3 className="text-sm text-gray-400 mb-3">فیلتر بر اساس دسته‌بندی:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategoryFilter === category ? 'primary' : 'outline-primary'}
                  className={`text-xs px-3 ${
                    activeCategoryFilter === category 
                      ? (category === 'all' ? '' : 'bg-blue-600 hover:bg-blue-700 border-blue-500') 
                      : 'border-primary-700/50 text-gray-300'
                  }`}
                  onClick={() => setActiveCategoryFilter(category)}
                >
                  {category === 'all' ? 'همه دسته‌ها' : category}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* لیست محصولات بازدید شده */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-primary-800/30 border border-primary-700/30 rounded-lg overflow-hidden hover:border-primary-600/50 transition-all"
            >
              {/* تصویر محصول */}
              <div className="h-48 relative overflow-hidden bg-primary-700/50">
                {/* این بخش در پروژه واقعی باید با تصویر واقعی جایگزین شود */}
                <div className="w-full h-full bg-gradient-to-br from-amber-600/20 to-amber-700/20 flex items-center justify-center">
                  <FiStar className="text-amber-300" size={48} />
                </div>
                
                {/* برچسب تخفیف */}
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount}٪ تخفیف
                  </div>
                )}
                
                {/* وضعیت موجودی */}
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">ناموجود</span>
                  </div>
                )}
                
                {/* تاریخ و زمان بازدید */}
                <div className="absolute bottom-2 left-2 bg-primary-900/80 text-gray-300 text-xs px-2 py-1 rounded flex items-center">
                  <FiEye className="ml-1" size={12} />
                  {product.viewDate} | {product.viewTime}
                </div>
              </div>
              
              {/* اطلاعات محصول */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-bold">{product.name}</h3>
                  
                  {/* امتیاز محصول */}
                  <div className="flex items-center bg-amber-500/10 px-2 py-1 rounded">
                    <FiStar className="text-amber-400 ml-1" size={14} />
                    <span className="text-amber-400 text-xs">{product.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-xs mb-4">دسته‌بندی: {product.category}</p>
                
                {/* قیمت محصول */}
                <div className="flex items-end gap-2 mb-4">
                  {product.discount ? (
                    <>
                      <div>
                        <span className="text-gray-400 text-xs line-through">{formatPrice(product.price)}</span>
                        <p className="text-white font-bold">{formatPrice(calculateDiscountedPrice(product.price, product.discount))} تومان</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-white font-bold">{formatPrice(product.price)} تومان</p>
                  )}
                </div>
                
                {/* دکمه‌های عملیاتی */}
                <div className="flex justify-between gap-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline-primary"
                      className="text-sm border-primary-700/50 text-blue-400 hover:bg-blue-600/10"
                      onClick={() => {/* انتقال به صفحه محصول */}}
                    >
                      <FiArrowRight size={16} />
                    </Button>
                    <Button 
                      variant="outline-primary"
                      className="text-sm border-primary-700/50 text-pink-400 hover:bg-pink-600/10"
                      onClick={() => {/* افزودن به علاقه‌مندی‌ها */}}
                    >
                      <FiHeart size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    {product.isAvailable && (
                      <Button 
                        variant="primary"
                        className="text-sm bg-green-600 hover:bg-green-700 border-green-500"
                        onClick={() => {/* افزودن به سبد خرید */}}
                      >
                        <FiShoppingCart size={16} className="ml-1" />
                        خرید
                      </Button>
                    )}
                    
                    {deleteConfirm === product.id ? (
                      <div className="flex gap-1">
                        <Button 
                          variant="outline-primary"
                          className="text-sm border-primary-700/50 text-gray-300 px-2"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          لغو
                        </Button>
                        <Button 
                          variant="primary"
                          className="text-sm bg-red-600 hover:bg-red-700 border-red-500 px-2"
                          onClick={() => removeFromHistory(product.id)}
                        >
                          تایید
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline-primary"
                        className="text-sm border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => setDeleteConfirm(product.id)}
                      >
                        <FiTrash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <FiEye className="text-gray-400 text-5xl" />
          </div>
          <h3 className="text-white text-lg font-medium mb-2">تاریخچه بازدید خالی است</h3>
          <p className="text-gray-400 mb-4">شما هنوز محصولی مشاهده نکرده‌اید یا محصولی با فیلتر انتخاب شده وجود ندارد.</p>
          {recentViews.length > 0 && activeFilter !== 'all' && (
            <Button
              variant="primary"
              className="inline-flex items-center justify-center gap-2"
              onClick={() => setActiveFilter('all')}
            >
              <FiFilter size={18} />
              نمایش همه محصولات
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 