import React from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/authContext';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { QueryProvider } from '@/components/ui/QueryProvider';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#14532d' },
    { media: '(prefers-color-scheme: dark)', color: '#042f2e' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'UniBoard - Find Student Accommodation Near Your University',
    template: '%s | UniBoard',
  },
  description:
    'UniBoard connects students with verified boarding houses, hostels, and rental rooms near Zambian universities. Search, compare, and book your perfect student home.',
  keywords: [
    'student accommodation Zambia',
    'university housing Zambia',
    'UNZA accommodation',
    'CBU hostels',
    'MUKUBA student housing',
    'Mulungushi University accommodation',
    'verified student housing',
    'Zambian student hostels',
    'bedspace Zambia',
    'student rentals Zambia',
  ],
  authors: [{ name: 'UniBoard', url: 'https://uniboard.zm' }],
  creator: 'UniBoard',
  publisher: 'UniBoard',
  metadataBase: new URL('https://uniboard.zm'),
  openGraph: {
    type: 'website',
    locale: 'en_ZM',
    siteName: 'UniBoard',
    title: 'UniBoard - Find Student Accommodation Near Your University',
    description:
      'UniBoard connects students with verified boarding houses, hostels, and rental rooms near Zambian universities.',
    images: [
      {
        url: '/assets/images/app_logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'UniBoard Student Accommodation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UniBoard - Student Accommodation',
    description:
      'Find verified student accommodation near Zambian universities.',
    images: ['/assets/images/app_logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/assets/images/app_logo.jpeg', type: 'image/jpeg', sizes: '32x32' },
    ],
    apple: [
      { url: '/assets/images/app_logo.jpeg', sizes: '180x180', type: 'image/jpeg' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('uniboard_theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            storageKey="uniboard_theme"
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
            </AuthProvider>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  fontFamily: 'DM Sans, sans-serif',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                },
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
