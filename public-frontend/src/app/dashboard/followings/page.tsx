'use client';

import { useState } from 'react';
import { FiUser, FiUsers, FiSearch, FiShoppingBag, FiCheck, FiPlus, FiX, FiStar } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

// تعریف نوع داده‌ها
interface Seller {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  productCount: number;
  followerCount: number;
  rating: number;
  isFollowing: boolean;
}

export default function FollowingsPage() {
  // لیست فروشندگان دنبال شده
  const [followedSellers, setFollowedSellers] = useState<Seller[]>([
    {
      id: 'seller-1',
      username: 'gold_shop',
      fullName: 'فروشگاه طلای پارسیان',
      avatar: '/images/sellers/seller1.jpg',
      bio: 'فروش انواع طلا، جواهرات و زیورآلات با کیفیت و قیمت مناسب',
      productCount: 157,
      followerCount: 1250,
      rating: 4.8,
      isFollowing: true
    },
    {
      id: 'seller-2',
      username: 'zarrin_gallery',
      fullName: 'گالری زرین',
      avatar: '/images/sellers/seller2.jpg',
      bio: 'طراحی و تولید جواهرات مدرن و کلاسیک با طراحی منحصر به فرد',
      productCount: 93,
      followerCount: 850,
      rating: 4.6,
      isFollowing: true
    },
    {
      id: 'seller-3',
      username: 'tala_market',
      fullName: 'بازار طلا',
      avatar: '/images/sellers/seller3.jpg',
      bio: 'عرضه مستقیم محصولات طلا از تولیدکنندگان معتبر با قیمت عمده',
      productCount: 211,
      followerCount: 2160,
      rating: 4.9,
      isFollowing: true
    }
  ]);

  // لیست فروشندگان پیشنهادی برای دنبال کردن
  const [suggestedSellers, setSuggestedSellers] = useState<Seller[]>([
    {
      id: 'seller-4',
      username: 'jewelry_house',
      fullName: 'خانه جواهر',
      avatar: '/images/sellers/seller4.jpg',
      bio: 'تولید کننده انواع زیورآلات نقره و طلا با طراحی مدرن و خاص',
      productCount: 78,
      followerCount: 560,
      rating: 4.4,
      isFollowing: false
    },
    {
      id: 'seller-5',
      username: 'royal_gold',
      fullName: 'طلای سلطنتی',
      avatar: '/images/sellers/seller5.jpg',
      bio: 'فروشنده انواع طلا با عیار 24 و جواهرات لوکس و سفارشی',
      productCount: 113,
      followerCount: 970,
      rating: 4.7,
      isFollowing: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'following' | 'suggested'>('following');

  // دنبال کردن یا لغو دنبال کردن فروشندگان
  const toggleFollow = (sellerId: string, currentlyFollowing: boolean) => {
    if (currentlyFollowing) {
      // لغو دنبال کردن
      const seller = followedSellers.find(s => s.id === sellerId);
      if (seller) {
        const updatedSeller = { ...seller, isFollowing: false };
        setFollowedSellers(followedSellers.filter(s => s.id !== sellerId));
        setSuggestedSellers([updatedSeller, ...suggestedSellers]);
      }
    } else {
      // دنبال کردن
      const seller = suggestedSellers.find(s => s.id === sellerId);
      if (seller) {
        const updatedSeller = { ...seller, isFollowing: true };
        setSuggestedSellers(suggestedSellers.filter(s => s.id !== sellerId));
        setFollowedSellers([updatedSeller, ...followedSellers]);
      }
    }
  };

  // جستجو در فروشندگان
  const filteredFollowedSellers = followedSellers.filter(seller =>
    seller.fullName.includes(searchTerm) || seller.username.includes(searchTerm) || seller.bio.includes(searchTerm)
  );

  const filteredSuggestedSellers = suggestedSellers.filter(seller =>
    seller.fullName.includes(searchTerm) || seller.username.includes(searchTerm) || seller.bio.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FiUsers className="ml-2" />
          فروشندگان دنبال شده
        </h1>
        <p className="text-gray-400">فروشندگان مورد علاقه خود را دنبال کنید و از محصولات جدید آنها مطلع شوید</p>
      </div>

      {/* نوار جستجو و تب‌ها */}
      <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full p-3 pr-10 bg-primary-800/50 border border-primary-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
              placeholder="جستجوی فروشنده..."
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              variant={activeTab === 'following' ? 'primary' : 'outline-primary'}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 min-w-[120px] ${activeTab === 'following' ? '' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveTab('following')}
            >
              <FiUsers size={18} />
              فروشندگان دنبال شده {followedSellers.length > 0 && `(${followedSellers.length})`}
            </Button>
            
            <Button 
              variant={activeTab === 'suggested' ? 'primary' : 'outline-primary'}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 min-w-[120px] ${activeTab === 'suggested' ? '' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveTab('suggested')}
            >
              <FiPlus size={18} />
              فروشندگان پیشنهادی
            </Button>
          </div>
        </div>
      </div>
      
      {/* لیست فروشندگان */}
      <div className="space-y-4">
        {activeTab === 'following' ? (
          filteredFollowedSellers.length > 0 ? (
            filteredFollowedSellers.map((seller) => (
              <div key={seller.id} className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-5 flex flex-col md:flex-row justify-between gap-6 hover:border-primary-600/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary-700 overflow-hidden border-2 border-primary-600/40">
                    {/* این بخش در پروژه واقعی باید با تصویر واقعی جایگزین شود */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xl font-bold text-white">
                      {seller.fullName.charAt(0)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-lg">{seller.fullName}</h3>
                      <span className="text-blue-400 text-sm">@{seller.username}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{seller.bio}</p>
                    
                    <div className="flex items-center gap-6 mt-2">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <FiShoppingBag size={14} />
                        <span>{seller.productCount} محصول</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <FiUsers size={14} />
                        <span>{seller.followerCount} دنبال‌کننده</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-sm">
                        <FiStar size={14} />
                        <span>{seller.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-3 justify-end md:min-w-[140px]">
                  <Button
                    variant="outline-primary"
                    className="flex-1 flex items-center justify-center gap-2 border-primary-700/50 text-blue-400 hover:bg-blue-600/10"
                    onClick={() => {/* نمایش پروفایل فروشنده */}}
                  >
                    <FiUser size={16} />
                    <span className="text-sm">پروفایل</span>
                  </Button>
                  
                  <Button
                    variant="outline-primary"
                    className="flex-1 flex items-center justify-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={() => toggleFollow(seller.id, true)}
                  >
                    <FiX size={16} />
                    <span className="text-sm">لغو دنبال</span>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiUsers className="text-gray-400 text-5xl" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">هیچ فروشنده‌ای دنبال نشده است</h3>
              <p className="text-gray-400 mb-4">فروشندگان مورد علاقه خود را دنبال کنید تا در این لیست نمایش داده شوند.</p>
              <Button
                variant="primary"
                className="inline-flex items-center justify-center gap-2"
                onClick={() => setActiveTab('suggested')}
              >
                <FiPlus size={18} />
                مشاهده فروشندگان پیشنهادی
              </Button>
            </div>
          )
        ) : (
          filteredSuggestedSellers.length > 0 ? (
            filteredSuggestedSellers.map((seller) => (
              <div key={seller.id} className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-5 flex flex-col md:flex-row justify-between gap-6 hover:border-primary-600/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary-700 overflow-hidden border-2 border-primary-600/40">
                    {/* این بخش در پروژه واقعی باید با تصویر واقعی جایگزین شود */}
                    <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xl font-bold text-white">
                      {seller.fullName.charAt(0)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-lg">{seller.fullName}</h3>
                      <span className="text-blue-400 text-sm">@{seller.username}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{seller.bio}</p>
                    
                    <div className="flex items-center gap-6 mt-2">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <FiShoppingBag size={14} />
                        <span>{seller.productCount} محصول</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <FiUsers size={14} />
                        <span>{seller.followerCount} دنبال‌کننده</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-sm">
                        <FiStar size={14} />
                        <span>{seller.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-3 justify-end md:min-w-[140px]">
                  <Button
                    variant="outline-primary"
                    className="flex-1 flex items-center justify-center gap-2 border-primary-700/50 text-blue-400 hover:bg-blue-600/10"
                    onClick={() => {/* نمایش پروفایل فروشنده */}}
                  >
                    <FiUser size={16} />
                    <span className="text-sm">پروفایل</span>
                  </Button>
                  
                  <Button
                    variant="primary"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600/80 hover:bg-green-600 border border-green-500/30"
                    onClick={() => toggleFollow(seller.id, false)}
                  >
                    <FiPlus size={16} />
                    <span className="text-sm">دنبال کردن</span>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiUsers className="text-gray-400 text-5xl" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">فروشنده پیشنهادی یافت نشد</h3>
              <p className="text-gray-400">در حال حاضر فروشنده پیشنهادی برای نمایش وجود ندارد.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
} 