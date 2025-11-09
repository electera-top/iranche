import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// تعریف تم‌های رنگی موجود
export type ThemeType = 'navy-cream' | 'navy-green' | 'navy-blue' | 'navy-gold' | 'navy-pink' | 'navy-orange' | 'default';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// هوک استفاده از تم
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // خواندن تم ذخیره شده از localStorage یا استفاده از تم پیش‌فرض
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as ThemeType;
      const validThemes: ThemeType[] = ['navy-cream', 'default', 'navy-blue', 'navy-gold', 'navy-pink', 'navy-orange'];
      return validThemes.includes(savedTheme as ThemeType) ? savedTheme : 'navy-cream';
    }
    return 'navy-cream';
  });

  // ذخیره تم در localStorage هنگام تغییر و اعمال کلاس‌های CSS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      
      // اعمال کلاس‌های مربوط به تم به المان root
      const root = document.documentElement;
      
      // ابتدا همه کلاس‌های تم را حذف می‌کنیم
      root.classList.remove('theme-default', 'theme-navy-green', 'theme-navy-blue', 'theme-navy-gold', 'theme-navy-pink', 'theme-navy-orange', 'theme-navy-cream');
      
      // سپس کلاس تم جدید را اضافه می‌کنیم
      const newThemeClass = `theme-${theme}`;
      root.classList.add(newThemeClass);
      
      // برای دیباگ - چاپ اطلاعات در کنسول
      if (process.env.NODE_ENV === 'development') {
        console.log(`Theme changed to: ${theme}`);
        console.log(`Applied CSS class: ${newThemeClass}`);
        console.log(`Current root classes: ${root.className}`);
      }
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}; 