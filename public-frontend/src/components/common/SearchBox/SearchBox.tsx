"use client";

import { useState } from 'react';
import { FiSearch, FiMic, FiImage } from 'react-icons/fi'
import IconButton from '../../ui/button/IconButton'
import ImageSearchModal from './ImageSearchModal'
import VoiceSearchModal from './VoiceSearchModal'

interface SearchBoxProps {
  className?: string;
  placeholder?: string;
}

export default function SearchBox({ 
  className = '', 
  placeholder = 'جستجو...'
}: SearchBoxProps) {
  const [isImageSearchModalOpen, setIsImageSearchModalOpen] = useState(false);
  const [isVoiceSearchModalOpen, setIsVoiceSearchModalOpen] = useState(false);

  const handleOpenImageSearchModal = () => {
    setIsImageSearchModalOpen(true);
  };

  const handleCloseImageSearchModal = () => {
    setIsImageSearchModalOpen(false);
  };

  const handleOpenVoiceSearchModal = () => {
    setIsVoiceSearchModalOpen(true);
  };

  const handleCloseVoiceSearchModal = () => {
    setIsVoiceSearchModalOpen(false);
  };

  return (
    <>
      <div className={`relative w-full ${className}`}>
        <input
          type="text"
          placeholder={placeholder}
          className="w-full h-11 px-12 rounded-xl bg-white text-gray-800 placeholder-gray-400 border-2 border-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent shadow-md transition-all duration-300"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <IconButton variant="primary" size="sm">
            <FiSearch className="w-5 h-5" />
          </IconButton>
        </div>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <IconButton 
            variant="primary" 
            size="sm"
            onClick={handleOpenVoiceSearchModal}
            tooltip="جستجو با صدا"
          >
            <FiMic className="w-4 h-4" />
          </IconButton>
          <IconButton 
            variant="primary" 
            size="sm"
            onClick={handleOpenImageSearchModal}
            tooltip="جستجو با تصویر"
          >
            <FiImage className="w-4 h-4" />
          </IconButton>
        </div>
      </div>

      {/* مودال جستجو با تصویر */}
      <ImageSearchModal 
        isOpen={isImageSearchModalOpen} 
        onClose={handleCloseImageSearchModal} 
      />

      {/* مودال جستجو با صدا */}
      <VoiceSearchModal
        isOpen={isVoiceSearchModalOpen}
        onClose={handleCloseVoiceSearchModal}
      />
    </>
  )
} 