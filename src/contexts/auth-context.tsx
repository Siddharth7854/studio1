
"use client";

import type { User } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_USERS } from '@/lib/mock-data';
import { useRouter } from 'next/navigation'; // Corrected import

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (employeeId: string,_password?: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('leavePilotUser');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        // In a real app, validate this user session, e.g., with a backend call
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('leavePilotUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (employeeId: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call & password check
    await new Promise(resolve => setTimeout(resolve, 500));
    const foundUser = MOCK_USERS.find(u => u.employeeId === employeeId);

    if (foundUser) { // In a real app, you'd also check the password hash
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
