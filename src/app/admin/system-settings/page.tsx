
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme'; // Import useTheme
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Loader2, SlidersHorizontal, Palette, Languages } from 'lucide-react';

export default function SystemSettingsPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Use the theme hook
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
              <SlidersHorizontal className="h-7 w-7 text-primary" />
              System Settings
            </CardTitle>
            <CardDescription>Configure system-wide settings and policies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Settings Section */}
            <div className="space-y-4 p-6 border rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Palette className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Theme Settings</h3>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="dark-mode-toggle" className="flex flex-col space-y-1">
                  <span>Dark Mode</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Enable dark visual theme for the application.
                  </span>
                </Label>
                <Switch
                  id="dark-mode-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                />
              </div>
            </div>
            
            <Separator />

            {/* Placeholder for other settings */}
            <div className="p-6 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Languages className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Language & Other Settings</h3>
              </div>
              <p className="text-muted-foreground">
                More system settings configuration (e.g., defining leave types, overall leave policies, notification preferences, language settings like Hindi support) are under development.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This section will allow administrators to customize various aspects of the CLMS.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
