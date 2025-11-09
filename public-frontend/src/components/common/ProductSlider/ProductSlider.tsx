'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from '../ProductCard';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface ProductSliderProps {
  products: {
    id: string;
    title: string;
    price: number;
    discountedPrice: number | null;
    image: string;
    rating: number;
    storeId: string;
    storeName: string;
    storeLogo: string;
    storeFloor?: number;
    storeUnit?: string;
    colors?: { name: string; code: string; }[];
    isVIP?: boolean;
    isAds?: boolean;
    hasDiscount?: boolean;
    discountEndsAt?: Date;
    limitedStock?: number;
    category?: string;
    inStock: boolean;
  }[];
  isFeatured?: boolean;
}

export default function ProductSlider({ products, isFeatured }: ProductSliderProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (swiper) {
      swiper.update();
    }
  }, [swiper]);

  return (
    <div className={`relative ${isFeatured ? '' : ''}`}>
      <div className={`${isFeatured ? 'relative px-12' : ''}`}>
        <Swiper
          onSwiper={setSwiper}
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={isFeatured ? 12 : 20}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: isFeatured ? 12 : 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: isFeatured ? 12 : 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: isFeatured ? 12 : 20,
            },
          }}
          loop={true}
          navigation={isFeatured ? {
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          } : false}
          pagination={isFeatured ? {
            clickable: true,
            el: '.product-pagination',
            bulletClass: 'w-2 h-2 inline-block rounded-full bg-secondary-500/30 transition-all duration-300 cursor-pointer',
            bulletActiveClass: 'w-5 bg-secondary-500',
          } : false}
          autoplay={{
            delay: isFeatured ? 4000 : 3000,
            disableOnInteraction: false,
          }}
          className={`${isFeatured ? '!pb-8' : ''}`}
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id}>
              <div className={isFeatured ? 'transform transition-all duration-300 hover:scale-[1.02] p-1 rounded-xl' : ''}>
                {isFeatured && (
                  <div className="absolute top-3 right-3 z-10">
                    {index === 0 && (
                      <div className="bg-secondary-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
                        پیشنهاد ویژه
                      </div>
                    )}
                    {index === 1 && (
                      <div className="bg-primary-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
                        پرفروش
                      </div>
                    )}
                    {product.hasDiscount && (
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-md mt-1">
                        تخفیف ویژه
                      </div>
                    )}
                  </div>
                )}
                <ProductCard {...product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {isFeatured && (
          <>
            {/* Navigation Buttons */}
            <button
              ref={nextRef}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 text-secondary-500 rounded-full shadow-lg transition-all duration-300 border-2 border-secondary-500"
              aria-label="Previous slide"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <button
              ref={prevRef}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 text-secondary-500 rounded-full shadow-lg transition-all duration-300 border-2 border-secondary-500"
              aria-label="Next slide"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination */}
            <div className="product-pagination absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1" />
          </>
        )}
      </div>
    </div>
  );
} 