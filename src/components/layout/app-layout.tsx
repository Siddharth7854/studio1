
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Navbar from '@/components/layout/navbar';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, CalendarPlus, Bell, UserPlus, ClipboardList, LogOut, UserCircle, Settings as SettingsIcon, ListChecks } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
import { Badge } from '@/components/ui/badge';
import { useLeave } from '@/contexts/leave-context';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { getUnreadNotificationCount, isLoading: leaveLoading } = useLeave();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

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
    router.push('/settings');
  };

  const unreadCount = user && !leaveLoading ? getUnreadNotificationCount(user.id) : 0;

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <Image 
            src="https://placehold.co/64x64.png" 
            alt="CLMS BUIDCO Logo" 
            width={64} 
            height={64} 
            className="animate-pulse"
            data-ai-hint="logo buidco" 
          />
          <p className="mt-4 text-lg font-medium text-foreground">Loading CLMS BUIDCO...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="bg-card border-r flex flex-col" collapsible="icon">
        <div className="p-4 flex items-center gap-2 border-b">
            <Image 
              src="https://placehold.co/32x32.png" 
              alt="CLMS BUIDCO Logo" 
              width={32} 
              height={32}
              data-ai-hint="logo buidco" 
            />
            <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">CLMS BUIDCO</h1>
        </div>
        <SidebarContent className="flex-grow">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Dashboard" isActive={router.pathname === '/dashboard'}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/request-leave" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Request Leave" isActive={router.pathname === '/request-leave'}>
                  <CalendarPlus />
                  <span>Request Leave</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {user?.isAdmin && (
              <>
                <SidebarMenuItem>
                  <Link href="/admin/create-employee" passHref legacyBehavior>
                    <SidebarMenuButton tooltip="Create Employee" isActive={router.pathname === '/admin/create-employee'}>
                      <UserPlus />
                      <span>Create Employee</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/manage-leave" passHref legacyBehavior>
                    <SidebarMenuButton tooltip="Manage Leave" isActive={router.pathname === '/admin/manage-leave'}>
                      <ClipboardList />
                      <span>Manage Leave</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/employee-leave-overview" passHref legacyBehavior>
                    <SidebarMenuButton tooltip="Employee Leave Overview" isActive={router.pathname === '/admin/employee-leave-overview'}>
                      <ListChecks />
                      <span>Employee Leaves</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>

        {/* Footer section for Notifications and User Profile */}
        <div className="mt-auto border-t border-sidebar-border p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/notifications" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Notifications" isActive={router.pathname === '/notifications'} className="relative">
                  <Bell />
                  <span className="group-data-[collapsible=icon]:hidden">Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center text-xs group-data-[collapsible=icon]:top-0 group-data-[collapsible=icon]:right-0">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {user && (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={user.name || "Profile"} 
                    className="justify-start w-full !h-auto py-2" 
                  >
                    <Avatar className="h-7 w-7 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6">
                      <AvatarImage src={user.profilePhotoUrl || `https://placehold.co/100x100.png?text=${getInitials(user.name)}`} alt={user.name || "User"} data-ai-hint="avatar person" />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2 flex flex-col items-start group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-medium leading-none">{user.name}</span>
                      <span className="text-xs leading-none text-muted-foreground group-data-[collapsible=icon]:hidden">
                        {user.employeeId}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56 mb-1 ml-1">
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
            </SidebarMenuItem>
            )}
          </SidebarMenu>
        </div>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
