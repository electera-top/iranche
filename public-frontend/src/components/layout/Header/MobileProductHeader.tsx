import { FiSearch, FiShoppingCart, FiMoreVertical, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const MobileProductHeader = () => {
  const router = useRouter();

  const handleBack = () => {
    // بررسی تاریخچه مرورگر
    if (window.history.length > 1) {
      // اگر تاریخچه وجود دارد، به صفحه قبل برمی‌گردد
      router.back();
    } else {
      // اگر تاریخچه وجود ندارد یا از سایت دیگری آمده، به صفحه اصلی می‌رود
      router.push('/');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-4 z-50 lg:hidden">
      <div className="flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="text-white hover:text-secondary transition-colors flex items-center gap-1"
        >
          <FiArrowRight className="text-lg" />
          <span>برگشت</span>
        </button>
        <div className="flex items-center gap-3">
          <button className="text-white hover:text-secondary transition-colors">
            <FiSearch className="text-xl" />
          </button>
          <button className="text-white hover:text-secondary transition-colors relative">
            <FiShoppingCart className="text-xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
          </button>
          <button className="text-white hover:text-secondary transition-colors">
            <FiMoreVertical className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileProductHeader; 