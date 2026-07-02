import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/authContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#14532d',
};

export const metadata: Metadata = {
  title: 'UniBoard — Find Student Accommodation Near Your University',
  description:
    'UniBoard connects students with verified boarding houses, hostels, and rental rooms near universities. Search, compare, and book your perfect student home.',
  icons: {
    icon: [{ url: '/assets/images/app_logo.png', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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

      </body>
    </html>
  );
}