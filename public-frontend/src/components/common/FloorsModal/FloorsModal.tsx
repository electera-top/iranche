'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import Link from 'next/link';

// تعریف تایپ برای طبقات
interface Floor {
  id: number;
  name: string;
  description: string;
  color: string;
  route: string;
  icon?: React.ReactNode;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

interface FloorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// لیست طبقات
const floors: Floor[] = [
  {
    id: 1,
    name: 'طبقه اول - جزایر، مناطق آزاد و فروشگاه های VIP',
    description: 'انواع محصولات برند و خاص ',
    color: 'from-blue-500 to-blue-700',
    route: '/floors/1',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-200',
    borderColor: 'border-blue-200',
    icon: '🏝️'
  },
  {
    id: 5,
    name: 'طبقه پنجم - کالای دیجیتال و موبایل',
    description: 'انواع محصولات دیجیتال، موبایل، لپ تاپ و اکسسوری',
    color: 'from-purple-500 to-purple-700',
    route: '/floors/9',
    textColor: 'text-indigo-600',
    bgColor: 'bg-indigo-200',
    borderColor: 'border-indigo-200',
    icon: '📱'
  },
 
  {
    id: 9,
    name: 'طبقه نهم -  شهربازی و اسباب بازی',
    description: 'دنیای بازی و سرگرمی و انواع بازی های فکری و ...',
    color: 'from-orange-500 to-orange-700',
    route: '/floors/8',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-200',
    borderColor: 'border-orange-200',
    icon: '🎮'
  },
  {
    id: 2,
    name: 'طبقه دوم - مد و پوشاک',
    description: 'انواع پوشاک مردانه، زنانه، کیف، کفش و اکسسوری',
    color: 'from-yellow-500 to-yellow-700',
    route: '/floors/3',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: '👔'
  },
  {
    id: 6,
    name: 'طبقه ششم - محصولات ارگانیک',
    description: 'انواع مواد خوراکی سالم، خوشمزه و طبیعی',
    color: 'from-green-500 to-green-700',
    route: '/floors/2',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
    icon: '🍀'
  }, 
  {
    id: 10,
    name: 'طبقه دهم - کلکسیون آثار هنری',
    description: 'انواع صنایع دستی مانند فرش، تابلو فرش و ...',
    color: 'from-[#422e24] to-[#422e24]',
    route: '/floors/9',
    textColor: 'text-[#422e24]',
    bgColor: 'bg-[#d9bb9c]',
    borderColor: 'border-[#422e24]',
    icon: '🏛️'
  },
  {
    id: 3,
    name: 'طبقه سوم - لوازم آرایشی و زیبایی',
    description: 'انواع لوازم آرایشی ، بهداشتی و مراقبتی پوست و مو',
    color: 'from-pink-500 to-pink-700',
    route: '/floors/5',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-200',
    icon: '💄'
  },
  

  {
    id: 7,
    name: 'طبقه هفتم -  محصولات ورزشی و کمپینگ ',
    description: 'انواع لوازم ورزشی، تجهیزات کوهنوردی و مسافرتی',
    color: 'from-amber-700 to-stone-600',
    route: '/floors/4',
    textColor: 'text-lime-600',
    bgColor: 'bg-lime-100',
    borderColor: 'border-lime-200',
    icon: '⚽'
  },

  {
    id: 11,
    name: 'طبقه یازدهم - تالار هنرمندان',
    description: "دانلود، آپلود موزیک و موزیک ویدئو های شما و هنرمندان مطرح",
    color: 'from-rose-500 to-rose-700',
    route: '/floors/7',
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-200',
    borderColor: 'border-rose-200',
    icon: '🎭'
  },

  {
    id: 4,
    name: 'طبقه چهارم - لوازم خانگی و آشپزخانه',
    description: 'انواع لوازم برقی و وسایل آشپزی تا اجناس دکوری و لوکس',
    color: 'from-cyan-200 to-cyan-300',
    route: '/floors/7',
    textColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    icon: '🍳'
  }, {
    id: 8,
    name: 'طبقه هشتم - کتاب و لوازم التحریر',
    description: 'انواع نوشت افزار، کتاب و ...',
    color: 'from-yellow-600 to-amber-500',
    route: '/floors/6',
    textColor: 'text-sky-600',
    bgColor: 'bg-sky-200',
    borderColor: 'border-sky-200',
    icon: '📚'
  },
  
  {
    id: 12,
    name: 'طبقه دوازدهم - اداری و خدمات',
    description: 'انواع خدمات آموزشی، پزشکی، فرهنگی هنری و ...',
    color: 'from-gray-500 to-gray-700',
    route: '/floors/7',
    textColor: 'text-slate-600',
    bgColor: 'bg-slate-200',
    borderColor: 'border-slate-200',
    icon: '🏢'
  },
];

export default function FloorsModal({ isOpen, onClose }: FloorsModalProps) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* پس‌زمینه تیره */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={onClose}
          >
            {/* مودال */}
            <motion.div
              className="bg-gradient-to-b from-primary-900 to-primary-950 rounded-xl shadow-2xl w-11/12 max-w-7xl max-h-[90vh] overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants}
              onClick={e => e.stopPropagation()}
            >
              {/* هدر مودال */}
              <div className="bg-gradient-to-r from-primary-800 to-primary-700 p-4 flex items-center justify-between sticky top-0 z-10">
                <h2 className="text-xl font-bold text-white">طبقات مجتمع تجاری ایرانچه</h2>
                <motion.button 
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* محتوای مودال */}
              <div className="p-5 overflow-y-auto max-h-[calc(90vh-64px)]">
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {floors.map((floor) => (
                    <motion.div
                      key={floor.id}
                      variants={itemVariants}
                      whileHover="hover"
                      className="group"
                    >
                      <Link href={floor.route}>
                        <div className={`${floor.bgColor} overflow-hidden relative p-3 rounded-xl shadow-md h-full transition-all duration-300 group-hover:shadow-xl border ${floor.borderColor} group-hover:border-current`}>
                          {/* آیکون خیلی بزرگ در پس‌زمینه */}
                         
                          {/* عنوان و شماره طبقه */}
                          <div className="flex mb-3">
                            <div className={`${floor.textColor} font-bold text-2xl ml-2`}>
                              {floor.id}
                            </div>
                            <div className="space-y-1">
                              <div className={`text-xs font-light ${floor.textColor}`}>
                                {floor.name.split(' - ')[0]}
                              </div>
                              <h3 className="text-lg font-bold text-slate-800">{floor.name.split(' - ')[1]}</h3>
                            </div>
                          </div>
                          
                          {/* توضیحات */}
                          <p className="text-slate-600 text-sm relative z-10">{floor.description}</p>
                         
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* دکمه مشاهده همه طبقات */}
                <div className="mt-6 flex justify-end">
                  <Link href="/floors">
                    <motion.button 
                      className="bg-gradient-to-r from-primary-700 to-primary-800 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg border border-primary-600 flex items-center gap-2 transition-all duration-300 group"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="font-bold">مشاهده همه طبقات</span>
                      <span className="text-lg opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">←</span>
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 