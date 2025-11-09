import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/products/${product.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 hover:text-primary-600 dark:hover:text-primary-400">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {product.category}
            </p>
          </div>
          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <FiHeart className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {product.price.toLocaleString('fa-IR')} تومان
            </p>
            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">
                ({product.reviews})
              </span>
            </div>
          </div>
          <button className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
            <FiShoppingCart className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            موجود در انبار
          </div>
          <span className="mx-2">•</span>
          <Link
            href={`/sellers/${product.seller.id}`}
            className="flex items-center hover:text-primary-600 dark:hover:text-primary-400"
          >
            <Image
              src={product.seller.avatar}
              alt={product.seller.name}
              width={20}
              height={20}
              className="rounded-full mr-1"
            />
            {product.seller.name}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 