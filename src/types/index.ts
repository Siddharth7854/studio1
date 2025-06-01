
export interface User {
  id: string;
  employeeId: string;
  name: string;
  email?: string;
  isAdmin?: boolean;
  designation?: string;
  profilePhotoUrl?: string;
  password?: string;
}

export interface LeaveType {
  id: string;
  name: string;
}

export interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  balance: number;
  totalAllocated: number;
}

export type LeaveRequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string; // Added
  employeeName: string; // Added
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveRequestStatus;
  requestedAt: Date;
  updatedAt?: Date;
  approvedBy?: string; // Optional: ID of admin who approved/rejected
  adminRemarks?: string; // Optional: Remarks from admin
}

export type NotificationType = 'new_leave_request' | 'leave_status_update' | 'system_message';

export interface Notification {
  id: string;
  userId: string; // Added: To whom this notification belongs
  message: string;
  date: Date;
  read: boolean;
  link?: string;
  type?: NotificationType; // Optional: to categorize notifications
  relatedRequestId?: string; // Optional: link to a leave request
}