
"use client";

import React, { use } from 'react'; 
import AppLayout from '@/components/layout/app-layout';
import LeaveBalanceCard from '@/components/leave/leave-balance-card';
import LeaveHistoryTable from '@/components/leave/leave-history-table';
import { MOCK_LEAVE_REQUESTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLeave } from '@/contexts/leave-context';


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
              Here's an overview of your leave status.
            </p>
          </div>
          <Link href="/request-leave" passHref>
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <PlusCircle className="mr-2 h-5 w-5" />
              Request New Leave
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <LeaveBalanceCard balances={leaveBalances} />
          </div>
          <div className="lg:col-span-2">
             {leaveLoading ? (
              <p className="text-muted-foreground">Loading leave history...</p>
            ) : (
              <LeaveHistoryTable requests={leaveRequests} />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

    