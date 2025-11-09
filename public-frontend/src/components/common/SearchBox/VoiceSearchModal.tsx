"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMic, FiSearch, FiStopCircle } from 'react-icons/fi';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceSearchModal({ isOpen, onClose }: VoiceSearchModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [audioVolume, setAudioVolume] = useState(0);
  
  // دیتای فیک برای نمایش نتایج جستجو
  const fakeSearchResults = [
    'لپ تاپ گیمینگ ایسوس',
    'موبایل سامسونگ گلکسی',
    'هدفون بی سیم سونی',
    'کنسول پلی استیشن 5',
    'تبلت اپل آیپد',
    'ساعت هوشمند اپل واچ'
  ];

  // شبیه‌سازی نوسانات صدا
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setAudioVolume(Math.random() * 100);
      }, 100);
    } else {
      setAudioVolume(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // شبیه‌سازی تشخیص صدا
  useEffect(() => {
    if (isRecording) {
      const phrases = [
        'جستجوی',
        'جستجوی لپ تاپ',
        'جستجوی لپ تاپ گیمینگ',
        'جستجوی لپ تاپ گیمینگ ایسوس'
      ];
      
      let currentPhrase = 0;
      
      const interval = setInterval(() => {
        if (currentPhrase < phrases.length) {
          setTranscript(phrases[currentPhrase]);
          currentPhrase++;
        } else {
          setIsRecording(false);
          setRecordingComplete(true);
          clearInterval(interval);
        }
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript('');
    setRecordingComplete(false);
    setSearchResults([]);
  };

  const handleStopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingComplete(true);
    }
  };

  const handleSearch = () => {
    if (transcript) {
      setIsSearching(true);
      // شبیه‌سازی جستجو
      setTimeout(() => {
        setSearchResults(fakeSearchResults);
        setIsSearching(false);
      }, 1500);
    }
  };

  const handleReset = () => {
    setTranscript('');
    setRecordingComplete(false);
    setIsRecording(false);
    setSearchResults([]);
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

  // تابع برای محاسبه عرض نوار صدا براساس حجم صدا
  const calculateBars = () => {
    const maxBars = 30;
    return Array.from({ length: maxBars }).map((_, i) => {
      const height = Math.sin((i / maxBars) * Math.PI) * audioVolume;
      return (
        <motion.div
          key={i}
          className="w-1 mx-[1px] bg-secondary rounded-full"
          animate={{ height: `${Math.max(5, height)}px` }}
          transition={{ duration: 0.1 }}
        />
      );
    });
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
              className="fixed inset-0 z-50 bg-primary-900 fixed md:static sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:w-[90%] sm:max-w-lg sm:max-h-[90vh] sm:overflow-y-auto shadow-2xl"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants}
            >
              {/* هدر مودال */}
              <div className="bg-gradient-to-r from-primary to-primary-700 text-white p-4 flex items-center justify-between sm:rounded-t-lg sticky top-0 z-10">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FiMic className="text-secondary" />
                  جستجو با صدا
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
                <div className="flex flex-col items-center">

                  {/* بخش ضبط صدا */}
                  <div className="w-full mb-6">
                    {/* دایره و دکمه میکروفون */}
                    <div className="flex flex-col items-center mb-4">
                      <motion.div 
                        className={`relative w-40 h-40 rounded-full flex items-center justify-center mb-4 ${
                          isRecording ? 'bg-red-500/20' : 'bg-primary-800/50'
                        }`}
                        animate={{ 
                          boxShadow: isRecording 
                            ? ['0 0 0 0px rgba(239, 68, 68, 0.2)', '0 0 0 20px rgba(239, 68, 68, 0)'] 
                            : 'none',
                          scale: isRecording ? [1, 1.05, 1] : 1
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: isRecording ? Infinity : 0,
                          repeatType: 'loop'
                        }}
                      >
                        <motion.button
                          className={`w-24 h-24 rounded-full flex items-center justify-center ${
                            isRecording ? 'bg-red-500' : 'bg-secondary'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={isRecording ? handleStopRecording : handleStartRecording}
                        >
                          {isRecording ? (
                            <FiStopCircle className="w-10 h-10 text-white" />
                          ) : (
                            <FiMic className="w-10 h-10 text-white" />
                          )}
                        </motion.button>
                      </motion.div>

                      {/* وضعیت ضبط */}
                      <div className="text-center">
                        {isRecording ? (
                          <p className="text-white text-xl animate-pulse flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                            در حال ضبط...
                          </p>
                        ) : recordingComplete ? (
                          <p className="text-white text-lg">ضبط صدا تکمیل شد</p>
                        ) : (
                          <p className="text-white text-lg">برای شروع ضبط دکمه را فشار دهید</p>
                        )}
                      </div>
                    </div>

                    {/* نمایش نوار صدا */}
                    {isRecording && (
                      <div className="flex justify-center items-center h-16 my-4">
                        <div className="flex items-center h-16">
                          {calculateBars()}
                        </div>
                      </div>
                    )}

                    {/* نمایش متن تشخیص داده شده */}
                    {transcript && (
                      <motion.div 
                        className="bg-primary-800 p-4 rounded-lg mb-4 mt-2 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-white text-xl font-medium">{transcript}</p>
                      </motion.div>
                    )}

                    {/* نتایج جستجو */}
                    {searchResults.length > 0 && (
                      <motion.div
                        className="mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                          <FiSearch className="text-secondary" />
                          نتایج جستجو
                        </h4>
                        <div className="bg-primary-800/50 rounded-lg p-3">
                          {searchResults.map((result, index) => (
                            <motion.a
                              key={index}
                              href="#"
                              className="block bg-primary-800 hover:bg-primary-700 p-3 rounded-lg mb-2 text-white"
                              whileHover={{ x: 5 }}
                              transition={{ type: 'spring', stiffness: 500 }}
                            >
                              {result}
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* دکمه‌های کنترل */}
                  <div className="flex gap-3 justify-center mt-4 mt-4  bg-primary-900 p-3 sm:p-0 sm:bg-transparent w-full">
                    {isRecording ? (
                      <motion.button
                        onClick={handleStopRecording}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 px-4 py-3 rounded-lg text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiStopCircle className="w-5 h-5" />
                        <span>توقف ضبط</span>
                      </motion.button>
                    ) : (
                      <>
                        {recordingComplete ? (
                          <>
                            <motion.button
                              onClick={handleReset}
                              className="flex-1 flex items-center justify-center gap-2 bg-primary-700 px-4 py-3 rounded-lg text-white"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiMic className="w-5 h-5" />
                              <span>ضبط مجدد</span>
                            </motion.button>
                            <motion.button
                              onClick={handleSearch}
                              disabled={isSearching}
                              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white ${
                                isSearching ? 'bg-gray-600' : 'bg-blue-600'
                              }`}
                              whileHover={!isSearching ? { scale: 1.05 } : {}}
                              whileTap={!isSearching ? { scale: 0.95 } : {}}
                            >
                              {isSearching ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>در حال جستجو...</span>
                                </>
                              ) : (
                                <>
                                  <FiSearch className="w-5 h-5" />
                                  <span>جستجو</span>
                                </>
                              )}
                            </motion.button>
                          </>
                        ) : (
                          <motion.button
                            onClick={handleStartRecording}
                            className="flex-1 flex items-center justify-center gap-2 bg-secondary px-4 py-3 rounded-lg text-white"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiMic className="w-5 h-5" />
                            <span>شروع ضبط صدا</span>
                          </motion.button>
                        )}
                      </>
                    )}
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