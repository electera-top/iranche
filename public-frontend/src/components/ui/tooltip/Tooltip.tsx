"use client";

import { ReactNode } from 'react'

interface TooltipProps {
  children: ReactNode
  text: string
}

export default function Tooltip({ children, text }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute -bottom-12 left-0 sm:left-1/2 sm:-translate-x-1/2 w-[200px] sm:w-auto bg-gray-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="px-3 py-2 text-center  whitespace-nowrap">
          {text}
        </div>
        <div className="absolute -top-2 left-4 sm:left-1/2 sm:-translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-gray-900"></div>
      </div>
    </div>
  )
} 