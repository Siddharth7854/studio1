
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Briefcase } from 'lucide-react';

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
        <Briefcase className="h-20 w-20 text-primary animate-pulse" />
        <p className="mt-6 text-2xl font-semibold text-primary">LeavePilot</p>
        <p className="mt-2 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
