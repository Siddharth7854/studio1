
"use client";

import React from 'react';
import AppLayout from '@/components/layout/app-layout';
import SettingsForm from '@/components/settings/settings-form';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react'; // Renamed

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <SettingsIcon className="h-7 w-7 text-primary" />
              Account Settings
            </CardTitle>
            <CardDescription>Manage your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
