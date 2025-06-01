
"use client";

import React, { useState, useMemo } from 'react';
import type { LeaveRequest, LeaveRequestStatus } from '@/types';
import { useLeave } from '@/contexts/leave-context';
import { useAuth } from '@/hooks/use-auth';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format, differenceInDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle, XCircle, Clock, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { MOCK_USERS } from '@/lib/mock-data';

const getStatusVariant = (status: LeaveRequest['status']) => {
  switch (status) {
    case 'Approved':
      return 'default'; 
    case 'Rejected':
      return 'destructive';
    case 'Pending':
      return 'secondary';
    default:
      return 'outline';
  }
};

const ManageLeaveTable: React.FC = () => {
  const { user } = useAuth();
  const { 
    leaveRequests: allLeaveRequests, // Get all leave requests from context
    updateLeaveRequestStatus, 
    isLoading: leaveContextLoading 
  } = useLeave();
  const { toast } = useToast();

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | null>(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedRequests = useMemo(() => {
    return [...allLeaveRequests].sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }, [allLeaveRequests]);

  const pendingRequests = useMemo(() => {
    return sortedRequests.filter(req => req.status === 'Pending');
  }, [sortedRequests]);

  const processedRequests = useMemo(() => {
    return sortedRequests.filter(req => req.status !== 'Pending');
  }, [sortedRequests]);

  const openActionDialog = (request: LeaveRequest, type: 'Approve' | 'Reject') => {
    setSelectedRequest(request);
    setActionType(type);
    setAdminRemarks(request.adminRemarks || '');
  };

  const handleActionSubmit = async () => {
    if (!selectedRequest || !actionType || !user?.isAdmin) return;

    setIsSubmitting(true);
    const result = await updateLeaveRequestStatus(selectedRequest.id, actionType, adminRemarks);

    if (result.success) {
      toast({
        title: `Request ${actionType === 'Approve' ? 'Approved' : 'Rejected'}`,
        description: result.message,
      });
      // No need to manually fetchRequests, context update will re-render
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
    setSelectedRequest(null);
    setActionType(null);
    setAdminRemarks('');
  };
  
  if (leaveContextLoading) { // Only rely on context loading state for initial data
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            Loading Leave Requests...
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center p-8">
          <p className="text-muted-foreground">Fetching leave data, please wait.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-headline">
              <ClipboardList className="h-6 w-6 text-primary" />
              Pending Leave Approvals
            </CardTitle>
            <CardDescription>Review and act on pending leave requests.</CardDescription>
          </div>
          {/* Refresh button can be added back if a hard refresh mechanism is needed beyond context updates */}
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
             <p className="text-muted-foreground py-4 text-center">No pending leave requests at the moment.</p>
          ) : (
            <Table>
              <TableCaption>A list of pending leave requests requiring action.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.employeeName}<br/><span className="text-xs text-muted-foreground">{request.employeeId}</span></TableCell>
                    <TableCell>{request.leaveTypeName}</TableCell>
                    <TableCell>
                      {format(new Date(request.startDate), 'MMM dd, yyyy')} - <br/>
                      {format(new Date(request.endDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{differenceInDays(new Date(request.endDate), new Date(request.startDate)) + 1} day(s)</TableCell>
                    <TableCell className="max-w-xs truncate" title={request.reason}>{request.reason}</TableCell>
                    <TableCell>{format(new Date(request.requestedAt), 'MMM dd, hh:mm a')}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => openActionDialog(request, 'Approve')}>
                        <CheckCircle className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => openActionDialog(request, 'Reject')}>
                        <XCircle className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {processedRequests.length > 0 && (
        <Card className="mt-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-headline">
              <Clock className="h-6 w-6 text-muted-foreground" />
              Processed Leave Requests
            </CardTitle>
            <CardDescription>History of approved and rejected leave requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of already processed leave requests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processed By</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.employeeName}</TableCell>
                    <TableCell>{request.leaveTypeName}</TableCell>
                    <TableCell>
                      {format(new Date(request.startDate), 'MMM dd, yyyy')} - {format(new Date(request.endDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                    </TableCell>
                     <TableCell>{request.approvedBy ? (MOCK_USERS.find(u => u.id === request.approvedBy)?.name || 'N/A') : 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={request.adminRemarks}>{request.adminRemarks || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}


      {selectedRequest && actionType && (
        <AlertDialog open={!!selectedRequest} onOpenChange={(isOpen) => {
          if (!isOpen && !isSubmitting) {
            setSelectedRequest(null);
            setActionType(null);
            setAdminRemarks('');
          }
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm {actionType} Request</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to {actionType?.toLowerCase()} the leave request for <strong>{selectedRequest.employeeName}</strong> from <br />
                {format(new Date(selectedRequest.startDate), 'PPP')} to {format(new Date(selectedRequest.endDate), 'PPP')} ({differenceInDays(new Date(selectedRequest.endDate), new Date(selectedRequest.startDate)) + 1} day(s)).
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-2 py-2"> {/* Moved remarks div here and adjusted spacing */}
              <Label htmlFor="adminRemarks">Admin Remarks (Optional)</Label>
              <Textarea 
                id="adminRemarks"
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Add remarks for the employee..."
              />
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleActionSubmit} disabled={isSubmitting} className={actionType === 'Approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (actionType === 'Approve' ? <CheckCircle className="mr-2 h-4 w-4"/> : <XCircle className="mr-2 h-4 w-4"/>)}
                {isSubmitting ? 'Processing...' : `Confirm ${actionType}`}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default ManageLeaveTable;


    