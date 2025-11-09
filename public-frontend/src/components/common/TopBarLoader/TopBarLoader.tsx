'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function TopBarLoader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setIsVisible(true);
    setProgress(0);
    
    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 100);

    // Hide loader after page load
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50">
      <div
        className="h-full bg-secondary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
} 