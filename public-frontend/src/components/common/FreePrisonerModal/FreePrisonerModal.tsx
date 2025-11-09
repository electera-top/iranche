'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { FaDove } from 'react-icons/fa';
import Image from 'next/image';

interface FreePrisonerModalProps {
  onClose: () => void;
}

export default function FreePrisonerModal({ onClose }: FreePrisonerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [heartBeating, setHeartBeating] = useState(false);

  useEffect(() => {
    // مودال پس از بارگذاری صفحه به تاخیر باز می‌شود
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    // افکت ضربان قلب
    const heartbeatInterval = setInterval(() => {
      setHeartBeating(prev => !prev);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(heartbeatInterval);
    };
  }, []);

  // انیمیشن‌ها
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300 
      } 
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // کمی تاخیر قبل از فراخوانی تابع onClose برای اتمام انیمیشن
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* پس‌زمینه تیره */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={handleClose}
          >
            {/* مودال */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl shadow-2xl w-11/12 max-w-2xl overflow-hidden border border-sky-100"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants}
              onClick={e => e.stopPropagation()}
            >
              {/* هدر مودال */}
              <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center">
                  <motion.div 
                    className="bg-white/30 p-2 rounded-full mr-3 flex items-center justify-center"
                    animate={{ 
                      scale: heartBeating ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <FaDove className="w-5 h-5 text-white" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-white">آزادی با هر خرید</h2>
                </div>
                <motion.button 
                  onClick={handleClose}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* محتوای مودال */}
              <div className="p-5 relative overflow-hidden">
                {/* نمادهای آزادی در پس‌زمینه */}
                <motion.div 
                  className="absolute -left-10 top-0 text-sky-100"
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut"
                  }}
                >
                  <FaDove className="w-32 h-32" />
                </motion.div>
                
                <motion.div 
                  className="absolute -right-10 bottom-0 text-sky-100"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut"
                  }}
                >
                  <FaDove className="w-28 h-28 transform -scale-x-100" />
                </motion.div>

                <div className="flex flex-col items-center relative z-10">
                  {/* تصویر در بالا */}
                  <motion.div
                    className="relative h-56 w-full rounded-xl overflow-hidden shadow-lg border-4 border-white mb-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <Image
                      src="/images/prison.jpg"
                      alt="آزادی زندانیان"
                      layout="fill"
                      objectFit="cover"
                    />
                  </motion.div>

                  {/* محتوای متنی */}
                  <div className="w-full text-center">
                    <motion.h3
                      className="text-2xl font-bold text-blue-700 mb-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      با خرید خود، <span className="text-blue-500">آزادی</span> هدیه کنید
                    </motion.h3>

                    <motion.p
                      className="text-gray-700 mb-3 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      با هر خرید از ایرانچه، <span className="font-semibold text-blue-600">۵٪ از سود</span> به آزادی زندانیان جرائم غیرعمد اختصاص می‌یابد.
                    </motion.p>

                    {/* دکمه */}
                    <motion.div
                      className="mt-4 flex justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      <motion.button
                        className="bg-gradient-to-r from-blue-600 to-sky-500 text-white py-3 px-10 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClose}
                      >
                        با خرید خود به آزادی کمک می‌کنم
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 