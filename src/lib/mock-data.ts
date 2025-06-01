
import type { User, LeaveType, LeaveBalance, LeaveRequest, Notification } from '@/types';

export const MOCK_LEAVE_TYPES: LeaveType[] = [
  { id: 'lt1', name: 'Casual Leave' },
  { id: 'lt2', name: 'Sick Leave' },
  { id: 'lt3', name: 'Annual Leave' },
  { id: 'lt4', name: 'Unpaid Leave' },
];

const CASUAL_LEAVE_ID = 'lt1';
const CASUAL_LEAVE_NAME = 'Casual Leave';
const SICK_LEAVE_ID = 'lt2';
const SICK_LEAVE_NAME = 'Sick Leave';
const ANNUAL_LEAVE_ID = 'lt3';
const ANNUAL_LEAVE_NAME = 'Annual Leave';
const UNPAID_LEAVE_ID = 'lt4';
const UNPAID_LEAVE_NAME = 'Unpaid Leave';


export const MOCK_USERS: User[] = [
  { 
    id: '1', 
    employeeId: 'EMP001', 
    name: 'Alice Wonderland', 
    email: 'alice@example.com', 
    isAdmin: false,
    designation: 'Software Engineer',
    profilePhotoUrl: 'https://placehold.co/100x100.png?text=AW',
    password: 'password1',
    leaveBalances: [
      { leaveTypeId: CASUAL_LEAVE_ID, leaveTypeName: CASUAL_LEAVE_NAME, balance: 12, totalAllocated: 12 },
      { leaveTypeId: SICK_LEAVE_ID, leaveTypeName: SICK_LEAVE_NAME, balance: 7, totalAllocated: 10 },
      { leaveTypeId: ANNUAL_LEAVE_ID, leaveTypeName: ANNUAL_LEAVE_NAME, balance: 15, totalAllocated: 20 },
      { leaveTypeId: UNPAID_LEAVE_ID, leaveTypeName: UNPAID_LEAVE_NAME, balance: 0, totalAllocated: 5 },
    ]
  },
  { 
    id: '2', 
    employeeId: 'EMP002', 
    name: 'Bob The Builder', 
    email: 'bob@example.com', 
    isAdmin: false,
    designation: 'Project Manager',
    profilePhotoUrl: 'https://placehold.co/100x100.png?text=BB',
    password: 'password2',
    leaveBalances: [
      { leaveTypeId: CASUAL_LEAVE_ID, leaveTypeName: CASUAL_LEAVE_NAME, balance: 12, totalAllocated: 12 },
      { leaveTypeId: SICK_LEAVE_ID, leaveTypeName: SICK_LEAVE_NAME, balance: 9, totalAllocated: 10 },
      { leaveTypeId: ANNUAL_LEAVE_ID, leaveTypeName: ANNUAL_LEAVE_NAME, balance: 12, totalAllocated: 20 },
      { leaveTypeId: UNPAID_LEAVE_ID, leaveTypeName: UNPAID_LEAVE_NAME, balance: 2, totalAllocated: 5 },
    ]
  },
  { 
    id: 'admin001', 
    employeeId: 'ADMIN001', 
    name: 'Admin User', 
    email: 'admin@example.com', 
    isAdmin: true,
    designation: 'System Administrator',
    profilePhotoUrl: 'https://placehold.co/100x100.png?text=AU',
    password: 'adminpassword123',
    leaveBalances: [ 
      { leaveTypeId: CASUAL_LEAVE_ID, leaveTypeName: CASUAL_LEAVE_NAME, balance: 12, totalAllocated: 12 },
      { leaveTypeId: SICK_LEAVE_ID, leaveTypeName: SICK_LEAVE_NAME, balance: 10, totalAllocated: 10 },
      { leaveTypeId: ANNUAL_LEAVE_ID, leaveTypeName: ANNUAL_LEAVE_NAME, balance: 20, totalAllocated: 20 },
      { leaveTypeId: UNPAID_LEAVE_ID, leaveTypeName: UNPAID_LEAVE_NAME, balance: 0, totalAllocated: 5 },
    ]
  },
].map(user => {
  if (!user.leaveBalances) {
    user.leaveBalances = [];
  }
  const clBalance = user.leaveBalances.find(lb => lb.leaveTypeId === CASUAL_LEAVE_ID);
  if (clBalance) {
    clBalance.balance = 12;
    clBalance.totalAllocated = 12;
  } else {
    user.leaveBalances.push({
      leaveTypeId: CASUAL_LEAVE_ID,
      leaveTypeName: CASUAL_LEAVE_NAME,
      balance: 12,
      totalAllocated: 12,
    });
  }
  // Ensure other leave types exist, if not add with some default. This is mostly for consistency.
  // For this update, we are primarily focused on CL as per the request.
  // Other leave types could be initialized here if they are missing for existing users.
  // For example, ensuring Sick Leave exists:
  // if (!user.leaveBalances.find(lb => lb.leaveTypeId === SICK_LEAVE_ID)) {
  //   user.leaveBalances.push({ leaveTypeId: SICK_LEAVE_ID, leaveTypeName: SICK_LEAVE_NAME, balance: 10, totalAllocated: 10 });
  // }
  return user;
});


export const MOCK_INITIAL_LEAVE_BALANCES: LeaveBalance[] = [ 
  { leaveTypeId: CASUAL_LEAVE_ID, leaveTypeName: CASUAL_LEAVE_NAME, balance: 12, totalAllocated: 12 },
  { leaveTypeId: SICK_LEAVE_ID, leaveTypeName: SICK_LEAVE_NAME, balance: 7, totalAllocated: 10 },
  { leaveTypeId: ANNUAL_LEAVE_ID, leaveTypeName: ANNUAL_LEAVE_NAME, balance: 15, totalAllocated: 20 },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr1',
    employeeId: '1', 
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
    employeeId: '2', 
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
    employeeId: '1', 
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
    employeeId: '2', 
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

export const MOCK_ADMIN_ID = 'admin001'; 

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif1',
    userId: '1', 
    message: 'Your leave request for Casual Leave (2 days) has been Approved.',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    read: false,
    link: '/dashboard',
    type: 'leave_status_update',
    relatedRequestId: 'lr1',
  },
  {
    id: 'notif2',
    userId: MOCK_ADMIN_ID, 
    message: 'System maintenance scheduled for tomorrow at 2 AM.',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    read: true,
    type: 'system_message',
  },
  {
    id: 'notif3',
    userId: '1', 
    message: 'Your Sick Leave request has been Rejected due to insufficient documentation.',
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
    read: false,
    link: '/dashboard',
    type: 'leave_status_update',
    relatedRequestId: 'lr-rejected-example' 
  },
  {
    id: 'notif4',
    userId: MOCK_ADMIN_ID, 
    message: `New leave request from Alice Wonderland for Casual Leave.`,
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    read: false,
    link: '/admin/manage-leave',
    type: 'new_leave_request',
    relatedRequestId: 'lr3',
  },
  {
    id: 'notif5',
    userId: MOCK_ADMIN_ID, 
    message: `New leave request from Bob The Builder for Annual Leave.`,
    date: new Date(new Date().setDate(new Date().getDate() - 0)),
    read: true,
    link: '/admin/manage-leave',
    type: 'new_leave_request',
    relatedRequestId: 'lr4',
  }
];

    