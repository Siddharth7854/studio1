
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/app-layout';
import LeaveRequestForm from '@/components/leave/leave-request-form';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function RequestLeavePage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAdmin) {
      router.replace('/admin/manage-leave'); // Redirect admins
    }
  }, [isAdmin, authLoading, router]);

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p className="text-muted-foreground">Loading page...</p>
        </div>
      </AppLayout>
    );
  }

  if (isAdmin) {
    // This check is mostly for client-side redirect visual, useEffect handles actual redirect
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <Card className="w-full max-w-md text-center shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-destructive">
                <AlertTriangle className="h-8 w-8" />
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Administrators cannot request leave. Redirecting...
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <LeaveRequestForm />
      </div>
    </AppLayout>
  );
}
