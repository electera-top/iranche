"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiShoppingBag, FiLayers, FiStar, FiCheck } from 'react-icons/fi';

interface FloorCardProps {
  title: string;
  description: string;
  storeCount: number;
  color: string; // هنوز نگه داشته می‌شود برای سازگاری با API، اگرچه استفاده نمی‌شود
  slug: string;
  isVIP?: boolean;
}

export default function FloorCard({ 
  title, 
  description, 
  storeCount,
  // color نادیده گرفته می‌شود و از رنگ تم استفاده می‌شود
  slug,
  isVIP = false
}: FloorCardProps) {
  // استفاده از رنگ تم به جای رنگ‌های مختلف
  const classes = {
    bg: "from-slate-900 to-slate-950",
    highlight: "bg-secondary",
    light: "bg-secondary/90",
    text: "text-secondary",
    border: "border-secondary/30",
    shadow: "shadow-secondary/20"
  };
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        whileHover: { duration: 0.2, ease: "easeOut" }
      }}
      className="group relative will-change-transform"
    >
      {/* طراحی جدید کارت - لوکس و با کیفیت بالا */}
      <div className={`
        relative overflow-hidden rounded-2xl 
        bg-gradient-to-br ${classes.bg}
        border border-secondary 
        shadow-xl ${classes.shadow}
        backdrop-blur-sm
        h-full
        transition-all duration-300 ease-out
      `}>
        {/* نوار رنگی بالای کارت */}
        
        {/* برچسب طبقه */}
        <div className="absolute top-5 left-5 flex items-center z-10">
          <div className={`
            h-8 px-3 rounded-full
            flex items-center gap-2
            backdrop-filter backdrop-blur-md
            bg-slate-900/80 border ${classes.border}
          `}>
            <span className={`${classes.text} uppercase text-xs font-medium tracking-widest`}>
              طبقه {slug.match(/\d+/)?.[0] || "1"}
            </span>
          </div>
        </div>
        
      
        <Link href={`/floors/${slug}`} className="block p-6 pt-12 h-full">
          {/* محتوای اصلی کارت */}
          <div className="flex flex-col h-full">
            {/* آیکون طبقه */}
            <div className="mb-6">
              <div className={`
                relative
                w-14 h-14 overflow-hidden
                border ${classes.border} 
                rounded-xl
                flex items-center justify-center
                ${classes.text}
              `}>
                {/* افکت پشت آیکون */}
                <motion.div 
                  className={`absolute inset-0 opacity-20 ${classes.light}`}
                  animate={{ 
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <FiLayers className="w-7 h-7 relative z-10" strokeWidth={1.5} />
              </div>
            </div>
            
            {/* عنوان و توضیحات */}
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-3 relative">
                <h3 className="text-xl font-bold text-white">
                  {title}
                </h3>
                {isVIP && (
                  <motion.div 
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="text-secondary"
                  >
                    <FiStar className="w-4 h-4 fill-secondary/50" />
                  </motion.div>
                )}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>
            
            {/* فوتر کارت با اطلاعات فروشگاه‌ها و دکمه مشاهده */}
            <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
              <div className="flex items-center text-slate-400 text-sm gap-1.5">
                <div className={`w-6 h-6 rounded-full ${classes.highlight} flex items-center justify-center`}>
                  <FiShoppingBag className="w-3 h-3 text-white" />
                </div>
                <span>{storeCount} فروشگاه</span>
              </div>
              
              <div className={`
                text-white text-sm font-medium 
                flex items-center gap-1
                group-hover:${classes.text} transition-colors duration-200
              `}>
                <span>مشاهده</span>
                <FiChevronLeft className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </Link>
        
        {/* افکت‌های گرافیکی کارت */}
        <div className="absolute -top-5 -right-5 w-24 h-24 opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500">
          <div className={classes.highlight}></div>
        </div>
        
      
       
        
        {/* خط عمودی برای تزئین بیشتر */}
        <div className={`absolute top-14 left-14 h-32 w-px ${classes.border} rotate-[30deg] opacity-30`}></div>
      </div>
      
     
    </motion.div>
  );
}