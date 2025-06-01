
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { LeaveProvider } from '@/contexts/leave-context';
import { ThemeProvider } from '@/contexts/theme-context'; // Added

// If using next/font, uncomment this and remove the <link> tags in <head>
// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CLMS BUIDCO',
  description: 'Casual Leave Management System for BUIDCO',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider> {/* Added ThemeProvider */}
          <AuthProvider>
            <LeaveProvider>
              {children}
              <Toaster />
            </LeaveProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
