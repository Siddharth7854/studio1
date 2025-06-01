
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Loader2, LifeBuoy } from 'lucide-react';

export default function SupportTroubleshootingPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, authLoading, router]);

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p className="text-muted-foreground">Loading admin page...</p>
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
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
                You do not have permission to access this page. Redirecting...
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <LifeBuoy className="h-7 w-7 text-primary" />
              Support & Troubleshooting
            </CardTitle>
            <CardDescription>Assist users with issues and troubleshoot system problems.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                This section is intended for administrators to manage support requests and troubleshoot system issues.
              </p>
              <ul className="list-disc list-inside mt-4 text-sm text-muted-foreground space-y-1">
                <li>View system logs (Feature planned)</li>
                <li>Manage user-reported issues (Feature planned)</li>
                <li>Access diagnostic tools (Feature planned)</li>
              </ul>
               <p className="text-sm text-muted-foreground mt-4">
                For urgent support, please contact the technical team directly at <a href="mailto:techsupport@example.com" className="text-primary underline">techsupport@example.com</a>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
