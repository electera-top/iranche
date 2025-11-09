"use client";

import React, { useState, useEffect } from 'react';
import { FiSearch, FiGrid, FiList, FiX, FiHeart, FiMessageCircle, FiBookmark, FiShare2 } from 'react-icons/fi';
import StorySlider from '@/components/explore/StorySlider';
import CategorySlider from '@/components/explore/CategorySlider';
import PostCard from '@/components/explore/PostCard';
import Header from '@/components/layout/Header/Header';
import MobileHeader from '@/components/layout/Header/MobileHeader';

// داده‌های نمونه برای دسته‌بندی‌ها
const categories = [
  { id: '1', name: 'مد و پوشاک' },
  { id: '2', name: 'دیجیتال' },
  { id: '3', name: 'زیبایی' },
  { id: '4', name: 'غذا' },
  { id: '5', name: 'ورزش' },
  { id: '6', name: 'طراحی' },
  { id: '7', name: 'هنر' },
];

// داده‌های نمونه برای استوری‌ها
const stories = [
  {
    id: '1',
    title: 'فرش دستباف ایرانی',
    image: 'https://source.unsplash.com/random/400x400?persian-carpet',
    store: {
      id: '1',
      name: 'گالری فرش مشهد',
      logo: 'https://source.unsplash.com/random/80x80?logo',
      isVIP: true,
    },
    productLink: '/products/1',
    productTitle: 'فرش دستباف اصفهان',
    duration: 5,
  },
  {
    id: '2',
    title: 'مینیاتور ایرانی',
    image: 'https://source.unsplash.com/random/400x400?persian-art',
    store: {
      id: '2',
      name: 'گالری هنر ایرانی',
      logo: 'https://source.unsplash.com/random/80x80?art-logo',
      isVIP: false,
    },
    productLink: '/products/2',
    productTitle: 'مینیاتور روی چوب',
    duration: 4,
  },
  {
    id: '3',
    title: 'کاشی‌کاری سنتی',
    image: 'https://source.unsplash.com/random/400x400?islamic-pattern',
    store: {
      id: '3',
      name: 'صنایع دستی اصفهان',
      logo: 'https://source.unsplash.com/random/80x80?craft-logo',
      isVIP: true,
    },
    productLink: '/products/3',
    productTitle: 'کاشی هفت رنگ',
    duration: 6,
  },
  {
    id: '4',
    title: 'طراحی داخلی ایرانی',
    image: 'https://source.unsplash.com/random/400x400?persian-design',
    store: {
      id: '4',
      name: 'دکوراسیون ایرانی',
      logo: 'https://source.unsplash.com/random/80x80?decor-logo',
      isVIP: true,
    },
    productLink: '/products/4',
    productTitle: 'مبلمان سنتی',
    duration: 5,
  },
  {
    id: '5',
    title: 'سفالگری سنتی',
    image: 'https://source.unsplash.com/random/400x400?pottery',
    store: {
      id: '5',
      name: 'هنر دست',
      logo: 'https://source.unsplash.com/random/80x80?craft-store',
      isVIP: false,
    },
    productLink: '/products/5',
    productTitle: 'سفال لعابدار',
    duration: 4,
  },
  {
    id: '6',
    title: 'معرق چوب',
    image: 'https://source.unsplash.com/random/400x400?woodcraft',
    store: {
      id: '6',
      name: 'صنایع چوبی',
      logo: 'https://source.unsplash.com/random/80x80?wood-logo',
      isVIP: true,
    },
    productLink: '/products/6',
    productTitle: 'تابلو معرق',
    duration: 5,
  },
  {
    id: '7',
    title: 'خاتم‌کاری',
    image: 'https://source.unsplash.com/random/400x400?wood-art',
    store: {
      id: '7',
      name: 'هنر خاتم',
      logo: 'https://source.unsplash.com/random/80x80?art-store',
      isVIP: true,
    },
    productLink: '/products/7',
    productTitle: 'جعبه خاتم',
    duration: 4,
  },
  {
    id: '8',
    title: 'میناکاری',
    image: 'https://source.unsplash.com/random/400x400?enamel',
    store: {
      id: '8',
      name: 'میناکاری اصفهان',
      logo: 'https://source.unsplash.com/random/80x80?craft-shop',
      isVIP: false,
    },
    productLink: '/products/8',
    productTitle: 'ظروف میناکاری',
    duration: 5,
  },
];

// داده‌های نمونه برای پست‌ها
interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  store: {
    id: string;
    name: string;
    logo: string;
    isVIP: boolean;
  };
  category: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  isVIP: boolean;
  isAd: boolean;
  isVideo?: boolean;
  isSlider?: boolean;
}

const posts: Post[] = [
  {
    id: '1',
    title: 'فرش دستباف ایرانی طرح اصفهان',
    description: 'مجموعه فرش‌های دستباف با طرح‌های سنتی ایرانی و نقوش اصیل',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '1',
      name: 'گالری فرش مشهد',
      logo: 'https://picsum.photos/80/80',
      isVIP: true,
    },
    category: 'طراحی',
    likes: 120,
    comments: 45,
    views: 1000,
    createdAt: '2024-03-20',
    isVIP: true,
    isAd: false,
  },
  {
    id: '2',
    title: 'مینیاتور ایرانی با طرح دایره‌ای',
    description: 'هنر مینیاتور با الهام از طرح‌های ایرانی و دایره‌های متحدالمرکز',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '2',
      name: 'گالری هنر ایرانی',
      logo: 'https://picsum.photos/80/80',
      isVIP: false,
    },
    category: 'هنر',
    likes: 85,
    comments: 32,
    views: 800,
    createdAt: '2024-03-19',
    isVIP: false,
    isAd: true,
  },
  {
    id: '3',
    title: 'کاشی‌کاری سنتی با طرح‌های هندسی',
    description: 'طرح‌های هندسی و دایره‌ای برگرفته از معماری ایرانی',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '3',
      name: 'صنایع دستی اصفهان',
      logo: 'https://picsum.photos/80/80',
      isVIP: true,
    },
    category: 'هنر',
    likes: 150,
    comments: 60,
    views: 1200,
    createdAt: '2024-03-18',
    isVIP: true,
    isAd: false,
  },
  {
    id: '4',
    title: 'طراحی داخلی به سبک ایرانی',
    description: 'ایده‌های مدرن برای طراحی داخلی با الهام از معماری سنتی ایران',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '4',
      name: 'دکوراسیون ایرانی',
      logo: 'https://picsum.photos/80/80',
      isVIP: true,
    },
    category: 'طراحی',
    likes: 95,
    comments: 30,
    views: 870,
    createdAt: '2024-03-17',
    isVIP: false,
    isAd: true,
  },
  {
    id: '5',
    title: 'سفالگری سنتی ایرانی',
    description: 'هنر سفالگری با تکنیک‌های قدیمی و طرح‌های مدرن',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '5',
      name: 'هنر دست',
      logo: 'https://picsum.photos/80/80',
      isVIP: false,
    },
    category: 'هنر',
    likes: 78,
    comments: 25,
    views: 650,
    createdAt: '2024-03-16',
    isVIP: false,
    isAd: false,
  },
  {
    id: '6',
    title: 'معرق چوب طرح اسلیمی',
    description: 'هنر معرق چوب با نقوش اسلیمی و هندسی',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '6',
      name: 'صنایع چوبی',
      logo: 'https://picsum.photos/80/80',
      isVIP: true,
    },
    category: 'هنر',
    likes: 110,
    comments: 42,
    views: 920,
    createdAt: '2024-03-15',
    isVIP: true,
    isAd: false,
  },
  {
    id: '7',
    title: 'گلیم ایرانی با طرح ترکمن',
    description: 'گلیم‌های دستباف با رنگ‌های طبیعی و طرح‌های سنتی ترکمن',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '7',
      name: 'گلیم و جاجیم سنتی',
      logo: 'https://picsum.photos/80/80',
      isVIP: true,
    },
    category: 'طراحی',
    likes: 135,
    comments: 48,
    views: 980,
    createdAt: '2024-03-14',
    isVIP: true,
    isAd: false,
  },
  {
    id: '8',
    title: 'زیورآلات سنتی نقره',
    description: 'مجموعه زیورآلات دست‌ساز با نقره و سنگ‌های نیمه قیمتی',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '8',
      name: 'نقره سرای سنتی',
      logo: 'https://picsum.photos/80/80',
      isVIP: false,
    },
    category: 'زیبایی',
    likes: 92,
    comments: 36,
    views: 750,
    createdAt: '2024-03-13',
    isVIP: false,
    isAd: true,
  },
  {
    id: '9',
    title: 'ترمه دوزی اصیل ایرانی',
    description: 'پارچه‌های ترمه دست‌دوز با نقوش سنتی ایرانی',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '9',
      name: 'ترمه سرای یزد',
      logo: 'https://picsum.photos/80/80',
      isVIP: true,
    },
    category: 'هنر',
    likes: 105,
    comments: 40,
    views: 830,
    createdAt: '2024-03-12',
    isVIP: true,
    isAd: false,
  },
  {
    id: '10',
    title: 'پوشاک محلی اقوام ایرانی',
    description: 'لباس‌های محلی دست‌دوز از اقوام مختلف ایرانی',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '10',
      name: 'خانه مد ایرانی',
      logo: 'https://picsum.photos/80/80',
      isVIP: false,
    },
    category: 'مد و پوشاک',
    likes: 88,
    comments: 34,
    views: 720,
    createdAt: '2024-03-11',
    isVIP: false,
    isAd: true,
  },
  {
    id: '11',
    title: 'ظروف مسی قلم‌زنی شده',
    description: 'ظروف مسی با طرح‌های قلم‌زنی شده سنتی',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '11',
      name: 'مس و خاتم',
      logo: 'https://picsum.photos/80/80',
      isVIP: true,
    },
    category: 'طراحی',
    likes: 125,
    comments: 45,
    views: 950,
    createdAt: '2024-03-10',
    isVIP: true,
    isAd: false,
  },
  {
    id: '12',
    title: 'قالی ابریشم تبریز',
    description: 'فرش‌های ابریشمی دستباف با طرح‌های اصیل تبریز',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '12',
      name: 'فرش ابریشم تبریز',
      logo: 'https://picsum.photos/80/80',
      isVIP: false,
    },
    category: 'طراحی',
    likes: 138,
    comments: 52,
    views: 1050,
    createdAt: '2024-03-09',
    isVIP: false,
    isAd: true,
  },
  {
    id: '13',
    title: 'سفال میناکاری اصفهان',
    description: 'ظروف سفالی میناکاری شده با طرح‌های سنتی اصفهان',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '13',
      name: 'هنرکده اصفهان',
      logo: 'https://picsum.photos/80/80',
      isVIP: true,
    },
    category: 'هنر',
    likes: 115,
    comments: 38,
    views: 880,
    createdAt: '2024-03-08',
    isVIP: true,
    isAd: false,
  },
  {
    id: '14',
    title: 'جواهرات فیروزه نیشابور',
    description: 'زیورآلات دست‌ساز با فیروزه اصل نیشابور',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '14',
      name: 'جواهری فیروزه',
      logo: 'https://picsum.photos/80/80',
      isVIP: false,
    },
    category: 'زیبایی',
    likes: 98,
    comments: 42,
    views: 820,
    createdAt: '2024-03-07',
    isVIP: false,
    isAd: true,
  },
  {
    id: '15',
    title: 'چرم دست‌دوز تبریز',
    description: 'محصولات چرمی دست‌دوز با چرم طبیعی و دوخت سنتی',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '15',
      name: 'چرم طبیعی',
      logo: 'https://picsum.photos/80/80',
      isVIP: true,
    },
    category: 'مد و پوشاک',
    likes: 112,
    comments: 44,
    views: 900,
    createdAt: '2024-03-06',
    isVIP: true,
    isAd: false,
  },
  {
    id: '16',
    title: 'شیرینی سنتی یزد',
    description: 'انواع شیرینی‌های سنتی یزد با دستور پخت اصیل',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '16',
      name: 'شیرینی سرای یزد',
      logo: 'https://picsum.photos/80/80',
      isVIP: false,
    },
    category: 'غذا',
    likes: 130,
    comments: 55,
    views: 980,
    createdAt: '2024-03-05',
    isVIP: false,
    isAd: true,
  },
  {
    id: '17',
    title: 'تابلو نقاشی مینیاتور',
    description: 'تابلوهای نقاشی مینیاتور با رنگ طبیعی و قلم مو آهو',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '17',
      name: 'گالری مینیاتور',
      logo: 'https://picsum.photos/80/80',
      isVIP: true,
    },
    category: 'هنر',
    likes: 145,
    comments: 60,
    views: 1100,
    createdAt: '2024-03-04',
    isVIP: true,
    isAd: false,
  },
  {
    id: '18',
    title: 'سنتور دست‌ساز اصفهان',
    description: 'سازهای سنتی دست‌ساز با چوب مرغوب و صدای اصیل',
    image: 'https://picsum.photos/600/600',
    store: {
      id: '18',
      name: 'خانه ساز ایرانی',
      logo: 'https://picsum.photos/80/80',
      isVIP: false,
    },
    category: 'هنر',
    likes: 118,
    comments: 48,
    views: 930,
    createdAt: '2024-03-03',
    isVIP: false,
    isAd: true,
  },
];

export default function ExplorePage() {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let filtered = [...posts];

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.store.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === categories.find(c => c.id === selectedCategory)?.name);
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory]);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <main className="min-h-screen text-white">
      <Header />
      <MobileHeader />

      <div className="container px-0 sm:px-4">
        <div className="min-h-screen text-white pb-20" dir="rtl">
          {/* پنل جستجو */}
          {showSearch && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-95 pt-16">
              <div className="p-4">
                <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2.5">
                  <input
                    type="text"
                    placeholder="جستجو..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white border-none outline-none text-right"
                    autoFocus
                  />
                  <FiSearch className="w-5 h-5 text-gray-400" />
                  <button
                    onClick={() => setShowSearch(false)}
                    className="text-gray-400 hover:text-white mr-auto text-sm"
                  >
                    انصراف
                  </button>
                </div>
                
                {searchQuery && (
                  <div className="mt-4">
                    <h3 className="text-white text-sm mb-2 px-1">نتایج جستجو</h3>
                    <div className="space-y-4">
                      {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                          <PostCard key={post.id} post={post} viewMode="list" />
                        ))
                      ) : (
                        <div className="text-gray-400 text-center py-6">نتیجه‌ای یافت نشد</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* لیست پست‌ها */}
          <div className=" mx-auto">
            {/* بخش استوری‌ها */}
            <div className="border-b border-zinc-800 py-4">
              <StorySlider stories={stories} />
            </div>

            {/* فیلتر دسته‌بندی */}
            <div className="sticky top-0 z-30 py-3">
              <CategorySlider
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* نوار ابزار */}
            <div className="flex justify-between items-center my-4">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button 
                  className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-secondary text-white' : 'text-zinc-400'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid className="text-xl" />
                </button>
                <button 
                  className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-secondary text-white' : 'text-zinc-400'}`}
                  onClick={() => setViewMode('list')}
                >
                  <FiList className="text-xl" />
                </button>
              </div>
            </div>

            {/* گرید پست‌ها */}
            {viewMode === 'grid' ? (
              <div className="grid gap-1 max-w-screen-lg mx-auto">
                {filteredPosts.length > 0 ? (
                  <>
                    {Array.from({ length: Math.ceil(filteredPosts.length / 5) }).map((_, setIndex) => {
                      const startIndex = setIndex * 5;
                      const postsInSet = filteredPosts.slice(startIndex, startIndex + 5);
                      const isRightSet = setIndex % 2 === 0;

                      return (
                        <div key={setIndex} className="grid grid-cols-3 gap-1">
                          {isRightSet ? (
                            <>
                              {/* مربع‌ها در سمت چپ */}
                              <div className="grid grid-cols-2 col-span-2 gap-1">
                                {postsInSet.slice(0, 4).map((post) => (
                                  <div key={post.id} className="aspect-square cursor-pointer" onClick={() => handlePostClick(post)}>
                                    <PostCard post={post} viewMode="grid" className="h-full w-full object-cover" />
                                  </div>
                                ))}
                              </div>
                              {/* مستطیل در سمت راست */}
                              {postsInSet[4] && (
                                <div className="aspect-[1/2] cursor-pointer" onClick={() => handlePostClick(postsInSet[4])}>
                                  <PostCard post={postsInSet[4]} viewMode="grid" className="h-full w-full object-cover" />
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {/* مستطیل در سمت چپ */}
                              {postsInSet[4] && (
                                <div className="aspect-[1/2] cursor-pointer" onClick={() => handlePostClick(postsInSet[4])}>
                                  <PostCard post={postsInSet[4]} viewMode="grid" className="h-full w-full object-cover" />
                                </div>
                              )}
                              {/* مربع‌ها در سمت راست */}
                              <div className="grid grid-cols-2 col-span-2 gap-1">
                                {postsInSet.slice(0, 4).map((post) => (
                                  <div key={post.id} className="aspect-square cursor-pointer" onClick={() => handlePostClick(post)}>
                                    <PostCard post={post} viewMode="grid" className="h-full w-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="text-gray-400 text-center py-6">پستی یافت نشد</div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <div key={post.id} className="cursor-pointer" onClick={() => handlePostClick(post)}>
                      <PostCard key={post.id} post={post} viewMode="list" />
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-6">پستی یافت نشد</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* مودال نمایش جزئیات پست */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" onClick={closeModal}>
          <div 
            className="w-full h-full md:h-auto md:max-h-[90vh] overflow-y-auto flex flex-col md:flex-row bg-black modal-container" 
            onClick={e => e.stopPropagation()}
          >
            {/* بخش سمت چپ - تصویر/ویدیو */}
            <div className="w-full md:w-7/12 h-[30vh] md:h-auto relative bg-black flex items-center justify-center image-section cursor-pointer transition-all duration-300 ease-in-out" onClick={(e) => {
              e.stopPropagation();
              const imageSection = e.currentTarget;
              if (window.innerWidth < 768) { // فقط در حالت موبایل
                if (imageSection.classList.contains('h-[100vh]')) {
                  imageSection.classList.remove('h-[100vh]');
                  imageSection.classList.add('h-[30vh]');
                  imageSection.classList.remove('fixed', 'top-0', 'left-0', 'z-50');
                } else {
                  imageSection.classList.remove('h-[30vh]');
                  imageSection.classList.add('h-[100vh]');
                  imageSection.classList.add('fixed', 'top-0', 'left-0', 'z-50');
                }
              }
            }}>
              {selectedPost.isVideo ? (
                <video 
                  controls 
                  className="w-full h-full object-contain transition-all duration-300 ease-in-out"
                  src={selectedPost.image} 
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              ) : selectedPost.isSlider ? (
                <div className="w-full h-full relative">
                  {/* اینجا اسلایدر قرار می‌گیرد */}
                  <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-contain transition-all duration-300 ease-in-out" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="flex space-x-2">
                      {[1, 2, 3].map(num => (
                        <div key={num} className={`w-2 h-2 rounded-full ${num === 1 ? 'bg-white' : 'bg-gray-500'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-contain transition-all duration-300 ease-in-out" />
              )}
            </div>
            
            {/* بخش سمت راست - اطلاعات */}
            <div className="w-full md:w-5/12 h-[calc(100vh-30vh)] md:h-auto bg-primary flex flex-col overflow-y-auto">
              {/* هدر */}
              <div className="flex items-center p-4 border-b border-primary-900 sticky top-0 bg-zinc-900 z-10">
                <div className="flex items-center">
                  <img src={selectedPost.store.logo} alt={selectedPost.store.name} className="w-12 h-12 rounded-full border-2 border-zinc-700" />
                  <div className="mr-3">
                    <div className="flex items-center">
                      <span className="font-bold text-base">{selectedPost.store.name}</span>
                      {selectedPost.store.isVIP && (
                        <span className="mr-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-1.5 rounded-full font-bold">VIP</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">مشاهده فروشگاه</button>
                      <span className="text-xs text-gray-400">۲۵۰ دنبال‌کننده</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="ml-1">طبقه:</span>
                        <span className="text-white font-medium">۳</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="ml-1">پلاک:</span>
                        <span className="text-white font-medium">۱۲۳</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={closeModal} className="mr-auto p-2 text-gray-400 hover:text-white">
                  <FiX size={24} />
                </button>
              </div>
              
              {/* کپشن */}
              <div className="p-4 border-b border-primary-900">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-400">دسته‌بندی:</span>
                  <span className="text-sm font-medium text-blue-400">مد و پوشاک</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{selectedPost.title}</h3>
                <p className="text-gray-300 text-base leading-relaxed">{selectedPost.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs bg-zinc-800 text-gray-300 px-2 py-1 rounded-full">#مد</span>
                  <span className="text-xs bg-zinc-800 text-gray-300 px-2 py-1 rounded-full">#پوشاک</span>
                  <span className="text-xs bg-zinc-800 text-gray-300 px-2 py-1 rounded-full">#فشن</span>
                  <span className="text-xs bg-zinc-800 text-gray-300 px-2 py-1 rounded-full">#لباس</span>
                </div>
                <div className="mt-2 text-gray-400 text-sm">{selectedPost.createdAt}</div>
              </div>
              
              {/* دکمه‌های تعاملی */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex space-x-4 rtl:space-x-reverse">
                    <button className="text-white hover:text-red-500 transition-colors">
                      <FiHeart size={24} />
                    </button>
                    <button className="text-white hover:text-blue-400 transition-colors">
                      <FiMessageCircle size={24} />
                    </button>
                    <button className="text-white hover:text-green-400 transition-colors">
                      <FiShare2 size={24} />
                    </button>
                  </div>
                  <button className="text-white hover:text-yellow-400 transition-colors">
                    <FiBookmark size={24} />
                  </button>
                </div>
                <div className="text-base font-bold mb-1">{selectedPost.likes} پسند</div>
                <div className="text-sm text-gray-400 mb-4">{selectedPost.views} بازدید</div>
              </div>

              {/* محصولات مرتبط */}
              <div className="p-4 border-t border-primary-900">
                <h3 className="text-lg font-bold mb-4">محصولات مرتبط</h3>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="bg-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-700 transition-colors cursor-pointer">
                      <img 
                        src={`https://picsum.photos/200/200?random=${index}`} 
                        alt="محصول مرتبط" 
                        className="w-full aspect-square object-cover"
                      />
                      <div className="p-1.5">
                        <div className="text-[10px] font-bold truncate">محصول {index + 1}</div>
                        <div className="text-[8px] text-gray-400">۱,۲۹۰,۰۰۰</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* کامنت‌ها */}
              <div className="p-4 border-t border-primary-900">
                <h3 className="text-lg font-bold mb-4">نظرات</h3>
                <div className="space-y-6">
                  <div className="flex">
                    <img src="https://picsum.photos/50/50" alt="User" className="w-12 h-12 rounded-full border-2 border-zinc-700" />
                    <div className="mr-3 flex-grow">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">کاربر ۱</span>
                          <span className="text-xs text-gray-400">۲ ساعت پیش</span>
                        </div>
                        <span className="text-base text-gray-300 mt-1">عالی بود!</span>
                        <div className="flex items-center mt-2 space-x-4 rtl:space-x-reverse">
                          <button className="text-sm text-gray-400 hover:text-white transition-colors">پاسخ</button>
                          <button className="text-sm text-gray-400 hover:text-white transition-colors">پسندیدن</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <img src="https://picsum.photos/51/51" alt="User" className="w-12 h-12 rounded-full border-2 border-zinc-700" />
                    <div className="mr-3 flex-grow">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">کاربر ۲</span>
                          <span className="text-xs text-gray-400">۵ ساعت پیش</span>
                        </div>
                        <span className="text-base text-gray-300 mt-1">من از این محصول استفاده کردم و واقعا کیفیتش عالیه. پیشنهاد می‌کنم حتما امتحان کنید.</span>
                        <div className="flex items-center mt-2 space-x-4 rtl:space-x-reverse">
                          <button className="text-sm text-gray-400 hover:text-white transition-colors">پاسخ</button>
                          <button className="text-sm text-gray-400 hover:text-white transition-colors">پسندیدن</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* نوشتن کامنت */}
              <div className="p-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-900">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <img src="https://picsum.photos/50/50" alt="User" className="w-8 h-8 rounded-full border-2 border-zinc-700" />
                  <input 
                    type="text" 
                    placeholder="نظر خود را بنویسید..." 
                    className="flex-grow bg-zinc-800 text-white rounded-full px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-bold transition-colors">ارسال</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 