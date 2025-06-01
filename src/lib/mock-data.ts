import type { User, LeaveType, LeaveBalance, LeaveRequest, Notification } from '@/types';

export const MOCK_USERS: User[] = [
  { id: '1', employeeId: 'EMP001', name: 'Alice Wonderland', email: 'alice@example.com', isAdmin: false },
  { id: '2', employeeId: 'EMP002', name: 'Bob The Builder', email: 'bob@example.com', isAdmin: false },
  { id: 'admin001', employeeId: 'ADMIN001', name: 'Admin User', email: 'admin@example.com', isAdmin: true }, // Added Admin User
];

export const MOCK_LEAVE_TYPES: LeaveType[] = [
  { id: 'lt1', name: 'Casual Leave' },
  { id: 'lt2', name: 'Sick Leave' },
  { id: 'lt3', name: 'Annual Leave' },
  { id: 'lt4', name: 'Unpaid Leave' },
];

export const MOCK_INITIAL_LEAVE_BALANCES: LeaveBalance[] = [
  { leaveTypeId: 'lt1', leaveTypeName: 'Casual Leave', balance: 10, totalAllocated: 12 },
  { leaveTypeId: 'lt2', leaveTypeName: 'Sick Leave', balance: 7, totalAllocated: 10 },
  { leaveTypeId: 'lt3', leaveTypeName: 'Annual Leave', balance: 15, totalAllocated: 20 },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr1',
    leaveTypeId: 'lt1',
    leaveTypeName: 'Casual Leave',
    startDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 9)),
    reason: 'Family event',
    status: 'Approved',
    requestedAt: new Date(new Date().setDate(new Date().getDate() - 15)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 14)),
  },
  {
    id: 'lr2',
    leaveTypeId: 'lt2',
    leaveTypeName: 'Sick Leave',
    startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    reason: 'Feeling unwell',
    status: 'Approved',
    requestedAt: new Date(new Date().setDate(new Date().getDate() - 6)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    id: 'lr3',
    leaveTypeId: 'lt1',
    leaveTypeName: 'Casual Leave',
    startDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    reason: 'Personal appointment',
    status: 'Pending',
    requestedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif1',
    message: 'Your leave request for Casual Leave (2 days) has been Approved.',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    read: false,
    link: '/dashboard'
  },
  {
    id: 'notif2',
    message: 'System maintenance scheduled for tomorrow at 2 AM.',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    read: true,
  },
  {
    id: 'notif3',
    message: 'Your Sick Leave request has been Rejected due to insufficient documentation.',
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
    read: false,
    link: '/dashboard'
  },
];

