"use client";

import React from 'react';
import { FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

interface StoreBioProps {
  store: {
    name: string;
    bio: string;
    strengths: string[];
    weaknesses: string[];
  };
}

export default function StoreBio({ store }: StoreBioProps) {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="flex items-center text-lg font-bold text-white mb-4">
          <FiInfo className="w-5 h-5 text-secondary ml-2" />
          <span>درباره {store.name}</span>
        </h2>
        
        <div className="text-sm leading-7 text-slate-300 whitespace-pre-line">
          {store.bio}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* نقاط قوت */}
        <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-800">
          <h3 className="flex items-center text-base font-bold text-white mb-4">
            <FiCheckCircle className="w-5 h-5 text-green-500 ml-2" />
            <span>نقاط قوت</span>
          </h3>
          
          <ul className="space-y-3">
            {store.strengths.map((strength, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="flex-shrink-0 flex justify-center items-center w-5 h-5 bg-green-500/20 rounded-full ml-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-green-500" />
                </span>
                <span className="text-slate-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* نقاط ضعف */}
        <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-800">
          <h3 className="flex items-center text-base font-bold text-white mb-4">
            <FiXCircle className="w-5 h-5 text-red-500 ml-2" />
            <span>نقاط ضعف</span>
          </h3>
          
          {store.weaknesses.length > 0 ? (
            <ul className="space-y-3">
              {store.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="flex-shrink-0 flex justify-center items-center w-5 h-5 bg-red-500/20 rounded-full ml-2">
                    <FiXCircle className="w-3.5 h-3.5 text-red-500" />
                  </span>
                  <span className="text-slate-300">{weakness}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">موردی گزارش نشده است.</p>
          )}
        </div>
      </div>
      
      {/* اطلاعات بیشتر */}
      <div className="mt-8 bg-secondary/10 rounded-xl p-5 border border-secondary/20">
        <p className="text-sm text-slate-300 flex items-start">
          <FiInfo className="w-5 h-5 text-secondary ml-2 flex-shrink-0" />
          <span>
            این اطلاعات برگرفته از نظرات مشتریان و تجربه‌های خرید آن‌ها می‌باشد. چنانچه نظر یا تجربه‌ای دارید، می‌توانید آن را در بخش نظرات ثبت کنید.
          </span>
        </p>
      </div>
    </div>
  );
} 