'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import { FaCrown, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const stores = [
  {
    id: '1',
    name: 'فروشگاه بازی‌های موبایل',
    logo: '/images/stores/store-1.jpg',
    floor: 1,
    unit: 'A12',
    isVIP: true
  },
  {
    id: '2',
    name: 'فروشگاه کتاب',
    logo: '/images/stores/store-2.jpg',
    floor: 2,
    unit: 'B5',
    isVIP: false
  },
  {
    id: '3',
    name: 'فروشگاه اسباب‌بازی',
    logo: '/images/stores/store-3.jpg',
    floor: 1,
    unit: 'C8',
    isVIP: true
  },
  {
    id: '4',
    name: 'فروشگاه الکترونیک',
    logo: '/images/stores/store-4.jpg',
    floor: 3,
    unit: 'D3',
    isVIP: false
  },
  {
    id: '5',
    name: 'فروشگاه پوشاک',
    logo: '/images/stores/store-5.jpg',
    floor: 2,
    unit: 'E7',
    isVIP: true
  },
  {
    id: '6',
    name: 'فروشگاه لوازم خانگی',
    logo: '/images/stores/store-6.jpg',
    floor: 3,
    unit: 'F2',
    isVIP: false
  },
  {
    id: '7',
    name: 'فروشگاه زیورآلات',
    logo: '/images/stores/store-7.jpg',
    floor: 1,
    unit: 'G9',
    isVIP: true
  },
  {
    id: '8',
    name: 'فروشگاه ورزشی',
    logo: '/images/stores/store-8.jpg',
    floor: 2,
    unit: 'H4',
    isVIP: false
  },
  {
    id: '9',
    name: 'فروشگاه موسیقی',
    logo: '/images/stores/store-1.jpg',
    floor: 3,
    unit: 'I6',
    isVIP: true
  },
  {
    id: '10',
    name: 'فروشگاه لوازم هنری',
    logo: '/images/stores/store-2.jpg',
    floor: 1,
    unit: 'J1',
    isVIP: false
  },
  {
    id: '11',
    name: 'فروشگاه کافی‌شاپ',
    logo: '/images/stores/store-3.jpg',
    floor: 2,
    unit: 'K8',
    isVIP: true
  },
  {
    id: '12',
    name: 'فروشگاه عطر',
    logo: '/images/stores/store-4.jpg',
    floor: 3,
    unit: 'L5',
    isVIP: false
  },
  {
    id: '13',
    name: 'فروشگاه ساعت',
    logo: '/images/stores/store-5.jpg',
    floor: 1,
    unit: 'M3',
    isVIP: true
  },
  {
    id: '14',
    name: 'فروشگاه عینک',
    logo: '/images/stores/store-6.jpg',
    floor: 2,
    unit: 'N7',
    isVIP: false
  },
  {
    id: '15',
    name: 'فروشگاه کیف و کفش',
    logo: '/images/stores/store-7.jpg',
    floor: 3,
    unit: 'O2',
    isVIP: true
  },
  {
    id: '16',
    name: 'فروشگاه لوازم آرایشی',
    logo: '/images/stores/store-8.jpg',
    floor: 1,
    unit: 'P9',
    isVIP: false
  }
];

export default function StoreSlider() {
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
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">فروشگاه‌های برتر</h2>
      <div className="relative px-2 py-3">
        <Swiper
          onSwiper={setSwiper}
          modules={[Autoplay, Navigation]}
          spaceBetween={12}
          slidesPerView={8}
          loop={true}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 8,
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 8,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 12,
            },
            1280: {
              slidesPerView: 8,
              spaceBetween: 12,
            },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        >
          {stores.map((store) => (
            <SwiperSlide key={store.id}>
              <div className="p-2">
                <div className="flex flex-col items-center p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors relative">
                  {store.isVIP && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-1 rounded-full">
                      <FaCrown className="w-4 h-4" />
                    </div>
                  )}
                  <div className="relative w-16 h-16 mb-2">
                    <Image
                      src={store.logo}
                      alt={store.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-center w-full truncate" title={store.name}>{store.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    طبقه {store.floor} - واحد {store.unit}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Navigation Buttons */}
        <button
          ref={prevRef}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-gray-800/80 hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          ref={nextRef}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-gray-800/80 hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <FaChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
} 