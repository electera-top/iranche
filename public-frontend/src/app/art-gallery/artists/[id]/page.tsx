'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMusic, FiVideo, FiImage, FiCalendar, FiMapPin, FiHeart, FiEye, FiMessageSquare, FiShare2, FiStar, FiUser, FiGrid, FiFilter } from 'react-icons/fi';
import Header from '@/components/layout/Header/Header';
import Button from '@/components/ui/button/Button';

// آثار هنرمند
interface ArtistWork {
  id: string;
  type: 'video' | 'image' | 'music';
  title: string;
  thumbnail: string;
  url: string;
  category: string;
  date: string;
  views: number;
  likes: number;
}

// اطلاعات هنرمند
interface Artist {
  id: string;
  name: string;
  field: string;
  image: string;
  coverImage: string;
  biography: string;
  followers: number;
  works: number;
  rating: number;
  location: string;
  birthYear: string;
  socialLinks: {
    instagram?: string;
    website?: string;
    telegram?: string;
  };
  achievements: string[];
}

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [works, setWorks] = useState<ArtistWork[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'music' | 'image'>('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // شبیه‌سازی دریافت داده از API
    setTimeout(() => {
      // اطلاعات هنرمند
      const artistData: Artist = {
        id: params.id,
        name: 'محمدرضا شجریان',
        field: 'آواز سنتی ایرانی',
        image: '/images/artists/shajarian.jpg',
        coverImage: '/images/artists/shajarian-cover.jpg',
        biography: 'محمدرضا شجریان (زاده ۱ مهر ۱۳۱۹ در مشهد – درگذشته ۱۷ مهر ۱۳۹۹ در تهران) خواننده، آهنگساز و موسیقی‌دان چیره‌دست ایرانی بود. او از استادان مسلم آواز ایرانی در دوران معاصر است و بسیاری او را بهترین خواننده تاریخ موسیقی ایران می‌دانند. شجریان در عرضه فرهنگ و هنر ایرانی و سنتی معاصر، با اجرای آثار و برنامه‌هایی از جمله «چاووش»، کنسرت‌های متعدد، بازخوانی مشهورترین تصنیف‌ها، مناجات‌خوانی‌ها و نوآوری‌هایی مانند ساخت سازهای نوینی چون «صراحی» و «شاه‌کمان»، سهم بزرگی داشت. محمدرضا شجریان با همراهی همکارانش از جمله پرویز مشکاتیان، محمدرضا لطفی، حسین علیزاده، کیهان کلهر و دیگر موسیقی‌دانان نوگرا، دوره‌ای پویا و ماندگار را در موسیقی سنتی ایرانی پدید آورد.',
        followers: 145800,
        works: 156,
        rating: 4.9,
        location: 'تهران، ایران',
        birthYear: '1319',
        socialLinks: {
          instagram: 'https://instagram.com/shajarian',
          website: 'https://shajarian.org',
          telegram: 'https://t.me/shajarian'
        },
        achievements: [
          'نشان شوالیه ادب و هنر فرانسه (سال ۱۳۹۲)',
          'جایزه موسیقی آقاخان (سال ۱۳۷۷)',
          'مدال پیکاسو از یونسکو (سال ۱۳۷۷)',
          'پیشنهاد نامزدی جایزه نوبل صلح (سال ۱۳۹۰)',
          'بنیان‌گذاری گروه چاووش',
          'ثبت آواز ایرانی به عنوان میراث معنوی بشر'
        ]
      };

      // آثار هنرمند
      const artistWorks: ArtistWork[] = [
        {
          id: '1',
          type: 'music',
          title: 'ربنا',
          thumbnail: '/images/art/music1.jpg',
          url: '/audio/sample1.mp3',
          category: 'موسیقی سنتی',
          date: '1360/02/15',
          views: 254000,
          likes: 52300
        },
        {
          id: '2',
          type: 'music',
          title: 'بیداد',
          thumbnail: '/images/art/music2.jpg',
          url: '/audio/sample2.mp3',
          category: 'موسیقی سنتی',
          date: '1364/08/20',
          views: 185000,
          likes: 42600
        },
        {
          id: '3',
          type: 'music',
          title: 'جان جهان',
          thumbnail: '/images/art/music3.jpg',
          url: '/audio/sample3.mp3',
          category: 'موسیقی سنتی',
          date: '1368/04/12',
          views: 162000,
          likes: 38400
        },
        {
          id: '4',
          type: 'video',
          title: 'کنسرت فرانسه',
          thumbnail: '/images/art/video1.jpg',
          url: '/videos/sample1.mp4',
          category: 'کنسرت',
          date: '1370/09/25',
          views: 125000,
          likes: 28600
        },
        {
          id: '5',
          type: 'video',
          title: 'کنسرت برلین',
          thumbnail: '/images/art/video2.jpg',
          url: '/videos/sample2.mp4',
          category: 'کنسرت',
          date: '1372/06/18',
          views: 98000,
          likes: 21400
        },
        {
          id: '6',
          type: 'image',
          title: 'عکس‌های کمتر دیده شده',
          thumbnail: '/images/art/image1.jpg',
          url: '/images/art/image1_full.jpg',
          category: 'عکس',
          date: '1385/11/05',
          views: 75000,
          likes: 16800
        }
      ];

      setArtist(artistData);
      setWorks(artistWorks);
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  // فیلتر آثار بر اساس تب فعال
  const filteredWorks = works.filter(work => {
    if (activeTab === 'all') return true;
    return work.type === activeTab;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <h1 className="text-3xl font-bold text-white mb-4">هنرمند مورد نظر یافت نشد</h1>
        <Link href="/art-gallery">
          <Button variant="secondary" size="lg">بازگشت به گالری هنری</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      
      {/* کاور پروفایل */}
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src={artist.coverImage} 
          alt={artist.name} 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 right-0 z-20 p-4 md:p-8 w-full">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <div className="relative">
              <img 
                src={artist.image} 
                alt={artist.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-secondary object-cover shadow-xl"
              />
              <div className="absolute bottom-0 right-0 bg-secondary rounded-full p-1 shadow-lg">
                <FiStar className="text-white" size={16} />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold">{artist.name}</h1>
              <p className="text-gray-300 mt-1">{artist.field}</p>
              
              <div className="flex flex-wrap gap-3 mt-3">
                <div className="flex items-center text-sm bg-black/30 px-3 py-1 rounded-full">
                  <FiUser className="ml-1" />
                  {artist.followers.toLocaleString()} دنبال‌کننده
                </div>
                <div className="flex items-center text-sm bg-black/30 px-3 py-1 rounded-full">
                  <FiGrid className="ml-1" />
                  {artist.works} اثر
                </div>
                <div className="flex items-center text-sm bg-black/30 px-3 py-1 rounded-full">
                  <FiMapPin className="ml-1" />
                  {artist.location}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={isFollowing ? "outline-secondary" : "secondary"}
                size="md" 
                className={isFollowing ? "border-secondary text-secondary" : ""}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? 'دنبال شده' : 'دنبال کردن'}
              </Button>
              <Button 
                variant="outline-secondary" 
                size="md"
                className="border-white/20 text-white"
              >
                <FiShare2 />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* اطلاعات شخصی هنرمند */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-primary-900 rounded-xl overflow-hidden shadow-xl sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 border-r-4 border-secondary pr-3">درباره هنرمند</h2>
                <div className="text-gray-300 text-justify leading-7 mb-6">
                  {artist.biography}
                </div>
                
                <div className="border-t border-primary-800 pt-4 mb-6">
                  <h3 className="font-bold mb-3">اطلاعات تکمیلی</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-400">سال تولد:</span>
                      <span>{artist.birthYear}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">محل فعالیت:</span>
                      <span>{artist.location}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">امتیاز هنرمند:</span>
                      <div className="flex items-center">
                        <FiStar className="text-yellow-500 fill-current ml-1" />
                        <span>{artist.rating}</span>
                      </div>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">آثار:</span>
                      <span>{artist.works} اثر</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border-t border-primary-800 pt-4 mb-6">
                  <h3 className="font-bold mb-3">افتخارات</h3>
                  <ul className="space-y-2 text-sm">
                    {artist.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <FiStar className="text-secondary ml-2" />
                        </div>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-primary-800 pt-4">
                  <h3 className="font-bold mb-3">شبکه‌های اجتماعی</h3>
                  <div className="flex gap-2">
                    {artist.socialLinks.instagram && (
                      <a 
                        href={artist.socialLinks.instagram} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-primary-800 hover:bg-primary-700 p-3 rounded-lg text-secondary transition-colors"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    )}
                    
                    {artist.socialLinks.telegram && (
                      <a 
                        href={artist.socialLinks.telegram} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-primary-800 hover:bg-primary-700 p-3 rounded-lg text-secondary transition-colors"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                      </a>
                    )}
                    
                    {artist.socialLinks.website && (
                      <a 
                        href={artist.socialLinks.website} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-primary-800 hover:bg-primary-700 p-3 rounded-lg text-secondary transition-colors"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* آثار هنرمند */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* تب‌های فیلتر */}
            <div className="flex overflow-x-auto no-scrollbar mb-6 bg-primary-900/50 p-1 rounded-xl border border-primary-800">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center px-4 py-2 rounded-lg mr-2 ${
                  activeTab === 'all' ? 'bg-secondary text-white' : 'text-gray-300 hover:bg-primary-800/50'
                }`}
              >
                <FiFilter className="ml-2" />
                همه آثار
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center px-4 py-2 rounded-lg mr-2 ${
                  activeTab === 'video' ? 'bg-secondary text-white' : 'text-gray-300 hover:bg-primary-800/50'
                }`}
              >
                <FiVideo className="ml-2" />
                ویدیو
              </button>
              <button
                onClick={() => setActiveTab('music')}
                className={`flex items-center px-4 py-2 rounded-lg mr-2 ${
                  activeTab === 'music' ? 'bg-secondary text-white' : 'text-gray-300 hover:bg-primary-800/50'
                }`}
              >
                <FiMusic className="ml-2" />
                موسیقی
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={`flex items-center px-4 py-2 rounded-lg mr-2 ${
                  activeTab === 'image' ? 'bg-secondary text-white' : 'text-gray-300 hover:bg-primary-800/50'
                }`}
              >
                <FiImage className="ml-2" />
                تصاویر
              </button>
            </div>
            
            {/* گرید آثار */}
            {filteredWorks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredWorks.map((work) => (
                  <div
                    key={work.id}
                    className="bg-primary-900 rounded-xl overflow-hidden shadow-xl hover:translate-y-[-5px] transition-transform duration-300"
                  >
                    <div className="relative h-48">
                      <img
                        src={work.thumbnail}
                        alt={work.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center">
                        {work.type === 'video' && <FiVideo className="ml-1" />}
                        {work.type === 'music' && <FiMusic className="ml-1" />}
                        {work.type === 'image' && <FiImage className="ml-1" />}
                        {work.type === 'video' ? 'ویدیو' : work.type === 'music' ? 'موسیقی' : 'تصویر'}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{work.title}</h3>
                      
                      <div className="flex justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center">
                          <FiCalendar className="ml-1" />
                          {work.date}
                        </div>
                        <div className="flex items-center">
                          <span className="bg-primary-800/50 text-xs px-2 py-1 rounded-lg">{work.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <FiEye className="ml-1 text-gray-400" />
                          <span className="text-gray-400">{work.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <FiHeart className="ml-1 text-red-500" />
                          <span className="text-gray-400">{work.likes.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/art-gallery/${work.id}`}>
                      <Button
                        variant="secondary"
                        size="md"
                        className="w-full rounded-t-none"
                      >
                        {work.type === 'video' ? 'تماشای ویدیو' : 
                         work.type === 'music' ? 'شنیدن موسیقی' : 
                         'مشاهده اثر'}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-primary-900/50 rounded-xl p-8 text-center">
                <p className="text-gray-400">هیچ اثری در این دسته یافت نشد.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}