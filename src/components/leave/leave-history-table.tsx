
"use client";

import React from 'react';
import type { LeaveRequest } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

interface LeaveHistoryTableProps {
  requests: LeaveRequest[];
}

const getStatusVariant = (status: LeaveRequest['status']) => {
  switch (status) {
    case 'Approved':
      return 'default'; // default is usually primary color based
    case 'Rejected':
      return 'destructive';
    case 'Pending':
      return 'secondary';
    default:
      return 'outline';
  }
};

const LeaveHistoryTable: React.FC<LeaveHistoryTableProps> = ({ requests }) => {
  if (!requests || requests.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <History className="h-6 w-6 text-primary" />
            Leave History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You have no past leave requests.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <History className="h-6 w-6 text-primary" />
          Leave History
        </CardTitle>
        <CardDescription>A record of your past leave applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent leave requests.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Leave Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.leaveTypeName}</TableCell>
                <TableCell>{format(new Date(request.startDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{format(new Date(request.endDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="max-w-xs truncate" title={request.reason}>
                  {request.reason}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaveHistoryTable;
