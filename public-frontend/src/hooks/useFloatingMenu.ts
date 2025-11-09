// این فایل برای صادر کردن هوک useFloatingMenu است
// به این ترتیب کامپوننت‌ها می‌توانند از یک مسیر ساده‌تر به این هوک دسترسی داشته باشند

import { useContext } from 'react';
import { FloatingMenuContext, FloatingMenuContextType } from '@/components/common/FloatingMenu/FloatingMenuProvider';

// تعریف هوک که context را بازمی‌گرداند
export const useFloatingMenu = (): FloatingMenuContextType => {
  const context = useContext(FloatingMenuContext);
  
  if (context === undefined) {
    throw new Error('useFloatingMenu must be used within a FloatingMenuProvider');
  }
  
  return context;
}; 