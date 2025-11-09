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
    <Link href={`/floors/9/stores/${store.id}`}>
      <div className="group relative bg-blue-900/40 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-blue-800/30 hover:border-blue-700/50 transition-all duration-300 hover:scale-105 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 group-hover:from-blue-800/30 group-hover:to-indigo-800/30 transition-all duration-300"></div>
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-indigo-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

        {/* Content */}
        <div className="relative">
          {/* Store Image */}
          <div className="relative w-full h-32 mb-3 rounded-xl overflow-hidden">
            <Image
              src={store.image}
              alt={store.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
          </div>

          {/* Store Info */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              {store.name}
            </h3>
            <p className="text-blue-200 text-xs line-clamp-2">
              {store.description}
            </p>
            <div className="flex items-center gap-2 text-blue-300 text-xs">
              <span className="font-medium">{store.productCount}</span>
              <span>محصول</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard; 