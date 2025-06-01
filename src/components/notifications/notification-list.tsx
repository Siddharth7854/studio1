
"use client";

import React, { useState, useEffect } from 'react';
import type { Notification as NotificationType } from '@/types';
import NotificationItem from './notification-item';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data'; // Using mock data for now
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, CheckCheck } from 'lucide-react';

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // Simulate fetching notifications
    setNotifications(MOCK_NOTIFICATIONS.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    // In a real app, also update backend
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
     // In a real app, also update backend
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'unread' ? !n.read : true
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <BellRing className="h-7 w-7 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Stay updated with your leave requests and system alerts.</CardDescription>
          </div>
           {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
            </Button>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
            All ({notifications.length})
          </Button>
          <Button variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')}>
            Unread ({unreadCount})
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y">
            {filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            {filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationList;
