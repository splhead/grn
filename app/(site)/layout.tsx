import Header from '@/components/header'
import Footer from '@/components/footer'

export const dynamic = 'force-dynamic'

export default function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
