import { RootLayout } from '@/components/layout/RootLayout'
import type { Metadata } from 'next'
import '@/styles/main.scss'

export const metadata: Metadata = {
  title: 'ایرانچه | اولین و بزرگترین مجتمع تجاری آنلاین ایران',
  description: 'مجتمع تجاری آنلاین ایرانچه',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayout>{children}</RootLayout>
}