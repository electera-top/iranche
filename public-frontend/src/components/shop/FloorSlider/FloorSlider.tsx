'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaHistory, FaGem, FaLeaf, FaSeedling, FaIndustry, FaStore, FaUserTie, FaBriefcase } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

interface Floor {
  id: number;
  number: string;
  name: string;
  description: string;
  href: string;
}

const floors: Floor[] = [
  { id: 1, number: '۱', name: 'همکف', description: 'پوشاک و کیف و کفش', href: '/floors/1' },
  { id: 2, number: '۲', name: 'طبقه اول', description: 'خانه و آشپزخانه', href: '/floors/2' },
  { id: 3, number: '۳', name: 'طبقه دوم', description: 'لوازم الکترونیکی', href: '/floors/3' },
  { id: 4, number: '۴', name: 'طبقه سوم', description: 'کودک و نوجوان', href: '/floors/4' },
  { id: 5, number: '۵', name: 'طبقه چهارم', description: 'ورزش و سرگرمی', href: '/floors/5' },
  { id: 6, number: '۶', name: 'طبقه پنجم', description: 'رستوران و کافه', href: '/floors/6' },
  { id: 7, number: '۷', name: 'طبقه ششم', description: 'محصولات ارگانیک و محلی', href: '/floors/7' },
  { id: 8, number: '۸', name: 'طبقه هفتم', description: 'محصولات نایاب و عتیقه', href: '/floors/8' },
  { id: 9, number: '۹', name: 'طبقه هشتم', description: 'تولیدکنندگان و عمده‌فروشان', href: '/floors/9' },
  { id: 10, number: '۱۰', name: 'طبقه نهم', description: 'مشاغل خدماتی', href: '/floors/10' },
];

export default function FloorSlider() {
  return (
    <div className="bg-primary-950 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">طبقات مجتمع</h2>
        <p className="text-sm text-gray-400">انتخاب طبقه مورد نظر</p>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.floor-next',
          prevEl: '.floor-prev',
        }}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
          1280: {
            slidesPerView: 6,
          },
        }}
      >
        {floors.map((floor) => (
          <SwiperSlide key={floor.id}>
            <Link
              href={floor.href}
              className={`group block relative ${
                floor.id === 7
                  ? 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500'
                  : floor.id === 8
                  ? 'bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 hover:from-amber-800 hover:via-yellow-800 hover:to-orange-800'
                  : floor.id === 9
                  ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 hover:from-blue-800 hover:via-indigo-800 hover:to-purple-800'
                  : floor.id === 10
                  ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 hover:from-purple-800 hover:via-indigo-800 hover:to-purple-800'
                  : 'bg-primary-900 hover:bg-primary-800'
              } rounded-xl p-5 text-center transition-all duration-300 hover:shadow-lg overflow-hidden`}
            >
              {floor.id === 7 && (
                <>
                  <div className="absolute inset-0 bg-[url('/images/patterns/leaves.png')] opacity-20"></div>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute top-3 right-3 text-green-300 opacity-80 group-hover:opacity-100 transition-opacity">
                    <FaLeaf className="text-3xl" />
                  </div>
                  <div className="absolute bottom-3 left-3 text-emerald-300 opacity-80 group-hover:opacity-100 transition-opacity">
                    <FaSeedling className="text-3xl" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300"></div>
                </>
              )}
              {floor.id === 8 && (
                <>
                  <div className="absolute inset-0 bg-[url('/images/patterns/antique.png')] opacity-10"></div>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute top-3 right-3 text-amber-300 opacity-80 group-hover:opacity-100 transition-opacity">
                    <FaHistory className="text-3xl" />
                  </div>
                  <div className="absolute bottom-3 left-3 text-yellow-300 opacity-80 group-hover:opacity-100 transition-opacity">
                    <FaGem className="text-3xl" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-yellow-900/20 group-hover:from-amber-800/30 group-hover:to-yellow-800/30 transition-all duration-300"></div>
                </>
              )}
              {floor.id === 9 && (
                <>
                  <div className="absolute inset-0 bg-[url('/images/patterns/industry.jpg')] opacity-10"></div>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute top-3 right-3 text-blue-300 opacity-80 group-hover:opacity-100 transition-opacity">
                    <FaIndustry className="text-3xl" />
                  </div>
                  <div className="absolute bottom-3 left-3 text-indigo-300 opacity-80 group-hover:opacity-100 transition-opacity">
                    <FaStore className="text-3xl" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 group-hover:from-blue-800/30 group-hover:to-indigo-800/30 transition-all duration-300"></div>
                </>
              )}
              {floor.id === 10 && (
                <>
                  <div className="absolute inset-0 bg-[url('/images/patterns/business.jpg')] opacity-10"></div>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute top-3 right-3 text-purple-300 opacity-80 group-hover:opacity-100 transition-opacity">
                    <FaUserTie className="text-3xl" />
                  </div>
                  <div className="absolute bottom-3 left-3 text-indigo-300 opacity-80 group-hover:opacity-100 transition-opacity">
                    <FaBriefcase className="text-3xl" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 group-hover:from-purple-800/30 group-hover:to-indigo-800/30 transition-all duration-300"></div>
                </>
              )}
              <div className="relative">
                <div className={`text-4xl font-black mb-3 ${
                  floor.id === 7 || floor.id === 8 || floor.id === 9 || floor.id === 10 ? 'text-white' : 'text-white'
                }`}>{floor.number}</div>
                <div className={`text-lg font-bold mb-2 ${
                  floor.id === 7 || floor.id === 8 || floor.id === 9 || floor.id === 10 ? 'text-white' : 'text-white'
                }`}>{floor.name}</div>
                <div className={`text-sm ${
                  floor.id === 7 || floor.id === 8 || floor.id === 9 || floor.id === 10 ? 'text-white/90' : 'text-gray-300'
                }`}>{floor.description}</div>
              </div>
            </Link>
          </SwiperSlide>
        ))}

        <button className="floor-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-primary-800 hover:bg-primary-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300">
          <FaChevronLeft className="text-sm" />
        </button>
        <button className="floor-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-primary-800 hover:bg-primary-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300">
          <FaChevronRight className="text-sm" />
        </button>
      </Swiper>
    </div>
  );
} 