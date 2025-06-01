
"use client";

import type { User } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_USERS } from '@/lib/mock-data';
import { useRouter } from 'next/navigation'; 

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (employeeId: string, password?: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean; // Added isAdmin convenience flag
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, store sensitive credentials like ADMIN_PASSWORD in environment variables
const ADMIN_EMPLOYEE_ID = 'ADMIN001';
const ADMIN_PASSWORD = 'adminpassword123';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('leavePilotUser');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('leavePilotUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (employeeId: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    let foundUser: User | undefined;

    if (employeeId === ADMIN_EMPLOYEE_ID) {
      if (password === ADMIN_PASSWORD) {
        foundUser = MOCK_USERS.find(u => u.employeeId === ADMIN_EMPLOYEE_ID && u.isAdmin);
      } else {
        // Admin ID provided, but password incorrect
        setIsLoading(false);
        return false; 
      }
    } else {
      // For non-admin users, find them by employeeId (password check is mocked for them)
      foundUser = MOCK_USERS.find(u => u.employeeId === employeeId && !u.isAdmin);
    }

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('leavePilotUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('leavePilotUser');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, isAdmin: !!user?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
