'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheck, FiShoppingBag, FiUsers, FiBarChart2, FiGlobe, FiCreditCard, FiTruck, FiStar, FiAward, FiTrendingUp, FiPlay, FiChevronRight, FiArrowLeft } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';
import Logo from '@/components/common/logo/Logo';

export default function CreateStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleCreateStore = () => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      router.push('/store/pricing');
    }, 1000);
  };

  const features = [
    {
      icon: <FiShoppingBag className="w-6 h-6" />,
      title: 'مدیریت محصولات',
      description: 'افزودن، ویرایش و مدیریت محصولات فروشگاه به راحتی'
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: 'مدیریت مشتریان',
      description: 'دسترسی به اطلاعات مشتریان و تاریخچه خرید آنها'
    },
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: 'گزارشات و آمار',
      description: 'داشبورد تحلیلی با نمودارها و گزارشات پیشرفته'
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: 'دامنه اختصاصی',
      description: 'امکان استفاده از دامنه اختصاصی برای فروشگاه شما'
    },
    {
      icon: <FiCreditCard className="w-6 h-6" />,
      title: 'درگاه پرداخت',
      description: 'پشتیبانی از درگاه‌های پرداخت معتبر برای دریافت پرداخت'
    },
    {
      icon: <FiTruck className="w-6 h-6" />,
      title: 'مدیریت سفارشات',
      description: 'سیستم مدیریت سفارشات با امکان پیگیری وضعیت'
    }
  ];

  const stats = [
    { icon: <FiUsers />, value: '1M+', label: 'کاربر فعال' },
    { icon: <FiShoppingBag />, value: '50K+', label: 'فروشگاه' },
    { icon: <FiTrendingUp />, value: '10M+', label: 'سفارش موفق' },
    { icon: <FiStar />, value: '4.8', label: 'امتیاز کاربران' }
  ];

  const steps = [
    {
      number: '1',
      title: 'ثبت‌نام و احراز هویت',
      description: 'ثبت‌نام در پلتفرم و تکمیل مدارک مورد نیاز'
    },
    {
      number: '2',
      title: 'طراحی فروشگاه',
      description: 'انتخاب قالب و شخصی‌سازی ظاهر فروشگاه'
    },
    {
      number: '3',
      title: 'افزودن محصولات',
      description: 'ثبت محصولات و تنظیم قیمت‌ها و موجودی'
    },
    {
      number: '4',
      title: 'شروع فروش',
      description: 'فعال‌سازی فروشگاه و شروع به فروش'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center p-4">
      {/* Hero Section with Video */}
      <div className="w-full max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 items-center mb-16">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2 flex flex-col items-center lg:items-start"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start mb-8"
            >
              <Logo />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-center lg:text-right mb-6 relative"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
               شعبه مجازی فروشگاه خود را ثبت کنید!
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-300 text-center lg:text-right text-lg mb-8 relative"
            >
              با ساخت فروشگاه در مجتمع تجاری ایرانچه، به میلیون‌ها مشتری بالقوه دسترسی پیدا کنید
            </motion.p>
            
            
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-full lg:w-auto"
            >
              <Button
                type="button"
                variant="primary"
                size="lg"
                className={`w-full md:w-auto text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={loading ? undefined : handleCreateStore}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white ml-2"></div>
                    <span>در حال انتقال...</span>
                  </div>
                ) : (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>ساخت فروشگاه</span>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Right Video */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="aspect-video w-full rounded-lg overflow-hidden relative group cursor-pointer shadow-2xl shadow-amber-500/20"
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative">
                {!isVideoPlaying ? (
                  <motion.div 
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
                      <FiPlay className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>
                ) : null}
                <div className="text-center">
                  <FiGlobe className="w-20 h-20 text-amber-500/70 mx-auto mb-4" />
                  <p className="text-gray-300">ویدئو معرفی فروشگاه‌های مجتمع تجاری ایرانچه</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
              امکانات فروشگاه شما
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.02, y: -5 }}
                onHoverStart={() => setActiveFeature(index)}
                onHoverEnd={() => setActiveFeature(null)}
                className="bg-black/40 rounded-lg p-6 border border-amber-500/20 hover:border-amber-500/50 transition-all backdrop-blur-sm relative overflow-hidden"
              >
                <AnimatePresence>
                  {activeFeature === index && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-300"
                    />
                  )}
                </AnimatePresence>
                <div className="text-amber-400 mb-4 relative">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative">
                  {feature.title}
                </h3>
                <p className="text-gray-300 relative">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Benefits Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-8 mb-16 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center justify-center relative">
            <FiAward className="text-amber-400 ml-2" />
            مزایای فروشگاه در مجتمع تجاری ایرانچه
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-4 relative">
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex items-start"
              >
                <FiCheck className="text-amber-400 mt-1 ml-2 flex-shrink-0" />
                <span className="text-gray-300">دسترسی به میلیون‌ها کاربر فعال در پلتفرم ایرانچه</span>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="flex items-start"
              >
                <FiCheck className="text-amber-400 mt-1 ml-2 flex-shrink-0" />
                <span className="text-gray-300">سیستم مدیریت فروشگاه پیشرفته و کاربرپسند</span>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="flex items-start"
              >
                <FiCheck className="text-amber-400 mt-1 ml-2 flex-shrink-0" />
                <span className="text-gray-300">پشتیبانی از درگاه‌های پرداخت معتبر</span>
              </motion.li>
            </ul>
            
            <ul className="space-y-4 relative">
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="flex items-start"
              >
                <FiCheck className="text-amber-400 mt-1 ml-2 flex-shrink-0" />
                <span className="text-gray-300">امکان شخصی‌سازی ظاهر فروشگاه با قالب‌های متنوع</span>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="flex items-start"
              >
                <FiCheck className="text-amber-400 mt-1 ml-2 flex-shrink-0" />
                <span className="text-gray-300">گزارشات تحلیلی پیشرفته برای بهبود فروش</span>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="flex items-start"
              >
                <FiCheck className="text-amber-400 mt-1 ml-2 flex-shrink-0" />
                <span className="text-gray-300">پشتیبانی 24/7 از تیم متخصص ایرانچه</span>
              </motion.li>
            </ul>
          </div>
        </motion.div>
        
        {/* Steps Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
              مراحل راه‌اندازی فروشگاه
            </span>
          </h2>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/20 via-amber-500/50 to-amber-500/20 hidden lg:block"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onHoverStart={() => setActiveStep(index)}
                  onHoverEnd={() => setActiveStep(null)}
                  className="bg-black/40 rounded-lg p-6 border border-amber-500/20 relative backdrop-blur-sm relative z-10"
                >
                  <AnimatePresence>
                    {activeStep === index && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-300 rounded-lg"
                      />
                    )}
                  </AnimatePresence>
                  
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/30">
                    {step.number}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 mt-4">{step.title}</h3>
                  <p className="text-gray-300 mb-4">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <FiChevronRight className="w-6 h-6 text-amber-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="bg-gradient-to-r from-amber-500/10 to-amber-300/10 border border-amber-500/20 rounded-lg p-8 text-center backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute -right-40 -top-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
          
          <h2 className="text-2xl font-bold text-white mb-4 relative">
            آماده شروع کسب و کار آنلاین خود هستید؟
          </h2>
          <p className="text-gray-300 mb-8 relative">
            همین امروز فروشگاه خود را در مجتمع تجاری ایرانچه بسازید و به میلیون‌ها مشتری دسترسی پیدا کنید
          </p>
          
          <div className="flex justify-center">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className={`w-full md:w-auto text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={loading ? undefined : handleCreateStore}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white ml-2"></div>
                <span>در حال انتقال...</span>
              </div>
            ) : (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center gap-2"
              >
                <span>ساخت فروشگاه</span>
              </motion.div>
            )}
          </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}