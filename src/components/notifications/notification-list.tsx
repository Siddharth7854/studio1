
"use client";

import React, { useState, useEffect } from 'react';
import type { Notification as NotificationType } from '@/types';
import NotificationItem from './notification-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, CheckCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLeave } from '@/contexts/leave-context';

const NotificationList: React.FC = () => {
  const { user } = useAuth();
  const { 
    notifications: allNotifications, 
    getNotificationsForUser, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    isLoading: leaveContextLoading 
  } = useLeave();
  
  const [displayNotifications, setDisplayNotifications] = useState<NotificationType[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (user && !leaveContextLoading) {
      const userNotifications = getNotificationsForUser(user.id);
      setDisplayNotifications(userNotifications);
    }
  }, [user, allNotifications, getNotificationsForUser, leaveContextLoading]);


  const handleMarkAsRead = (id: string) => {
    if (user) {
      markNotificationAsRead(id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (user) {
      markAllNotificationsAsRead(user.id);
    }
  };

  const filteredNotifications = displayNotifications.filter(n => 
    filter === 'unread' ? !n.read : true
  );

  const unreadCount = displayNotifications.filter(n => !n.read).length;
  const totalCount = displayNotifications.length;

  if (leaveContextLoading || !user) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Loader2 className="h-7 w-7 text-primary animate-spin" />
            Loading Notifications...
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-muted-foreground">
          Please wait while we fetch your notifications.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader className="border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
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
            All ({totalCount})
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
            {filter === 'unread' && totalCount > 0 ? 'No unread notifications.' : 
             filter === 'unread' && totalCount === 0 ? 'No notifications yet.' :
             filter === 'all' && totalCount === 0 ? 'No notifications yet.' : 
             'No notifications match your filter.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
