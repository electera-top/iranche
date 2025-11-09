import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';

interface StoreSummaryProps {
  totalPrice: number;
  shippingCost: number;
}

const StoreSummary: React.FC<StoreSummaryProps> = ({ totalPrice, shippingCost }) => {
  const finalPrice = totalPrice + shippingCost;
  
  return (
    <div className="bg-primary-700/30 backdrop-blur-sm rounded-lg p-4">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-primary-300 text-sm">
          <span>جمع کل محصولات:</span>
          <span>{totalPrice.toLocaleString()} تومان</span>
        </div>
        <div className="flex justify-between text-primary-300 text-sm">
          <span>هزینه ارسال:</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-secondary-400">رایگان</span>
            ) : (
              `${shippingCost.toLocaleString()} تومان`
            )}
          </span>
        </div>
        <div className="pt-2 border-t border-primary-700">
          <div className="flex justify-between font-bold text-white">
            <span>مبلغ قابل پرداخت:</span>
            <span>{finalPrice.toLocaleString()} تومان</span>
          </div>
        </div>
      </div>
   <div className="flex gap-2">
   <button 
        className="w-full py-2 px-4 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 text-slate-900 transition-colors flex items-center justify-center gap-2"
      >
        <FiShoppingBag />
        <span className='font-bold'>پرداخت آسان</span>
      </button>
   

     
      <button 
        className="w-full py-2 px-4 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 text-slate-900 transition-colors flex items-center justify-center gap-2"
      >
        <FiShoppingBag />
        <span className='font-bold'>پرداخت اینترنتی</span>
      </button>
   </div>
   
    </div>
  );
};

export default StoreSummary; 