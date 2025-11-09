'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import FloatingMenu from './FloatingMenu';

// تعریف نوع برای context
export interface FloatingMenuContextType {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

// ایجاد context
export const FloatingMenuContext = createContext<FloatingMenuContextType>({
  isOpen: false,
  openMenu: () => { console.log('Default openMenu called'); },
  closeMenu: () => { console.log('Default closeMenu called'); },
  toggleMenu: () => { console.log('Default toggleMenu called'); }
});

// کامپوننت Provider
export function FloatingMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // تعریف توابع کنترلی منو
  const openMenu = () => {
    console.log('Provider: openMenu called');
    setIsOpen(true);
  };
  
  const closeMenu = () => {
    console.log('Provider: closeMenu called');
    setIsOpen(false);
  };
  
  const toggleMenu = () => {
    console.log('Provider: toggleMenu called');
    setIsOpen(!isOpen);
  };

  return (
    <FloatingMenuContext.Provider value={{ isOpen, openMenu, closeMenu, toggleMenu }}>
      {children}
     
      <FloatingMenu isOpen={isOpen} onClose={closeMenu} />
    </FloatingMenuContext.Provider>
  );
} 