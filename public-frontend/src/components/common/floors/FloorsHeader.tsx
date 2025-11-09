"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiLayers, FiGrid } from 'react-icons/fi';

interface FloorsHeaderProps {
  totalFloors: number;
  totalStores: number;
}

export default function FloorsHeader({ totalFloors, totalStores }: FloorsHeaderProps) {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-secondary text-white p-3 rounded-full">
          <FiLayers className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-white">طبقات مجتمع تجاری ایرانچه</h1>
      </div>

 
      <div className="flex items-center gap-3 text-sm text-white/70 pr-12">
        <div className="flex items-center gap-1">
          <FiGrid className="w-4 h-4" />
          <span>{totalFloors} طبقه</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <FiLayers className="w-4 h-4" />
          <span>{totalStores} فروشگاه</span>
        </div>
      </div>
    </motion.div>
  );
} 