"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiSearch, FiCamera, FiImage, FiChevronsRight } from 'react-icons/fi';
import Image from 'next/image';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageSearchModal({ isOpen, onClose }: ImageSearchModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchStep, setSearchStep] = useState<'upload' | 'results'>('upload');
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // فایک دیتا - در محیط واقعی از API دریافت می‌شود
  const similarImages = [
    '/images/products/product-1.jpg',
    '/images/products/product-2.jpg',
    '/images/products/product-3.jpg',
    '/images/products/product-4.jpg',
    '/images/products/product-5.jpg',
    '/images/products/product-6.jpg',
    '/images/products/product-7.jpg',
  
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    // در حالت واقعی از API دوربین استفاده می‌شود
    // فعلا یک تصویر فیک
    setSelectedImage('/images/camera-placeholder.jpg');
  };

  const handleSearch = () => {
    if (selectedImage) {
      setIsSearching(true);
      // شبیه‌سازی جستجو
      setTimeout(() => {
        setSearchStep('results');
        setIsSearching(false);
      }, 1500);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSearchStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // انیمیشن‌ها
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const modalVariants = {
    hidden: isMobile 
      ? { opacity: 0, y: '100%' } 
      : { opacity: 0, scale: 0.9, y: 20 },
    visible: isMobile 
      ? { opacity: 1, y: 0, transition: { type: 'tween', ease: 'easeOut', duration: 0.3 } } 
      : { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }
  };

  const imageVariants = {
    hover: { scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* پس‌زمینه تیره */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
          >

 {/* مودال */}
 <motion.div
            className="fixed inset-0 z-50 bg-primary-900 fixed md:static sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:w-[90%] sm:max-w-5xl sm:max-h-[90vh] sm:overflow-y-auto shadow-2xl"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
          >
            {/* هدر مودال */}
            <div className="bg-gradient-to-r from-primary to-primary-700 text-white p-4 flex items-center justify-between sm:rounded-t-lg sticky top-0 z-10">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FiImage className="text-secondary" />
                جستجو با تصویر
              </h3>
              <motion.button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            {/* محتوای مودال */}
            <div className="p-4 sm:p-6 h-[calc(100%-64px)] sm:h-auto overflow-y-auto pb-24 sm:pb-6">
              {searchStep === 'upload' ? (
                <div className="flex flex-col items-center">
                  {/* بخش آپلود تصویر */}
                  <div className="mb-6 w-full">
                    {selectedImage ? (
                      <div className="relative mb-4">
                        <Image
                          src={selectedImage}
                          alt="Selected image"
                          width={800}
                          height={500}
                          className="w-full h-64 object-cover rounded-xl"
                        />
                        <button
                          onClick={handleReset}
                          className="absolute top-2 right-2 bg-white/80 p-1 rounded-full shadow-md"
                        >
                          <FiX className="w-5 h-5 text-gray-800" />
                        </button>
                      </div>
                    ) : (
                      <motion.div 
                        className="border border-dashed border-red-500 rounded-md p-6 text-center cursor-pointer bg-primary-800/50 flex flex-col items-center justify-center h-[200px] sm:h-[200px] md:h-[250px] w-full"
                        onClick={handleUploadClick}
                        whileHover={{ borderColor: "#ff0000" }}
                      >
                        <div className="w-20 h-20 mb-4 text-gray-300">
                          <FiUpload className="w-full h-full" />
                        </div>
                        <p className="text-white text-lg">تصویر مورد نظر خود را آپلود کنید</p>
                        <p className="text-gray-400 text-sm mt-1">یا با دوربین عکس بگیرید</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                      </motion.div>
                    )}

                    {/* دکمه‌های آپلود و دوربین */}
                    <div className="flex gap-3 justify-center mt-4 mt-4  bg-primary-900 p-3 sm:p-0">
                      <motion.button
                        onClick={handleUploadClick}
                        className="flex-1 flex items-center justify-center gap-2 bg-secondary px-4 py-3 rounded-lg text-white hover:bg-primary-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiUpload className="w-4 h-4" />
                        <span>آپلود تصویر</span>
                      </motion.button>
                      <motion.button
                        onClick={handleTakePhoto}
                        className="flex-1 flex items-center justify-center gap-2 bg-secondary px-4 py-3 rounded-lg text-white hover:bg-secondary-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiCamera className="w-4 h-4" />
                        <span>عکس گرفتن</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* دکمه جستجو */}
                  {selectedImage && (
                    <motion.button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className={`w-full py-3 mt-4 mb-20 sm:mb-0 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
                        isSearching ? 'bg-primary' : 'bg-primary-950 hover:bg-primary-900'
                      }`}
                      whileHover={!isSearching ? { scale: 1.02 } : {}}
                      whileTap={!isSearching ? { scale: 0.98 } : {}}
                    >
                      {isSearching ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>در حال جستجو...</span>
                        </>
                      ) : (
                        <>
                          <FiSearch className="w-5 h-5" />
                          <span>جستجوی تصویر</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* بخش نتایج جستجو */}
                  <div className="mb-4 flex items-center gap-2">
                    <motion.button
                      onClick={() => setSearchStep('upload')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors flex items-center gap-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiChevronsRight className="w-5 h-5" />
                      <span className="text-sm">بازگشت</span>
                    </motion.button>
                    <h4 className="font-medium">تصاویر مشابه</h4>
                  </div>

                  {/* تصویر انتخاب شده */}
                  <div className="mb-4 relative">
                    <div className="absolute left-2 top-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                      تصویر انتخابی
                    </div>
                    <Image
                      src={selectedImage || ''}
                      alt="Selected image"
                      width={800}
                      height={200}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  </div>

                  {/* گرید نتایج */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {similarImages.map((img, index) => (
                      <motion.div
                        key={index}
                        className="rounded-lg overflow-hidden cursor-pointer"
                        variants={imageVariants}
                        whileHover="hover"
                      >
                        <div className="relative pb-[100%]">
                          <Image
                            src={img}
                            alt={`Similar product ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                            <div className="p-2 w-full text-center">
                              <span className="text-white text-xs">محصول مشابه {index + 1}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* دکمه جستجوی دوباره */}
                  <motion.button
                    onClick={handleReset}
                    className="mt-6 py-2 rounded-lg bg-primary text-white font-medium transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiUpload className="w-4 h-4" />
                    <span>جستجوی تصویر جدید</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
            </motion.div>

         
        </>
      )}
    </AnimatePresence>
  );
} 