import React, { useEffect } from 'react';
import { FiStar, FiDownload, FiHeart, FiShoppingCart, FiClock, FiEye } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';
import { Template } from './TemplateBox';
import { motion } from 'framer-motion';

interface TemplatePreviewModalProps {
  template: Template;
  onClose: () => void;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ template, onClose }) => {
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 sm:p-4 backdrop-blur-sm" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="w-full h-full sm:h-auto sm:max-h-[90vh] max-w-full sm:max-w-5xl bg-gradient-to-br from-primary-900 to-primary-950 sm:rounded-xl flex flex-col overflow-hidden shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          delay: 0.1
        }}
      >
        {/* Fixed header section */}
        <div className="relative h-56 sm:h-96 shrink-0 overflow-hidden">
          <motion.div className="flex items-center justify-center h-full p-6 relative z-0">
            <motion.img 
              src={template.thumbnail || '/templates/placeholder.jpg'} 
              alt={template.title}
              className="w-full h-full object-contain rounded-xl shadow-2xl shadow-black/20"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-950 flex items-end">
            <div className="p-4 sm:p-6">
              <motion.div 
                className="flex items-center mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <img 
                  src={template.creator.avatar || '/avatars/default.jpg'}
                  alt={template.creator.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white mr-3"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{template.title}</h2>
                  <div className="text-xs sm:text-sm text-gray-300 flex items-center">
                    توسط {template.creator.name} 
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <FiStar className="text-yellow-500 ml-1" size={14} />
                      {template.rating}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.button 
            className="absolute top-4 right-4 bg-primary-950/70 text-white p-2 rounded-full hover:bg-primary-800 transition-colors"
            onClick={onClose}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
        
        {/* Scrollable content */}
        <motion.div 
          className="flex-1 overflow-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-bold text-white mb-2">توضیحات</h3>
                <p className="text-gray-400 mb-4">{template.description}</p>
                
                <h3 className="text-lg font-bold text-white mb-2">ویژگی‌ها</h3>
                <ul className="list-disc list-inside text-gray-400 mb-4 space-y-1">
                  <li>طراحی واکنش‌گرا و سازگار با موبایل</li>
                  <li>استفاده از جدیدترین تکنولوژی‌های وب</li>
                  <li>سرعت بارگذاری بالا</li>
                  <li>سازگاری با تمامی مرورگرها</li>
                  <li>بهینه‌سازی شده برای موتورهای جستجو</li>
                </ul>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {template.tags.map((tag, idx) => (
                    <motion.span 
                      key={idx} 
                      className={`text-xs px-3 py-1.5 rounded-md ${
                        idx % 4 === 0 ? 'bg-blue-900/40 text-blue-300' : 
                        idx % 4 === 1 ? 'bg-purple-900/40 text-purple-300' : 
                        idx % 4 === 2 ? 'bg-teal-900/40 text-teal-300' :
                        'bg-rose-900/40 text-rose-300'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + (idx * 0.05) }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
              
              <motion.div 
                className="bg-primary-800/50 rounded-xl p-4 border border-primary-700/30 w-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <FiShoppingCart className="ml-2" />
                  خرید قالب
                </h3>
                
                <div className="mb-4">
                  {template.isPremium ? (
                    <motion.div 
                      className="text-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      {template.price.toLocaleString()} تومان
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-2xl font-bold text-white bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      رایگان
                    </motion.div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center text-gray-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <FiDownload className="ml-2 text-secondary" />
                    <span>{template.downloads.toLocaleString()} دانلود</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center text-gray-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <FiClock className="ml-2 text-secondary" />
                    <span>تاریخ انتشار: {template.createdAt}</span>
                  </motion.div>
                </div>
                
                <div className="mt-6 space-y-3 md:block hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <Button
                      variant="secondary"
                      className={`w-full flex items-center justify-center ${
                        template.isPremium 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 border-none hover:from-amber-600 hover:to-amber-700' 
                          : 'bg-gradient-to-r from-green-500 to-green-600 text-green-950 border-none hover:from-green-600 hover:to-green-700'
                      }`}
                    >
                      {template.isPremium ? (
                        <>
                          <FiShoppingCart className="ml-2" /> خرید و دانلود
                        </>
                      ) : (
                        <>
                          <FiDownload className="ml-2" /> مشاهده و نصب
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    <Button
                      variant="outline-secondary"
                      className="w-full flex items-center justify-center border border-primary-700/50 text-white hover:bg-primary-800/50"
                    >
                      <FiHeart className="ml-2" /> افزودن به علاقه‌مندی‌ها
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            {/* Add padding at the bottom on mobile for the fixed buttons */}
            <div className="pb-24 md:pb-0"></div>
          </div>
        </motion.div>

        {/* Fixed action buttons for mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary-950 via-primary-950/95 to-primary-950/90 border-t border-primary-800/50 backdrop-blur-md z-10 shadow-lg shadow-black/30">
          <div className="flex gap-3 max-w-[100vw]">
            <Button
              variant="outline-secondary"
              className="inline-flex items-center justify-center border border-primary-700/50 text-white hover:bg-primary-800/50 p-2 aspect-square"
              onClick={() => window.open(template.thumbnail || '/templates/placeholder.jpg', '_blank')}
            >
              <FiEye size={18} />
            </Button>
            
            <Button
              variant="outline-secondary"
              className="flex-1 flex items-center justify-center border border-primary-700/50 text-white hover:bg-primary-800/50"
            >
              <FiHeart className="ml-2" /> افزودن
            </Button>
            
            <Button
              variant="secondary"
              className={`flex-1 flex items-center justify-center ${
                template.isPremium 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 border-none hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-600/10' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-green-950 border-none hover:from-green-600 hover:to-green-700 shadow-md shadow-green-600/10'
              }`}
            >
              {template.isPremium ? (
                <>
                  <FiShoppingCart className="ml-2" /> خرید
                </>
              ) : (
                <>
                  <FiDownload className="ml-2" /> مشاهده و نصب
                </>
              )}
            </Button>
          </div>
        </div>
        
      </motion.div>
      
      <style jsx global>{`
        select option {
          background-color: #0f172a; /* primary-900 */
          color: white;
        }
      `}</style>
    </motion.div>
  );
};

export default TemplatePreviewModal; 