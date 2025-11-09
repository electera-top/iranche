"use client";

import React, { useState } from 'react';
import StoreList from '@/components/chat/StoreList';
import ChatWindow from '@/components/chat/ChatWindow';

// داده‌های نمونه برای فروشندگان
const sampleStores = [
  {
    id: '1',
    name: 'فروشگاه مد و پوشاک',
    logo: 'https://picsum.photos/200/200',
    isVIP: true,
    isOnline: true,
    floor: '۳',
    unit: '۱۲۳',
    unreadCount: 2,
    lastMessage: 'سلام، محصول مورد نظر شما موجود است',
    lastMessageTime: '۱۰:۳۰',
  },
  {
    id: '2',
    name: 'فروشگاه لوازم دیجیتال',
    logo: 'https://picsum.photos/201/201',
    isVIP: false,
    isOnline: false,
    lastSeen: '۲ ساعت پیش',
    floor: '۲',
    unit: '۴۵',
    unreadCount: 0,
    lastMessage: 'ممنون از خرید شما',
    lastMessageTime: 'دیروز',
  },
  // ... می‌توانید فروشندگان بیشتری اضافه کنید
];

// داده‌های نمونه برای پیام‌ها
const sampleMessages = {
  '1': [
    {
      id: '1',
      text: 'سلام، محصول مورد نظر شما موجود است',
      sender: 'store',
      timestamp: '۱۰:۳۰',
      isRead: true,
    },
    {
      id: '2',
      text: 'ممنون، قیمت چنده؟',
      sender: 'user',
      timestamp: '۱۰:۳۲',
      isRead: true,
    },
    {
      id: '3',
      text: 'قیمت ۲۵۰ هزار تومان است',
      sender: 'store',
      timestamp: '۱۰:۳۳',
      isRead: true,
    },
    {
      id: '4',
      text: 'آیا امکان تخفیف داره؟',
      sender: 'user',
      timestamp: '۱۰:۳۵',
      isRead: false,
    },
  ],
  '2': [
    {
      id: '1',
      text: 'سلام، محصول شما تحویل داده شد',
      sender: 'store',
      timestamp: 'دیروز',
      isRead: true,
    },
    {
      id: '2',
      text: 'ممنون از خرید شما',
      sender: 'store',
      timestamp: 'دیروز',
      isRead: true,
    },
  ],
};

export default function ChatPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, any[]>>(sampleMessages);

  const handleSendMessage = (storeId: string, text: string, replyTo?: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      replyTo: replyTo ? messages[storeId].find(m => m.id === replyTo) : undefined,
    };

    setMessages(prev => ({
      ...prev,
      [storeId]: [...(prev[storeId] || []), newMessage],
    }));
  };

  return (
    <div className="flex h-screen bg-zinc-900">
      {/* لیست فروشندگان */}
      <div className="w-full md:w-1/3 lg:w-1/4 h-full border-l border-zinc-800 shrink-0">
        <StoreList
          stores={sampleStores}
          selectedStoreId={selectedStoreId}
          onSelectStore={setSelectedStoreId}
        />
      </div>

      {/* پنجره چت */}
      <div className="hidden md:flex w-full h-full">
        {selectedStoreId ? (
          <div className="w-full">
            <ChatWindow
              store={sampleStores.find(store => store.id === selectedStoreId)!}
              messages={messages[selectedStoreId] || []}
              onSendMessage={(text, replyTo) => handleSendMessage(selectedStoreId, text, replyTo)}
            />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center text-gray-400">
            <p>لطفا یک فروشنده را انتخاب کنید</p>
          </div>
        )}
      </div>

      {/* حالت موبایل */}
      {selectedStoreId && (
        <div className="md:hidden fixed inset-0 z-50">
          <ChatWindow
            store={sampleStores.find(store => store.id === selectedStoreId)!}
            messages={messages[selectedStoreId] || []}
            onSendMessage={(text, replyTo) => handleSendMessage(selectedStoreId, text, replyTo)}
            onBack={() => setSelectedStoreId(null)}
          />
        </div>
      )}
    </div>
  );
} 