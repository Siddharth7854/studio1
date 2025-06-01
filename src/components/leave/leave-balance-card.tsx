
"use client";

import React from 'react';
import type { LeaveBalance } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WalletCards } from 'lucide-react'; // Using a more generic icon

interface LeaveBalanceCardProps {
  balances: LeaveBalance[];
}

const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ balances }) => {
  if (!balances || balances.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <WalletCards className="h-6 w-6 text-primary" />
            Leave Balances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No leave balance information available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
           <WalletCards className="h-6 w-6 text-primary" />
           Leave Balances
        </CardTitle>
        <CardDescription>Your current available leave balances.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {balances.map((balance) => {
          const percentage = balance.totalAllocated > 0 ? (balance.balance / balance.totalAllocated) * 100 : 0;
          return (
            <div key={balance.leaveTypeId} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{balance.leaveTypeName}</span>
                <span className="text-sm font-semibold text-primary">
                  {balance.balance} / {balance.totalAllocated} days
                </span>
              </div>
              <Progress value={percentage} aria-label={`${balance.leaveTypeName} balance: ${percentage.toFixed(0)}%`} className="h-3" />
              <p className="text-xs text-muted-foreground text-right">{percentage.toFixed(0)}% remaining</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceCard;
