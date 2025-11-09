"use client";

import React from 'react';
import Link from 'next/link';
import { FiUser, FiPackage, FiMessageSquare } from 'react-icons/fi';

interface StoreTabsProps {
  activeTab: string;
  storeSlug: string;
}

export default function StoreTabs({ activeTab, storeSlug }: StoreTabsProps) {
  const tabs = [
    { id: 'profile', label: 'پروفایل', icon: FiUser },
    { id: 'products', label: 'محصولات', icon: FiPackage },
    { id: 'reviews', label: 'نظرات مشتریان', icon: FiMessageSquare },
  ];
  
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-1">
      <div className="grid grid-cols-3 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.id}
              href={`/stores/${storeSlug}?tab=${tab.id}`}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-secondary text-white' 
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-secondary'}`} />
              <span className="text-sm font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 