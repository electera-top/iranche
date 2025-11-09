'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: number;
  store: {
    name: string;
    image: string;
  };
}

interface ProductSliderProps {
  products: Product[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.product-next',
          prevEl: '.product-prev',
        }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <Link
              href={`/products/${product.id}`}
              className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <div className="text-lg font-bold text-primary-600">
                    {product.price.toLocaleString()} تومان
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={product.store.image}
                      alt={product.store.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-600">{product.store.name}</span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}

        <button className="product-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-600 shadow-lg transition-all duration-300">
          <FaChevronLeft className="text-sm" />
        </button>
        <button className="product-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-600 shadow-lg transition-all duration-300">
          <FaChevronRight className="text-sm" />
        </button>
      </Swiper>
    </div>
  );
} 