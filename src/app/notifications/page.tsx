
"use client";

import React from 'react';
import AppLayout from '@/components/layout/app-layout';
import NotificationList from '@/components/notifications/notification-list';

export default function NotificationsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <NotificationList />
      </div>
    </AppLayout>
  );
}
