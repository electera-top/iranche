'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMusic, FiVideo, FiImage, FiUsers, FiCalendar, FiMapPin, FiFilter, FiSearch } from 'react-icons/fi';
import Header from '@/components/layout/Header/Header';
import Button from '@/components/ui/button/Button';
import CustomSelect, { SelectOption } from '@/components/ui/select/Select';

// آیتم‌های محتوا
interface ContentItem {
  id: string;
  type: 'video' | 'image' | 'music';
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  category: string;
  region: string;
  date: string;
  views: number;
  likes: number;
}

// دسته‌بندی‌ها و مناطق فرهنگی به فرمت SelectOption
const categoryOptions: SelectOption[] = [
  'همه', 'موسیقی سنتی', 'موسیقی مدرن', 'نقاشی', 'صنایع دستی', 
  'خوشنویسی', 'مینیاتور', 'معماری', 'سینما', 'تئاتر', 'ادبیات'
].map(category => ({
  value: category,
  label: category
}));

const regionOptions: SelectOption[] = [
  'همه', 'تهران', 'اصفهان', 'شیراز', 'تبریز', 'مشهد', 'کرمان', 
  'گیلان', 'مازندران', 'کردستان', 'خوزستان', 'هرمزگان'
].map(region => ({
  value: region,
  label: region
}));

export default function ArtGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [selectedRegion, setSelectedRegion] = useState('همه');
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'music' | 'image'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [featuredArtists, setFeaturedArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // شبیه‌سازی دریافت داده از API
    setTimeout(() => {
      // محتوای نمونه
      const sampleContent: ContentItem[] = [
        {
          id: '1',
          type: 'music',
          title: 'آواز اصفهان',
          artist: 'محمدرضا شجریان',
          thumbnail: '/images/art/music1.jpg',
          url: '/audio/sample1.mp3',
          category: 'موسیقی سنتی',
          region: 'اصفهان',
          date: '1380/04/12',
          views: 14580,
          likes: 3250
        },
        {
          id: '2',
          type: 'video',
          title: 'اجرای زنده کنسرت وصال',
          artist: 'همایون شجریان',
          thumbnail: '/images/art/video1.jpg',
          url: '/videos/sample1.mp4',
          category: 'موسیقی سنتی',
          region: 'تهران',
          date: '1401/08/14',
          views: 25640,
          likes: 4890
        },
        {
          id: '3',
          type: 'image',
          title: 'مینیاتور گل و مرغ',
          artist: 'محمود فرشچیان',
          thumbnail: '/images/art/image1.jpg',
          url: '/images/art/image1_full.jpg',
          category: 'مینیاتور',
          region: 'اصفهان',
          date: '1375/02/15',
          views: 9820,
          likes: 2340
        },
        {
          id: '4',
          type: 'video',
          title: 'آموزش خوشنویسی نستعلیق',
          artist: 'امیرخانی',
          thumbnail: '/images/art/video2.jpg',
          url: '/videos/sample2.mp4',
          category: 'خوشنویسی',
          region: 'تهران',
          date: '1399/11/05',
          views: 12450,
          likes: 1980
        },
      ];

      // هنرمندان برجسته
      const artists = [
        {
          id: '1',
          name: 'محمدرضا شجریان',
          field: 'آواز سنتی',
          image: '/images/artists/shajarian.jpg',
          followers: 45800,
          works: 120
        },
        {
          id: '2',
          name: 'محمود فرشچیان',
          field: 'نقاشی و مینیاتور',
          image: '/images/artists/farshchian.jpg',
          followers: 32600,
          works: 85
        },
        {
          id: '3',
          name: 'حسین علیزاده',
          field: 'موسیقی سنتی',
          image: '/images/artists/alizadeh.jpg',
          followers: 28400,
          works: 95
        },
      ];

      setContent(sampleContent);
      setFeaturedArtists(artists);
      setIsLoading(false);
    }, 1000);
  }, []);

  // فیلتر محتوا
  const filteredContent = content.filter(item => {
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    if (selectedCategory !== 'همه' && item.category !== selectedCategory) return false;
    if (selectedRegion !== 'همه' && item.region !== selectedRegion) return false;
    if (searchTerm && !item.title.includes(searchTerm) && !item.artist.includes(searchTerm)) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      
      {/* بنر اصلی */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src="/images/art/banner.jpg" 
          alt="تالار هنرمندان ایرانی" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">تالار هنرمندان ایرانی</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">گنجینه‌ای از هنر، موسیقی و فرهنگ ایران زمین</p>
          <div className="bg-primary-950/50 backdrop-blur-md p-2 rounded-xl w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در هنر و فرهنگ ایرانی..."
                className="w-full bg-primary-800/50 rounded-lg border border-primary-700 text-white py-2 px-10 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* تب‌های مختلف */}
        <div className="flex overflow-x-auto no-scrollbar mb-6 bg-primary-900/50 p-1 rounded-xl border border-primary-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center px-4 py-2 rounded-lg mr-2 ${
              activeTab === 'all' ? 'bg-secondary text-white' : 'text-gray-300 hover:bg-primary-800/50'
            }`}
          >
            <FiFilter className="ml-2" />
            همه
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
        
        {/* فیلترها */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <CustomSelect
            options={categoryOptions}
            defaultValue={categoryOptions[0]}
            onChange={(option) => setSelectedCategory(option ? option.value.toString() : 'همه')}
            placeholder="انتخاب دسته‌بندی"
            variant="dark"
            fullWidth
          />
          
          <CustomSelect
            options={regionOptions}
            defaultValue={regionOptions[0]}
            onChange={(option) => setSelectedRegion(option ? option.value.toString() : 'همه')}
            placeholder="انتخاب منطقه"
            variant="dark"
            fullWidth
          />
        </div>
        
        {/* محتوای اصلی */}
        <h2 className="text-2xl font-bold mb-6 border-r-4 border-secondary pr-3">گالری هنری</h2>
        
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="bg-primary-900 rounded-xl overflow-hidden shadow-xl hover:translate-y-[-5px] transition-transform duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center">
                    {item.type === 'video' && <FiVideo className="ml-1" />}
                    {item.type === 'music' && <FiMusic className="ml-1" />}
                    {item.type === 'image' && <FiImage className="ml-1" />}
                    {item.type === 'video' ? 'ویدیو' : item.type === 'music' ? 'موسیقی' : 'تصویر'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{item.artist}</p>
                  
                  <div className="flex justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center">
                      <FiMapPin className="ml-1" />
                      {item.region}
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="ml-1" />
                      {item.date}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="bg-primary-800/50 text-xs px-2 py-1 rounded-lg">{item.category}</span>
                    <div className="text-xs">
                      <span className="text-gray-400">{item.views.toLocaleString()} بازدید</span>
                    </div>
                  </div>
                </div>
                <Link href={`/art-gallery/${item.id}`}>
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full rounded-t-none"
                  >
                    {item.type === 'video' ? 'تماشای ویدیو' : 
                     item.type === 'music' ? 'شنیدن موسیقی' : 
                     'مشاهده اثر'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-primary-900/50 rounded-xl p-8 text-center mb-12">
            <p className="text-gray-400">نتیجه‌ای یافت نشد. لطفاً فیلترهای خود را تغییر دهید.</p>
          </div>
        )}
        
        {/* هنرمندان برجسته */}
        <h2 className="text-2xl font-bold mb-6 border-r-4 border-secondary pr-3 flex items-center">
          <FiUsers className="ml-2" />
          هنرمندان برجسته
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredArtists.map((artist) => (
            <div
              key={artist.id}
              className="bg-primary-900 rounded-xl overflow-hidden text-center group hover:bg-primary-800 transition-colors"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{artist.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{artist.field}</p>
                
                <div className="flex justify-between text-sm text-gray-400 mb-4">
                  <div>
                    <span>{artist.followers.toLocaleString()} دنبال‌کننده</span>
                  </div>
                  <div>
                    <span>{artist.works} اثر</span>
                  </div>
                </div>
                
                <Link href={`/artists/${artist.id}`}>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="w-full border border-primary-700 hover:bg-primary-800/70"
                  >
                    مشاهده پروفایل
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}