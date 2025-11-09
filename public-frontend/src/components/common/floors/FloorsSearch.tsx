"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiChevronDown, FiFilter, FiLayers, FiStar } from 'react-icons/fi';
import { Floor } from '@/lib/Types';

interface FloorsSearchProps {
  floors: Floor[];
  onFilterChange: (filteredFloors: Floor[]) => void;
}

export default function FloorsSearch({ floors, onFilterChange }: FloorsSearchProps) {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showVIPOnly, setShowVIPOnly] = useState(false);
  
  // فیلتر کردن طبقات براساس متن جستجو و وضعیت VIP
  useEffect(() => {
    const filtered = floors.filter(floor => {
      const matchesSearch = floor.title.includes(searchText) || 
                            floor.description.includes(searchText) || 
                            floor.slug.includes(searchText);
      
      if (showVIPOnly) {
        return matchesSearch && floor.isVIP;
      }
      
      return matchesSearch;
    });
    
    onFilterChange(filtered);
  }, [searchText, showVIPOnly, floors, onFilterChange]);
  
  // آنیمیشن‌های آیکون جستجو
  const searchIconVariants = {
    idle: { scale: 1 },
    active: { scale: 1.1, rotate: [0, 3, -3, 0], transition: { yoyo: Infinity, duration: 0.8 } }
  };
  
  return (
    <div className="relative">
      <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-5">
          {/* فیلد جستجو */}
          <div className="relative flex-grow w-full">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <motion.div
                variants={searchIconVariants}
                animate={searchText ? 'active' : 'idle'}
                className="text-secondary"
              >
                <FiSearch className="w-5 h-5" />
              </motion.div>
            </div>
            
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="نام طبقه، توضیحات یا آدرس را وارد کنید..."
              className="w-full bg-slate-800/70 border border-slate-700 rounded-xl py-3 px-11 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-secondary/40 transition-all duration-300"
            />
            
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* فیلتر VIP */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-800/70 border border-slate-700 hover:border-slate-600 rounded-xl w-full py-3 px-5 text-white flex items-center justify-between gap-3 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <FiFilter className="w-5 h-5 text-secondary" />
                <span className="text-slate-200">فیلترها</span>
              </div>
              <FiChevronDown className={`w-4 h-4 transition-transform duration-300 text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* پنل فیلترها */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 text-white border-t border-slate-800/80">
                <div className="py-4">
                  <label className="flex items-center gap-3 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/80 cursor-pointer hover:bg-slate-800/80 transition-colors duration-300">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-300 ${showVIPOnly ? 'bg-secondary' : 'bg-slate-700'}`}>
                      {showVIPOnly && <FiCheck className="w-4 h-4 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={showVIPOnly}
                      onChange={() => setShowVIPOnly(!showVIPOnly)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2.5">
                      <FiStar className="text-secondary fill-secondary/30 w-5 h-5" />
                      <span className="text-slate-200">فقط طبقات VIP</span>
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* راهنمای جستجو */}
        {!isOpen && (
          <div className="px-5 pb-4 flex items-center gap-2 text-xs text-slate-500 border-t border-slate-800/80 pt-4">
            <div className="w-1 h-1 rounded-full bg-secondary"></div>
            <span>برای جستجوی دقیق‌تر، نام مورد نظر خود را وارد کنید</span>
          </div>
        )}
      </div>
      
      {/* متن نمایش نتایج جستجو */}
      <div className="flex items-center justify-between mt-4 px-1 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <FiLayers className="w-4 h-4 text-secondary" />
          <span>نمایش {floors.filter(floor => {
            const matchesSearch = floor.title.includes(searchText) || 
                                  floor.description.includes(searchText) || 
                                  floor.slug.includes(searchText);
            
            if (showVIPOnly) {
              return matchesSearch && floor.isVIP;
            }
            
            return matchesSearch;
          }).length} طبقه از {floors.length} طبقه</span>
        </div>
        
        {showVIPOnly && (
          <div className="flex items-center gap-1.5 text-secondary">
            <FiStar className="w-3.5 h-3.5 fill-secondary/30" />
            <span>فقط VIP</span>
          </div>
        )}
      </div>
    </div>
  );
}

// آیکون تیک برای چک باکس
function FiCheck(props: { className?: string }) {
  return (
    <svg 
      stroke="currentColor" 
      fill="none" 
      strokeWidth="2" 
      viewBox="0 0 24 24" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      height="1em" 
      width="1em" 
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
} 