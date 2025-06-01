"use client";

import React from 'react';
import type { Notification as NotificationType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Mail, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

interface NotificationItemProps {
  notification: NotificationType;
  onMarkAsRead?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'leave_status_update':
        if (notification.message.toLowerCase().includes('approved')) {
          return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        }
        if (notification.message.toLowerCase().includes('rejected')) {
          return <AlertTriangle className="h-5 w-5 text-red-500" />;
        }
        return <Mail className="h-5 w-5 text-primary" />;
      case 'new_leave_request':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'system_message':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <Mail className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 border-b last:border-b-0 hover:bg-accent/50 transition-colors duration-150",
        !notification.read && "bg-primary/5"
      )}
    >
      <div className="shrink-0 mt-1">{getIcon()}</div>
      <div className="flex-grow">
        <p className={cn("text-sm text-foreground", !notification.read && "font-semibold")}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
        </p>
      </div>
      <div className="shrink-0 flex flex-col sm:flex-row items-end sm:items-center gap-2">
        {notification.link && (
          <Link href={notification.link} passHref>
            <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs">
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        )}
        {!notification.read && onMarkAsRead && (
          <Button
            variant="outline"
            size="sm"
            className="h-auto py-1 px-2 text-xs"
            onClick={() => onMarkAsRead(notification.id)}
          >
            Mark as Read
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;