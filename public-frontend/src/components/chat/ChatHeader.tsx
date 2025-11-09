import React, { useState } from 'react';
import { FiArrowRight, FiMoreVertical, FiEye, FiFlag, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

interface ChatHeaderProps {
  storeName: string;
  onBack?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ storeName, onBack }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowRight className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-lg font-semibold text-white">{storeName}</h2>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <FiMoreVertical className="w-5 h-5" />
        </button>
        
        {isMenuOpen && (
          <div className="absolute left-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
            <Link
              href={`/store/${storeName}`}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <FiEye className="ml-2" />
              مشاهده صفحه فروشگاه
            </Link>
            <button
              className="w-full flex items-center text-right px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={() => {
                // Handle report
                setIsMenuOpen(false);
              }}
            >
              <FiFlag className="ml-2" />
              گزارش
            </button>
            <button
              className="w-full flex items-center text-right px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
              onClick={() => {
                // Handle delete chat
                setIsMenuOpen(false);
              }}
            >
              <FiTrash2 className="ml-2" />
              حذف چت
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader; 