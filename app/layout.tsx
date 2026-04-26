import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Cotillón Cienfuegos Concordia',
  description: 'Tu tienda de cotillón, disfraces y artículos de fiesta en Concordia, Entre Ríos. Globos, cotillón, disfraces y mucho más.',
  keywords: 'cotillón, concordia, entre ríos, disfraces, globos, artículos de fiesta, cumpleaños',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
