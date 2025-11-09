import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';

const EmptyCart: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="bg-primary-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiShoppingCart className="text-primary-400 text-4xl" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">سبد خرید شما خالی است</h3>
      <p className="text-primary-400 mb-6 max-w-md mx-auto">
        شما هنوز محصولی به سبد خرید خود اضافه نکرده‌اید. برای مشاهده محصولات به صفحه فروشگاه مراجعه کنید.
      </p>
      <Link 
        href="/explore"
        className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors inline-block"
      >
        مشاهده محصولات
      </Link>
    </div>
  );
};

export default EmptyCart; 