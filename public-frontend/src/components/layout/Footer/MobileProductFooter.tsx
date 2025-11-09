import { FiShoppingCart } from 'react-icons/fi';

interface MobileProductFooterProps {
  originalPrice: number;
  price: number;
  discount: number;
}

const MobileProductFooter = ({ originalPrice, price, discount }: MobileProductFooterProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 p-4 lg:hidden">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 line-through text-sm">{originalPrice.toLocaleString()} تومان</span>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{discount}٪ تخفیف</span>
          </div>
          <span className="text-xl font-bold text-secondary">{price.toLocaleString()} تومان</span>
        </div>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
          <FiShoppingCart className="text-lg" />
          <span>خرید</span>
        </button>
      </div>
    </div>
  );
};

export default MobileProductFooter; 