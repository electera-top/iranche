import { Providers } from '../providers/Providers'
import { TopBarLoader } from '@/components/common/TopBarLoader'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className="theme-default">
      <body>
        <TopBarLoader />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}