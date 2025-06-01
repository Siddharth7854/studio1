
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Navbar from '@/components/layout/navbar';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, CalendarPlus, Bell, UserPlus, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

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
      <Sidebar className="bg-card border-r" collapsible="icon">
        {/* SidebarHeader is part of Sidebar in the new version. */}
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
        <SidebarContent>
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
            <SidebarMenuItem>
              <Link href="/notifications" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Notifications" isActive={router.pathname === '/notifications'}>
                  <Bell />
                  <span>Notifications</span>
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
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
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
