'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Store {
  id: number;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

interface StoreCardProps {
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <Link
      href={`/stores/${store.id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-video">
        <Image
          src={store.image}
          alt={store.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{store.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{store.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {store.productCount} محصول
          </span>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-300">
            مشاهده فروشگاه
          </button>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard; 