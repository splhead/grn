import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Giro Radar Notícias',
  description: 'Informação com responsabilidade. Compromisso com a verdade.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  return (
    <html lang="pt-BR" className="h-full bg-[#030305] antialiased">
      {adsenseClient ? (
        <Script
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="afterInteractive"
        />
      ) : null}
      <body className="flex min-h-full flex-col bg-[radial-gradient(circle_at_top_left,rgba(227,24,55,0.34),transparent_28rem),radial-gradient(circle_at_bottom_right,rgba(255,204,0,0.16),transparent_22rem),linear-gradient(135deg,#030305_0%,#0a0a0d_48%,#170406_100%)] text-white">
        {children}
      </body>
    </html>
  )
}
