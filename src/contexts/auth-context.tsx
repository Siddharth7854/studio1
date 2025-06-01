
"use client";

import type { User } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_USERS } from '@/lib/mock-data';
import { useRouter } from 'next/navigation'; 

const SESSION_USERS_STORAGE_KEY = 'leavePilotSessionUsers';
const CURRENT_USER_STORAGE_KEY = 'leavePilotUser';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (employeeId: string, password?: string) => Promise<boolean>;
  logout: () => void;
  addUser: (newUser: User) => Promise<{ success: boolean; message: string }>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionUsers, setSessionUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    // Load session users
    const storedSessionUsers = localStorage.getItem(SESSION_USERS_STORAGE_KEY);
    if (storedSessionUsers) {
      try {
        setSessionUsers(JSON.parse(storedSessionUsers));
      } catch (error) {
        console.error("Failed to parse session users from localStorage", error);
        setSessionUsers(MOCK_USERS); // Fallback to mock users
        localStorage.setItem(SESSION_USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
      }
    } else {
      setSessionUsers(MOCK_USERS);
      localStorage.setItem(SESSION_USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
    }

    // Load current logged-in user
    const storedCurrentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedCurrentUser) {
      try {
        const parsedUser: User = JSON.parse(storedCurrentUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse current user from localStorage", error);
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (employeeId: string, passwordInput?: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    const foundUser = sessionUsers.find(u => u.employeeId === employeeId);

    if (foundUser) {
      // For admin users, password must match.
      // For non-admin mock users, password check is lenient (matches stored or any if not stored).
      const passwordMatches = foundUser.isAdmin 
        ? foundUser.password === passwordInput
        : (foundUser.password ? foundUser.password === passwordInput : true);


      if (passwordMatches) {
        const userToLogin = { ...foundUser };
        // Do not store password in the user object set in state or localStorage for the logged-in user
        delete userToLogin.password; 
        setUser(userToLogin);
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userToLogin));
        setIsLoading(false);
        return true;
      }
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    router.push('/login');
  };

  const addUser = async (newUser: User): Promise<{ success: boolean; message: string }> => {
    if (sessionUsers.find(u => u.employeeId === newUser.employeeId)) {
      return { success: false, message: "Employee ID already exists." };
    }
    
    const newId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userWithId = { ...newUser, id: newId };

    const updatedUsers = [...sessionUsers, userWithId];
    setSessionUsers(updatedUsers);
    localStorage.setItem(SESSION_USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    return { success: true, message: "Employee created successfully." };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      addUser, 
      isAdmin: !!user?.isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
