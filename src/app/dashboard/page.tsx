
"use client";

import React, { use } from 'react'; // Import use
import AppLayout from '@/components/layout/app-layout';
import LeaveBalanceCard from '@/components/leave/leave-balance-card';
import LeaveHistoryTable from '@/components/leave/leave-history-table';
import { MOCK_INITIAL_LEAVE_BALANCES, MOCK_LEAVE_REQUESTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

// If this page were to receive searchParams as a prop from a Server Component:
interface DashboardPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const { user } = useAuth();
  // In a real app, fetch this data based on the logged-in user
  const leaveBalances = MOCK_INITIAL_LEAVE_BALANCES;
  const leaveRequests = MOCK_LEAVE_REQUESTS;

  // If searchParams were passed as a prop and you needed to iterate or access keys directly,
  // Next.js suggests unwrapping with React.use().
  // const unwrappedSearchParams = searchParams ? use(searchParams) : {};
  // Example usage (though useSearchParams hook is generally preferred in client components):
  // if (unwrappedSearchParams && Object.keys(unwrappedSearchParams).length > 0) {
  //   console.log("Dashboard searchParams:", unwrappedSearchParams);
  // }
  // For client components, prefer using the useSearchParams hook from 'next/navigation'
  // e.g., import { useSearchParams } from 'next/navigation'; const searchParamsHook = useSearchParams();

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
            <LeaveHistoryTable requests={leaveRequests} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
