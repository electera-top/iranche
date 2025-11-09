'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const banners = [
  {
    id: '1',
    image: '/images/banners/header-slider-1.jpg',
    title: 'تخفیف‌های ویژه',
    description: 'تا 50% تخفیف در تمام محصولات',
    link: '/discounts'
  },
  {
    id: '2',
    image: '/images/banners/header-slider-2.jpg',
    title: 'محصولات جدید',
    description: 'جدیدترین محصولات با بهترین قیمت',
    link: '/new-products'
  },
  {
    id: '3',
    image: '/images/banners/header-slider-3.jpg',
    title: 'فروش ویژه',
    description: 'شگفت‌انگیزترین تخفیف‌های سال',
    link: '/special-sales'
  }
];

export default function BannerSlider() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (swiper) {
      if (typeof swiper.params.navigation !== 'boolean') {
        const navigation = swiper.params.navigation;
        if (navigation) {
          navigation.prevEl = prevRef.current;
          navigation.nextEl = nextRef.current;
        }
      }
      swiper.navigation.update();
    }
  }, [swiper]);

  return (
    <div className="relative rounded-xl overflow-hidden">
      <Swiper
        onSwiper={setSwiper}
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{
          clickable: true,
          el: '.banner-pagination',
          bulletClass: 'w-2 h-2 rounded-full bg-primary-900 transition-all duration-300',
          bulletActiveClass: 'w-6 bg-secondary-500',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="h-[400px]"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
              <div className="absolute right-0 bottom-0 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
                <p className="text-lg mb-4">{banner.description}</p>
                <a
                  href={banner.link}
                  className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  مشاهده
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-secondary-500 hover:bg-secondary-600 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        ref={nextRef}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-secondary-500 hover:bg-secondary-600 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Pagination */}
      <div className="banner-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2" />
    </div>
  );
} 