"use client";

import Image from 'next/image'

interface LogoProps {
  className?: string
  small?: boolean
}

export default function Logo({ className = '', small = false }: LogoProps) {
  return (
    <div className={className}>
      <Image
        src="/images/full-logo-white.png"
        alt="لوگو"
        width={small ? 80 : 180}
        height={small ? 28 : 100}
        className={`object-contain w-auto ${small ? 'h-[24px]' : 'h-[52px]'}`}
        priority
        quality={100}
      />
    </div>
  )
} 