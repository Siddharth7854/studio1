
import type { User, LeaveType, LeaveBalance, LeaveRequest, Notification } from '@/types';

export const MOCK_USERS: User[] = [
  { 
    id: '1', 
    employeeId: 'EMP001', 
    name: 'Alice Wonderland', 
    email: 'alice@example.com', 
    isAdmin: false,
    designation: 'Software Engineer',
    profilePhotoUrl: 'https://placehold.co/100x100.png?text=AW',
    password: 'password1'
  },
  { 
    id: '2', 
    employeeId: 'EMP002', 
    name: 'Bob The Builder', 
    email: 'bob@example.com', 
    isAdmin: false,
    designation: 'Project Manager',
    profilePhotoUrl: 'https://placehold.co/100x100.png?text=BB',
    password: 'password2'
  },
  { 
    id: 'admin001', 
    employeeId: 'ADMIN001', 
    name: 'Admin User', 
    email: 'admin@example.com', 
    isAdmin: true,
    designation: 'System Administrator',
    profilePhotoUrl: 'https://placehold.co/100x100.png?text=AU',
    password: 'adminpassword123'
  },
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
    employeeId: '1', // Alice
    employeeName: 'Alice Wonderland',
    leaveTypeId: 'lt1',
    leaveTypeName: 'Casual Leave',
    startDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 9)),
    reason: 'Family event',
    status: 'Approved',
    requestedAt: new Date(new Date().setDate(new Date().getDate() - 15)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 14)),
    approvedBy: 'admin001',
  },
  {
    id: 'lr2',
    employeeId: '2', // Bob
    employeeName: 'Bob The Builder',
    leaveTypeId: 'lt2',
    leaveTypeName: 'Sick Leave',
    startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    reason: 'Feeling unwell',
    status: 'Approved',
    requestedAt: new Date(new Date().setDate(new Date().getDate() - 6)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    approvedBy: 'admin001',
  },
  {
    id: 'lr3',
    employeeId: '1', // Alice
    employeeName: 'Alice Wonderland',
    leaveTypeId: 'lt1',
    leaveTypeName: 'Casual Leave',
    startDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    reason: 'Personal appointment for a couple of days.',
    status: 'Pending',
    requestedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: 'lr4',
    employeeId: '2', // Bob
    employeeName: 'Bob The Builder',
    leaveTypeId: 'lt3',
    leaveTypeName: 'Annual Leave',
    startDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    reason: 'Vacation planning for a short trip.',
    status: 'Pending',
    requestedAt: new Date(new Date().setDate(new Date().getDate() - 0)),
  },
];

export const MOCK_ADMIN_ID = 'admin001'; // Central admin ID for notifications

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif1',
    userId: '1', // For Alice
    message: 'Your leave request for Casual Leave (2 days) has been Approved.',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    read: false,
    link: '/dashboard',
    type: 'leave_status_update',
    relatedRequestId: 'lr1',
  },
  {
    id: 'notif2',
    userId: MOCK_ADMIN_ID, // For Admin
    message: 'System maintenance scheduled for tomorrow at 2 AM.',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    read: true,
    type: 'system_message',
  },
  {
    id: 'notif3',
    userId: '1', // For Alice
    message: 'Your Sick Leave request has been Rejected due to insufficient documentation.',
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
    read: false,
    link: '/dashboard',
    type: 'leave_status_update',
    relatedRequestId: 'lr-rejected-example' // Hypothetical rejected request ID
  },
  {
    id: 'notif4',
    userId: MOCK_ADMIN_ID, // For Admin
    message: `New leave request from Alice Wonderland for Casual Leave.`,
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    read: false,
    link: '/admin/manage-leave',
    type: 'new_leave_request',
    relatedRequestId: 'lr3',
  },
  {
    id: 'notif5',
    userId: MOCK_ADMIN_ID, // For Admin
    message: `New leave request from Bob The Builder for Annual Leave.`,
    date: new Date(new Date().setDate(new Date().getDate() - 0)),
    read: true,
    link: '/admin/manage-leave',
    type: 'new_leave_request',
    relatedRequestId: 'lr4',
  }
];
