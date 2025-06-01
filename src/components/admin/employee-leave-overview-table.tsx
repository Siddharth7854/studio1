
"use client";

import React, { useState, useMemo } from 'react';
import type { User, LeaveBalance, LeaveType } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { MOCK_LEAVE_TYPES } from '@/lib/mock-data'; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Search, FileSpreadsheet } from 'lucide-react';

const EmployeeLeaveOverviewTable: React.FC = () => {
  const { sessionUsers, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const leaveTypes: LeaveType[] = MOCK_LEAVE_TYPES;

  const filteredUsers = useMemo(() => {
    if (!sessionUsers) return [];
    return sessionUsers.filter(user =>
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.employeeId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [sessionUsers, searchTerm]);

  if (authLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <Users className="h-6 w-6 text-primary" />
            Employee Leave Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center p-8">
          <p className="text-muted-foreground">Loading employee data...</p>
        </CardContent>
      </Card>
    );
  }

  const getBalanceForUser = (userBalances: LeaveBalance[] | undefined, leaveTypeId: string): string => {
    if (!userBalances) return 'N/A';
    const balance = userBalances.find(b => b.leaveTypeId === leaveTypeId);
    return balance ? `${balance.balance}/${balance.totalAllocated}` : '0/0';
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-headline">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              Employee Leave Balances
            </CardTitle>
            <CardDescription>View and search employee leave balances across different types.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredUsers.length === 0 && !authLoading ? (
          <p className="text-muted-foreground py-4 text-center">
            {searchTerm ? 'No employees match your search.' : 'No employee data available.'}
          </p>
        ) : (
          <Table>
            <TableCaption>A list of all employees and their current leave balances.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                {leaveTypes.map(lt => (
                  <TableHead key={lt.id}>{lt.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.employeeId}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  {leaveTypes.map(lt => (
                    <TableCell key={lt.id}>
                      {getBalanceForUser(user.leaveBalances, lt.id)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeLeaveOverviewTable;
