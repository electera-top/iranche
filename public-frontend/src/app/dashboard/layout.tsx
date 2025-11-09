'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header/Header';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'orders' | 'favorites' | 'messages' | 'settings' | 'wallet' | 'addresses' | 'following' | 'reviews' | 'notifications' | 'recent-views' | 'club' | 'support' | 'income'>('overview');
  
  
  // Mock user data (این داده‌ها باید در واقعیت از API دریافت شوند)
  const user = {
    name: 'علی محمدی',
    email: 'ali.mohammadi@example.com',
    phone: '09123456789',
    avatar: '/avatars/default.jpg',
    joinDate: 'فروردین ۱۴۰۳',
    orders: 12,
    favorites: 24,
    messages: 8,
    goldBalance: 12500,
    points: 3450,
    level: 5,
    financialBalance: 2500000,
    stores: [
      { id: 1, name: 'فروشگاه لوازم خانگی', status: 'فعال' },
      { id: 2, name: 'فروشگاه پوشاک', status: 'در انتظار تایید' }
    ]
  };

  const handleLogout = () => {
    // پیاده‌سازی منطق خروج از حساب کاربری
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardSidebar 
              user={user}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
             {children}
          </div>
        </div>
      </div>
      
 
    </div>
  );
} 