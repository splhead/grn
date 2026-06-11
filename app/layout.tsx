import type { Metadata } from 'next'
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
  return (
    <html lang="pt-BR" className="h-full bg-[#030305] antialiased">
      <body className="flex min-h-full flex-col bg-[radial-gradient(circle_at_top_left,rgba(227,24,55,0.34),transparent_28rem),radial-gradient(circle_at_bottom_right,rgba(255,204,0,0.16),transparent_22rem),linear-gradient(135deg,#030305_0%,#0a0a0d_48%,#170406_100%)] text-white">
        {children}
      </body>
    </html>
  )
}
