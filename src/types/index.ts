
export interface User {
  id: string;
  employeeId: string;
  name: string;
  email?: string;
  // password will not be stored in frontend user object
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
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveRequestStatus;
  requestedAt: Date;
  updatedAt?: Date;
}

export interface Notification {
  id: string;
  message: string;
  date: Date;
  read: boolean;
  link?: string;
}
