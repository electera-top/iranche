'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { FloatingMenuProvider } from '@/components/common/FloatingMenu/FloatingMenuProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      {/* اینجا می‌تونید provider های دیگر را اضافه کنید */}
      {/* مثل Redux Provider و غیره */}
      <FloatingMenuProvider>
        {children}
      </FloatingMenuProvider>
    </ThemeProvider>
  )
}