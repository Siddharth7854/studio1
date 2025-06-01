
"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useLeave } from '@/contexts/leave-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, LogOut, Bell, Settings as SettingsIcon } from 'lucide-react'; // Renamed Settings to SettingsIcon
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { getUnreadNotificationCount, isLoading: leaveLoading } = useLeave();
  const isMobile = useIsMobile();
  const router = useRouter();

  const unreadCount = user && !leaveLoading ? getUnreadNotificationCount(user.id) : 0;

  const getInitials = (name: string = "") => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() || '';
    return (names[0][0]?.toUpperCase() || '') + (names[names.length - 1][0]?.toUpperCase() || '');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };
  
  const handleSettingsClick = () => {
    router.push('/settings'); // Changed to navigate to /settings
  };


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
           <SidebarTrigger className="md:hidden" />
          {!isMobile && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image 
                src="https://placehold.co/28x28.png" 
                alt="CLMS BUIDCO Logo" 
                width={28} 
                height={28}
                data-ai-hint="logo buidco" 
              />
              <span className="text-xl font-semibold text-primary">CLMS BUIDCO</span>
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/notifications" passHref>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profilePhotoUrl || `https://placehold.co/100x100.png?text=${getInitials(user.name)}`} alt={user.name || "User"} data-ai-hint="avatar person" />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.employeeId}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
