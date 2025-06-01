
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <Image 
          src="https://placehold.co/80x80.png" 
          alt="CLMS BUIDCO Logo" 
          width={80} 
          height={80} 
          className="animate-pulse"
          data-ai-hint="logo buidco" 
        />
        <p className="mt-6 text-2xl font-semibold text-primary">CLMS BUIDCO</p>
        <p className="mt-2 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
