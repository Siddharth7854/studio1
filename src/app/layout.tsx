
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { LeaveProvider } from '@/contexts/leave-context';
import { ThemeProvider } from '@/contexts/theme-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head />
      <body className="font-body antialiased">
        <ThemeProvider>
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
