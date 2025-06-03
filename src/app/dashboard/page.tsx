
"use client";

import React from 'react'; 
import AppLayout from '@/components/layout/app-layout';
import LeaveBalanceCard from '@/components/leave/leave-balance-card';
import LeaveHistoryTable from '@/components/leave/leave-history-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ClipboardList, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLeave } from '@/contexts/leave-context';
import { cn } from '@/lib/utils';


interface DashboardPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const { user } = useAuth();
  const { getLeaveRequestsForUser, isLoading: leaveLoading } = useLeave();


  const leaveBalances = user?.leaveBalances || [];
  const leaveRequests = user ? getLeaveRequestsForUser(user.id) : [];


  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Welcome, {user?.name || 'Employee'}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your leave status and actions.
            </p>
          </div>
          {/* "Request New Leave" button removed from here */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <LeaveBalanceCard balances={leaveBalances} />
          </div>
          <div className="lg:col-span-2 space-y-8">
            {user?.isAdmin && (
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-headline">
                    <ClipboardList className="h-6 w-6 text-primary" />
                    Manage Leave Requests
                  </CardTitle>
                  <CardDescription>Approve or reject employee leave applications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/manage-leave" passHref>
                    <Button className="w-full py-3 text-base">
                      Go to Manage Leaves
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
             {leaveLoading ? (
              <Card className="shadow-md"><CardContent className="p-6"><p className="text-muted-foreground text-center">Loading leave history...</p></CardContent></Card>
            ) : (
              <LeaveHistoryTable requests={leaveRequests} />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
