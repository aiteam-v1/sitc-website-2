import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SITC — Sindh Information Technology Company',
  description: 'Official website of Sindh Information Technology Company',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
