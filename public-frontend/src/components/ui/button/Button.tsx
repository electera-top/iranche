"use client";

import { ReactNode } from 'react'
import Link from 'next/link'

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
  className?: string
}

interface ButtonAsButton extends BaseButtonProps {
  type?: 'button'
  onClick?: () => void
  href?: never
}

interface ButtonAsLink extends BaseButtonProps {
  type: 'link'
  href: string
  onClick?: never
}

type ButtonProps = ButtonAsButton | ButtonAsLink

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className = '', 
  type = 'button',
  onClick,
  href
}: ButtonProps) {
  const baseStyles = "rounded-lg transition-all duration-300 flex items-center gap-2"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-600 hover:shadow-lg hover:shadow-primary/50",
    secondary: "bg-secondary text-white hover:bg-secondary-600 hover:shadow-lg hover:shadow-secondary/50",
    "outline-primary": "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/50",
    "outline-secondary": "bg-transparent text-white border-2 border-secondary hover:bg-secondary hover:text-white hover:shadow-lg hover:shadow-secondary/50",
    "outline-secondary-primary": "bg-primary text-white border-4 border-secondary font-bold outline outline-4 outline-primary hover:bg-secondary hover:text-white hover:shadow-lg hover:shadow-secondary/50",
    // "outline-secondary-white": "bg-secondary text-white border-2 border-white hover:bg-secondary hover:text-white hover:shadow-lg hover:shadow-secondary/50",
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  }
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  if (type === 'link' && href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button 
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  )
}