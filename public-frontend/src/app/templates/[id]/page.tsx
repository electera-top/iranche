'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHeart, FiShare2, FiShoppingCart, FiStar, FiUsers, FiMessageSquare, FiEye, FiDownload, FiAward, FiCheck } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/button/Button';
import Header from '@/components/layout/Header/Header';
import MobileHeader from '@/components/layout/Header/MobileHeader';

const TemplateGallery = dynamic(() => import('@/components/ui/gallery/ProductGallery'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
  </div>
});

// Template creator interface
interface TemplateCreator {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalTemplates: number;
}

// Template interface
interface Template {
  id: string;
  title: string;
  thumbnail: string;
  images: string[];
  isPremium: boolean;
  price: number;
  category: string;
  rating: number;
  downloads: number;
  createdAt: string;
  creator: TemplateCreator;
  tags: string[];
  description: string;
  features: string[];
  requirements: string[];
  supportedPages: string[];
}

// Related template interface
interface RelatedTemplate {
  id: string;
  title: string;
  thumbnail: string;
  isPremium: boolean;
  price: number;
  category: string;
  creator: string;
}

// Review interface
interface Review {
  id: number;
  user: string;
  userAvatar: string;
  rating: number;
  date: string;
  text: string;
}

const TemplatePage = ({ params }: { params: { id: string } }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);
  const [relatedTemplates, setRelatedTemplates] = useState<RelatedTemplate[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call to fetch template data
    const fetchTemplateData = () => {
      setTimeout(() => {
        // This would be an actual API call in production
        setTemplate({
          id: params.id,
          title: 'قالب فروشگاهی مدرن پلاس',
          thumbnail: '/images/themes/theme-1.jpg',
          images: [
            '/images/themes/theme-1.jpg',
            '/images/themes/theme-2.jpg',
            '/images/themes/theme-3.jpg',
            '/images/themes/theme-4.png',
          ],
          isPremium: true,
          price: 490000,
          category: 'فروشگاهی',
          rating: 4.7,
          downloads: 2543,
          createdAt: '1402/09/15',
          creator: {
            id: 'c1',
            name: 'استودیو طراحی نوین',
            avatar: '/avatars/creator1.jpg',
            rating: 4.8,
            totalTemplates: 24
          },
          tags: ['فروشگاهی', 'مدرن', 'ریسپانسیو', 'چندمنظوره'],
          description: 'قالب فروشگاهی مدرن پلاس یک قالب کاملاً حرفه‌ای و پیشرفته برای فروشگاه‌های آنلاین است که با تمرکز بر تجربه کاربری عالی و طراحی مدرن ساخته شده است. این قالب با ویژگی‌های منحصربفرد خود مانند سبدخرید پیشرفته، پنل مدیریت قدرتمند، انواع صفحات از پیش طراحی شده و سیستم پرداخت یکپارچه، انتخاب ایده‌آلی برای راه‌اندازی یک فروشگاه آنلاین موفق است.',
          features: [
            'طراحی کاملاً ریسپانسیو برای تمام دستگاه‌ها',
            'پنل مدیریت پیشرفته و کاربرپسند',
            'بیش از ۱۰ چیدمان صفحه اصلی',
            'سیستم سبد خرید پیشرفته',
            'پشتیبانی از چندزبانگی (RTL و LTR)',
            'سازگاری با انواع درگاه‌های پرداخت',
            'سیستم مقایسه محصولات',
            'سیستم بررسی و نظرات محصولات',
            'بهینه‌سازی شده برای موتورهای جستجو',
            'سرعت بارگذاری بالا'
          ],
          requirements: [
            'PHP 7.4 یا بالاتر',
            'MySQL 5.7 یا بالاتر',
            'حداقل 256MB حافظه PHP',
            'پشتیبانی از mod_rewrite آپاچی'
          ],
          supportedPages: [
            'صفحه اصلی', 
            'صفحه محصول', 
            'دسته‌بندی محصولات',
            'سبد خرید',
            'تسویه حساب',
            'پروفایل کاربری',
            'لیست علاقه‌مندی‌ها',
            'تاریخچه سفارشات',
            'وبلاگ',
            'تماس با ما',
            'درباره ما'
          ]
        });

        setRelatedTemplates([
          {
            id: '2',
            title: 'قالب فروشگاهی الگانت',
            thumbnail: '/images/themes/theme-2.jpg',
            isPremium: true,
            price: 350000,
            category: 'فروشگاهی',
            creator: 'دیجیتال دیزاینرز',
          },
          {
            id: '3',
            title: 'قالب فروشگاهی مینیمال',
            thumbnail: '/images/themes/theme-3.jpg',
            isPremium: false,
            price: 0,
            category: 'فروشگاهی',
            creator: 'وب‌مستران پیشرو',
          },
          {
            id: '4',
            title: 'قالب فشن پرو',
            thumbnail: '/images/themes/theme-4.png',
            isPremium: true,
            price: 450000,
            category: 'فشن',
            creator: 'استودیو طراحی نوین',
          },
        ]);

        setReviews([
          {
            id: 1,
            user: 'علی محمدی',
            userAvatar: '/avatars/user1.jpg',
            rating: 5,
            date: '1402/11/15',
            text: 'این قالب فوق‌العاده است! نصب و راه‌اندازی بسیار آسان و امکانات کاملی دارد. از خریدم کاملا راضی هستم.',
          },
          {
            id: 2,
            user: 'مریم احمدی',
            userAvatar: '/avatars/user2.jpg',
            rating: 4,
            date: '1402/10/22',
            text: 'قالب بسیار زیبا و کاربردی است. فقط در بخش مدیریت سفارشات کمی مشکل داشتم که با پشتیبانی حل شد.',
          },
          {
            id: 3,
            user: 'رضا کریمی',
            userAvatar: '/avatars/user3.jpg',
            rating: 5,
            date: '1402/09/30',
            text: 'بهترین قالبی که تا به حال خریده‌ام. پشتیبانی عالی و به‌روزرسانی‌های منظم دارد.',
          },
        ]);

        setLoading(false);
      }, 1000);
    };

    fetchTemplateData();
  }, [params.id]);

  const openGallery = (index: number) => {
    setSelectedImage(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <h1 className="text-3xl font-bold text-white mb-4">قالب مورد نظر یافت نشد</h1>
        <Link href="/templates">
          <Button variant="secondary" size="lg">بازگشت به قالب‌ها</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      <MobileHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-gray-400 text-sm mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">خانه</Link>
          <span className="mx-2">/</span>
          <Link href="/templates" className="hover:text-secondary transition-colors">قالب‌ها</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">{template.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gallery Section */}
          <div className="lg:col-span-2">
            <div className="bg-primary-900 rounded-xl overflow-hidden shadow-xl shadow-black/20">
              {/* Main Image */}
              <div className="relative h-[300px] md:h-[400px] cursor-pointer" onClick={() => openGallery(0)}>
                <img 
                  src={template.images[0]} 
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <FiEye className="text-white text-4xl" />
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2 p-4">
                {template.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`h-20 cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-secondary' : 'border-transparent'
                    }`}
                    onClick={() => openGallery(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${template.title} - تصویر ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {isGalleryOpen && (
                <TemplateGallery 
                  productMedia={template.images.map(img => ({ type: 'image' as const, url: img }))}
                  userReviews={reviews.map(review => ({
                    id: review.id,
                    user: review.user,
                    image: review.userAvatar,
                    rating: review.rating,
                    date: review.date,
                    comment: review.text,
                    pros: [],
                    cons: []
                  }))}
                  isOpen={isGalleryOpen}
                  onClose={closeGallery}
                />
              )}
            </div>

            {/* Template Description */}
            <div className="mt-8 bg-primary-900 rounded-xl p-6 shadow-xl shadow-black/20">
              <div className="border-b border-primary-700 pb-4 mb-6">
                <h2 className="text-2xl font-bold mb-4">توضیحات قالب</h2>
                <p className="text-gray-300 leading-7">{template.description}</p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FiAward className="ml-2 text-secondary" />
                  ویژگی‌های قالب
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <FiCheck className="text-green-500 ml-2" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FiCheck className="ml-2 text-secondary" />
                  پیش‌نیازها
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {template.requirements.map((req, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <FiCheck className="text-green-500 ml-2" />
                      </div>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported Pages */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FiCheck className="ml-2 text-secondary" />
                  صفحات پشتیبانی شده
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {template.supportedPages.map((page, index) => (
                    <div key={index} className="bg-primary-800/40 py-2 px-3 rounded-lg text-center">
                      {page}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8 bg-primary-900 rounded-xl p-6 shadow-xl shadow-black/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FiMessageSquare className="ml-2 text-secondary" />
                نظرات کاربران
              </h2>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-primary-700 pb-6 last:border-0">
                      <div className="flex items-start">
                        <img 
                          src={review.userAvatar} 
                          alt={review.user}
                          className="w-12 h-12 rounded-full object-cover ml-4"
                        />
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-bold">{review.user}</h4>
                            <span className="text-gray-500 text-sm mr-2">({review.date})</span>
                          </div>
                          <div className="flex text-yellow-400 mt-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FiStar 
                                key={i} 
                                className={i < review.rating ? 'fill-current' : 'text-gray-600'} 
                              />
                            ))}
                          </div>
                          <p className="text-gray-300">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-400">هنوز نظری برای این قالب ثبت نشده است.</p>
              )}

              {/* Add Review Form */}
              <div className="mt-8 pt-6 border-t border-primary-700">
                <h3 className="text-xl font-bold mb-4">ثبت نظر</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-300">امتیاز شما</label>
                    <div className="flex text-gray-400">
                      {[...Array(5)].map((_, i) => (
                        <button 
                          key={i}
                          type="button"
                          className="text-2xl focus:outline-none"
                        >
                          <FiStar className="hover:text-yellow-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block mb-2 text-sm font-medium text-gray-300">نظر شما</label>
                    <textarea 
                      id="comment"
                      rows={4}
                      className="w-full bg-primary-800/40 rounded-lg border border-primary-700 text-white py-2 px-3 focus:outline-none focus:ring-1 focus:ring-secondary"
                    ></textarea>
                  </div>
                  <div className="text-left">
                    <Button variant="secondary" size="md" type="button">
                      ثبت نظر
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar - Purchase Section */}
          <div className="lg:col-span-1">
            <div className="bg-primary-900 rounded-xl p-6 shadow-xl shadow-black/20 sticky top-24">
              <div className="mb-6">
                <h1 className="text-2xl font-bold">{template.title}</h1>
                <div className="flex items-center mt-3 text-sm">
                  <div className="flex items-center ml-4">
                    <FiStar className="text-yellow-400 ml-1 fill-current" />
                    <span>{template.rating}</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <FiDownload className="text-gray-400 ml-1" />
                    <span>{template.downloads.toLocaleString()} دانلود</span>
                  </div>
                  <div className="flex items-center">
                    <FiEye className="text-gray-400 ml-1" />
                    <span>۵,۶۷۸ بازدید</span>
                  </div>
                </div>

                <div className="flex items-center mt-4 pb-6 border-b border-primary-700">
                  <img 
                    src={template.creator.avatar} 
                    alt={template.creator.name}
                    className="w-10 h-10 rounded-full object-cover ml-3"
                  />
                  <div>
                    <div className="font-medium">{template.creator.name}</div>
                    <div className="flex items-center text-sm text-gray-400">
                      <FiStar className="text-yellow-400 ml-1 fill-current" />
                      <span>{template.creator.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                {template.isPremium ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">قیمت:</span>
                      <div className="text-2xl font-bold text-white">{template.price.toLocaleString()} تومان</div>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 flex justify-center items-center"
                    >
                      <FiShoppingCart className="ml-2" />
                      خرید و نصب قالب
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">قیمت:</span>
                      <div className="text-xl font-bold text-green-500">رایگان!</div>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      <FiDownload className="ml-2" />
                      دانلود رایگان
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between space-x-4 rtl:space-x-reverse mb-6">
                <Button 
                  variant="outline-secondary"
                  className="flex-1 flex items-center justify-center"
                >
                  <FiHeart className="ml-1" />
                  علاقه‌مندی‌ها
                </Button>
                <Button 
                  variant="outline-secondary"
                  className="flex-1 flex items-center justify-center"
                >
                  <FiShare2 className="ml-1" />
                  اشتراک‌گذاری
                </Button>
              </div>

              <div className="bg-primary-800/40 p-4 rounded-lg">
                <h4 className="font-bold mb-3">اطلاعات تکمیلی</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">دسته‌بندی:</span>
                    <span>{template.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">تاریخ انتشار:</span>
                    <span>{template.createdAt}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">نوع قالب:</span>
                    <span>{template.isPremium ? 'پرمیوم' : 'رایگان'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">پشتیبانی:</span>
                    <span>{template.isPremium ? '۶ ماه رایگان' : 'ندارد'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">آخرین بروزرسانی:</span>
                    <span>۱۴۰۲/۱۲/۱۵</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {template.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-primary-800/40 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Button
                variant="outline-secondary"
                size="md"
                className="w-full mb-6 border border-primary-700 hover:bg-primary-800/50"
              >
                <FiUsers className="ml-2" />
                مشاهده دیگر کارهای سازنده
              </Button>
            </div>
          </div>
        </div>

        {/* Related Templates */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">قالب‌های مرتبط</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedTemplates.map((template) => (
              <div 
                key={template.id} 
                className="bg-primary-900 rounded-xl overflow-hidden shadow-xl shadow-black/20 transition-all hover:translate-y-[-5px]"
              >
                <Link href={`/template/${template.id}`} className="block">
                  <div className="relative h-48">
                    <img 
                      src={template.thumbnail} 
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                    {template.isPremium && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 rounded-full text-xs font-bold text-amber-950 shadow-lg">
                        پرمیوم
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{template.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{template.creator}</span>
                    <div>
                      {template.isPremium ? (
                        <span className="font-bold text-amber-500">{template.price.toLocaleString()} تومان</span>
                      ) : (
                        <span className="font-bold text-green-500">رایگان</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePage;
