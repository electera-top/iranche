import React from 'react';
import { FiStar, FiAlertCircle, FiEye } from 'react-icons/fi';
import Link from 'next/link';

interface Store {
  id: string;
  name: string;
  logo: string;
  isVIP: boolean;
  isOnline: boolean;
  lastSeen?: string;
  floor: string;
  unit: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
}

interface StoreListProps {
  stores: Store[];
  selectedStoreId: string | null;
  onSelectStore: (storeId: string) => void;
}

const StoreList: React.FC<StoreListProps> = ({ stores, selectedStoreId, onSelectStore }) => {
  return (
    <div className="w-full h-full bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
      {/* هدر لیست فروشندگان */}
      <div className="p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">فروشندگان</h2>
          <Link
            href="/"
            className="text-primary-400 hover:text-primary-300 flex items-center text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            بازگشت به سایت
          </Link>
        </div>
      </div>

      {/* لیست فروشندگان */}
      <div className="divide-y divide-zinc-800">
        {stores.map((store) => (
          <div
            key={store.id}
            className={`p-4 cursor-pointer hover:bg-zinc-800 transition-colors ${
              selectedStoreId === store.id ? 'bg-zinc-800' : ''
            }`}
            onClick={() => onSelectStore(store.id)}
          >
            <div className="flex items-start">
              {/* آواتار فروشنده */}
              <div className="relative">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-12 h-12 rounded-full border-2 border-zinc-700"
                />
                {store.isOnline ? (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900" />
                ) : (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-zinc-900" />
                )}
              </div>

              {/* اطلاعات فروشنده */}
              <div className="mr-3 flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-bold text-base">{store.name}</span>
                    {store.isVIP && (
                      <FiStar className="mr-1 text-yellow-400" />
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{store.lastMessageTime}</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-xs text-gray-400">
                    <span className="ml-1">طبقه:</span>
                    <span className="text-white font-medium">{store.floor}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <span className="ml-1">پلاک:</span>
                    <span className="text-white font-medium">{store.unit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400 truncate max-w-[200px]">
                      {store.lastMessage}
                    </span>
                    {store.unreadCount > 0 && (
                      <span className="mr-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {store.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement view store page
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement report store
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FiAlertCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList; 