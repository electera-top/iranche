"use client";

import { ReactNode } from 'react'
import Tooltip from '../tooltip/Tooltip'
import Link from 'next/link'

interface BaseIconButtonProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'highlight' | 'outline-primary' | 'outline-secondary'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  tooltip?: string
}

interface IconButtonAsButton extends BaseIconButtonProps {
  type?: 'button'
  onClick?: () => void
  href?: never
}

interface IconButtonAsLink extends BaseIconButtonProps {
  type: 'link'
  href: string
  onClick?: never
}

type IconButtonProps = IconButtonAsButton | IconButtonAsLink

export default function IconButton({ 
  children, 
  className = '', 
  onClick,
  variant = 'default',
  size = 'md',
  tooltip,
  type,
  href
}: IconButtonProps) {
  let buttonStyles = 'rounded-xl transition-all duration-300 ';
  
  // Variant styles
  switch (variant) {
    case 'highlight':
      buttonStyles += 'bg-secondary text-white hover:bg-secondary-600 hover:shadow-lg hover:shadow-secondary/50';
      break;
    case 'outline-primary':
      buttonStyles += 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/50';
      break;
    case 'outline-secondary':
      buttonStyles += 'bg-transparent text-secondary border-2 border-secondary hover:bg-secondary hover:text-white hover:shadow-lg hover:shadow-secondary/50';
      break;
      case 'primary':
        buttonStyles += 'bg-primary text-white border-2 border-primary hover:bg-secondary hover:text-white hover:shadow-lg hover:shadow-secondary/50';
        break;
    default: // 'default'
      buttonStyles += 'text-white hover:bg-primary-600 hover:shadow-lg hover:shadow-primary/50';
      break;
  }
  
  // Size styles
  const sizes = {
    sm: 'p-1 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg',
    xl: 'p-4 text-xl'
  };
  
  buttonStyles += ' ' + sizes[size] + ' ' + className;

  const content = type === 'link' && href ? (
    <Link href={href} className={buttonStyles}>
      {children}
    </Link>
  ) : (
    <button 
      className={buttonStyles}
      onClick={onClick}
    >
      {children}
    </button>
  )

  if (tooltip) {
    return <Tooltip text={tooltip}>{content}</Tooltip>
  }

  return content
}