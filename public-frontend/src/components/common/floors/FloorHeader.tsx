"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiShoppingBag, FiLayers, FiStar } from "react-icons/fi";
import { Floor } from "@/lib/Types";

interface FloorHeaderProps {
  floor: Floor;
  storeCount: number;
}

export default function FloorHeader({ floor, storeCount }: FloorHeaderProps) {
  // رنگ متناسب با طبقه - استفاده از رنگ تم
  const getColorClass = () => {
    return "text-secondary";
  };
  
  // رنگ پس زمینه متناسب با طبقه - استفاده از رنگ تم
  const getBgClass = () => {
    return "bg-secondary";
  };
  
  return (
    <div className="mb-8 relative">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
        {/* نوار رنگی بالای کارت */}
        <div className={`h-2 w-full ${getBgClass()}`}></div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6 gap-4">
            <div className="flex items-start gap-4">
              <div className={`
                  relative w-16 h-16 rounded-xl 
                  flex items-center justify-center
                  ${getColorClass()} 
                  border border-slate-700
                  bg-slate-800
                `}
              >
                <div className={`absolute inset-2 opacity-20 rounded-lg ${getBgClass()}`} />
                <FiLayers className="w-8 h-8 relative z-10" />
              </div>
              
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold text-white">
                    طبقه {floor.title}
                  </h1>
                  {floor.isVIP && (
                    <div className="flex items-center gap-1 bg-secondary/15 px-2 py-0.5 rounded text-secondary text-sm">
                      <FiStar className="w-3.5 h-3.5 fill-secondary/30" />
                      <span className="font-medium">VIP</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-400 mt-2 max-w-2xl">{floor.description}</p>
              </div>
            </div>
            
            <Link 
              href="/floors" 
              className="hidden sm:flex items-center gap-1.5 text-secondary hover:text-secondary-300 transition-colors"
            >
              <span>بازگشت به طبقات</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-400">
                <FiShoppingBag className="w-5 h-5" />
                <span className="text-sm">{storeCount} فروشگاه در این طبقه</span>
              </div>
              
              {floor.isVIP && (
                <div className="flex items-center gap-2 text-secondary">
                  <FiStar className="w-5 h-5" />
                  <span className="text-sm">طبقه ویژه با خدمات مخصوص</span>
                </div>
              )}
            </div>
            
            <Link 
              href="/floors" 
              className="sm:hidden flex items-center gap-1.5 text-secondary text-sm"
            >
              <span>بازگشت به طبقات</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}