import React, { useState } from 'react';
import { useTheme, ThemeType } from '@/context/ThemeContext';
import { FaCog } from 'react-icons/fa';
import { IoMdColorPalette } from 'react-icons/io';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleThemeMenu = () => {
    setIsOpen(!isOpen);
  };

  const themeOptions = [
    { id: 'default', name: 'سرمه‌ای و قرمز (اصلی)', primaryColor: '#0A1A35', secondaryColor: '#ed1c24' },
    { id: 'navy-green', name: 'سرمه‌ای و سبز', primaryColor: '#0A1A35', secondaryColor: '#00FF00' },
    { id: 'navy-blue', name: 'سرمه‌ای و فیروزه‌ای', primaryColor: '#0A1A35', secondaryColor: '#00f7ff' },
    { id: 'navy-gold', name: 'سرمه‌ای و طلایی', primaryColor: '#0A1A35', secondaryColor: '#ffff3c' },
    { id: 'navy-pink', name: 'سرمه‌ای و صورتی', primaryColor: '#0A1A35', secondaryColor: '#ff8da1' },
    { id: 'navy-orange', name: 'سرمه‌ای و نارنجی', primaryColor: '#0A1A35', secondaryColor: '#ff8400' }
  ];

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
      <button
        onClick={toggleThemeMenu}
        className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-primary"
        title="تنظیمات رنگ"
      >
        <FaCog className={`text-xl ${isOpen ? 'animate-spin' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-14 top-0 bg-white rounded-lg shadow-xl p-4 w-64 transition-all duration-300">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <IoMdColorPalette className="text-xl text-secondary" />
            <h3 className="font-medium">انتخاب تم رنگی</h3>
          </div>
          
          <div className="space-y-3">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleThemeChange(option.id as ThemeType)}
                className={`w-full text-right text-sm flex items-center gap-3 p-2 rounded-md transition-all ${
                  theme === option.id ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span
                    className="block w-5 h-5 rounded-full"
                    style={{ backgroundColor: option.primaryColor }}
                  ></span>
                  <span
                    className="block w-5 h-5 rounded-full"
                    style={{ backgroundColor: option.secondaryColor }}
                  ></span>
                </div>
                <span>{option.name}</span>
                {theme === option.id && (
                  <span className="mr-auto text-xs bg-secondary text-white px-2 py-0.5 rounded">فعال</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher; 