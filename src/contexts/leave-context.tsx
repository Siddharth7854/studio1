
"use client";

import type { LeaveRequest, Notification, User, LeaveRequestStatus } from '@/types';
import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { MOCK_LEAVE_REQUESTS, MOCK_NOTIFICATIONS, MOCK_USERS, MOCK_ADMIN_ID } from '@/lib/mock-data';
import { useAuth } from '@/hooks/use-auth';
import { format, differenceInDays } from 'date-fns';

const LEAVE_REQUESTS_STORAGE_KEY = 'leavePilotLeaveRequests';
const NOTIFICATIONS_STORAGE_KEY = 'leavePilotNotifications';

interface LeaveContextType {
  leaveRequests: LeaveRequest[];
  notifications: Notification[];
  submitLeaveRequest: (newRequestData: Omit<LeaveRequest, 'id' | 'employeeId' | 'employeeName' | 'requestedAt' | 'status'>) => Promise<{ success: boolean; message: string }>;
  getLeaveRequestsForAdmin: () => LeaveRequest[];
  getLeaveRequestsForUser: (employeeId: string) => LeaveRequest[];
  updateLeaveRequestStatus: (requestId: string, newStatus: LeaveRequestStatus, adminRemarks?: string) => Promise<{ success: boolean; message: string }>;
  getNotificationsForUser: (userId: string) => Notification[];
  getUnreadNotificationCount: (userId: string) => number;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  isLoading: boolean;
}

export const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const LeaveProvider = ({ children }: { children: ReactNode }) => {
  const { user, sessionUsers } = useAuth(); // sessionUsers from AuthContext
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Load leave requests
    const storedLeaveRequests = localStorage.getItem(LEAVE_REQUESTS_STORAGE_KEY);
    if (storedLeaveRequests) {
      try {
        // Dates need to be parsed from string to Date objects
        const parsedRequests = JSON.parse(storedLeaveRequests).map((req: any) => ({
          ...req,
          startDate: new Date(req.startDate),
          endDate: new Date(req.endDate),
          requestedAt: new Date(req.requestedAt),
          updatedAt: req.updatedAt ? new Date(req.updatedAt) : undefined,
        }));
        setLeaveRequests(parsedRequests);
      } catch (error) {
        console.error("Failed to parse leave requests from localStorage", error);
        setLeaveRequests(MOCK_LEAVE_REQUESTS);
        localStorage.setItem(LEAVE_REQUESTS_STORAGE_KEY, JSON.stringify(MOCK_LEAVE_REQUESTS));
      }
    } else {
      setLeaveRequests(MOCK_LEAVE_REQUESTS);
      localStorage.setItem(LEAVE_REQUESTS_STORAGE_KEY, JSON.stringify(MOCK_LEAVE_REQUESTS));
    }

    // Load notifications
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications).map((notif: any) => ({
          ...notif,
          date: new Date(notif.date),
        }));
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error("Failed to parse notifications from localStorage", error);
        setNotifications(MOCK_NOTIFICATIONS);
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
      }
    } else {
      setNotifications(MOCK_NOTIFICATIONS);
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
    }
    setIsLoading(false);
  }, []);

  const saveLeaveRequests = useCallback((updatedRequests: LeaveRequest[]) => {
    setLeaveRequests(updatedRequests);
    localStorage.setItem(LEAVE_REQUESTS_STORAGE_KEY, JSON.stringify(updatedRequests));
  }, []);

  const saveNotifications = useCallback((updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
  }, []);

  const submitLeaveRequest = async (newRequestData: Omit<LeaveRequest, 'id' | 'employeeId' | 'employeeName' | 'requestedAt' | 'status'>): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: "User not authenticated." };

    const newRequestId = `lr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullRequest: LeaveRequest = {
      ...newRequestData,
      id: newRequestId,
      employeeId: user.id,
      employeeName: user.name,
      requestedAt: new Date(),
      status: 'Pending',
    };

    const updatedRequests = [...leaveRequests, fullRequest];
    saveLeaveRequests(updatedRequests);

    // Create notifications for all admin users
    const adminUsers = sessionUsers.filter(u => u.isAdmin);
    const newAdminNotifications: Notification[] = adminUsers.map(admin => ({
      id: `notif-admin-${Date.now()}-${Math.random().toString(36).substr(2, 5)}-${admin.id}`,
      userId: admin.id,
      message: `New leave request from ${user.name} for ${fullRequest.leaveTypeName}.`,
      date: new Date(),
      read: false,
      link: '/admin/manage-leave',
      type: 'new_leave_request',
      relatedRequestId: newRequestId,
    }));
    
    saveNotifications([...notifications, ...newAdminNotifications]);

    return { success: true, message: "Leave request submitted successfully." };
  };

  const getLeaveRequestsForAdmin = () => {
    // Returns all requests; admin page can filter by status
    return [...leaveRequests].sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  };
  
  const getLeaveRequestsForUser = (employeeId: string) => {
     return leaveRequests.filter(req => req.employeeId === employeeId).sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  };

  const updateLeaveRequestStatus = async (requestId: string, newStatus: LeaveRequestStatus, adminRemarks?: string): Promise<{ success: boolean; message: string }> => {
    if (!user || !user.isAdmin) return { success: false, message: "Unauthorized action."};

    const requestIndex = leaveRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return { success: false, message: "Leave request not found." };

    const originalRequest = leaveRequests[requestIndex];
    const updatedRequest: LeaveRequest = {
      ...originalRequest,
      status: newStatus,
      updatedAt: new Date(),
      approvedBy: user.id, // ID of admin taking action
      adminRemarks: adminRemarks,
    };

    const updatedRequests = [...leaveRequests];
    updatedRequests[requestIndex] = updatedRequest;
    saveLeaveRequests(updatedRequests);

    // Create notification for the employee
    const duration = differenceInDays(originalRequest.endDate, originalRequest.startDate) + 1;
    const employeeNotification: Notification = {
      id: `notif-emp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: originalRequest.employeeId,
      message: `Your ${originalRequest.leaveTypeName} request (${duration} day(s), ${format(originalRequest.startDate, 'MMM dd')} - ${format(originalRequest.endDate, 'MMM dd')}) has been ${newStatus}. ${adminRemarks ? `Admin remarks: ${adminRemarks}` : ''}`.trim(),
      date: new Date(),
      read: false,
      link: '/dashboard', // Or specific link to view the request
      type: 'leave_status_update',
      relatedRequestId: requestId,
    };
    saveNotifications([...notifications, employeeNotification]);

    return { success: true, message: `Leave request ${newStatus.toLowerCase()}.` };
  };
  
  const getNotificationsForUser = (userId: string) => {
    return notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getUnreadNotificationCount = (userId: string) => {
    return notifications.filter(n => n.userId === userId && !n.read).length;
  };

  const markNotificationAsRead = (notificationId: string) => {
    const notifIndex = notifications.findIndex(n => n.id === notificationId);
    if (notifIndex !== -1 && !notifications[notifIndex].read) {
      const updatedNotifications = [...notifications];
      updatedNotifications[notifIndex] = { ...updatedNotifications[notifIndex], read: true };
      saveNotifications(updatedNotifications);
    }
  };

  const markAllNotificationsAsRead = (userId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.userId === userId ? { ...n, read: true } : n
    );
    saveNotifications(updatedNotifications);
  };

  return (
    <LeaveContext.Provider value={{ 
      leaveRequests, 
      notifications,
      submitLeaveRequest,
      getLeaveRequestsForAdmin,
      getLeaveRequestsForUser,
      updateLeaveRequestStatus,
      getNotificationsForUser,
      getUnreadNotificationCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      isLoading
    }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return