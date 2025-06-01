
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
  updateUser: (userId: string, updatedData: Partial<User>) => Promise<{ success: boolean; message: string; updatedUser?: User }>;
  isAdmin: boolean;
  sessionUsers: User[];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionUsers, setSessionUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const storedSessionUsers = localStorage.getItem(SESSION_USERS_STORAGE_KEY);
    if (storedSessionUsers) {
      try {
        setSessionUsers(JSON.parse(storedSessionUsers));
      } catch (error) {
        console.error("Failed to parse session users from localStorage", error);
        setSessionUsers(MOCK_USERS); 
        localStorage.setItem(SESSION_USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
      }
    } else {
      setSessionUsers(MOCK_USERS);
      localStorage.setItem(SESSION_USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
    }

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
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const foundUser = sessionUsers.find(u => u.employeeId === employeeId);

    if (foundUser) {
      const passwordMatches = foundUser.isAdmin 
        ? foundUser.password === passwordInput
        : (foundUser.password ? foundUser.password === passwordInput : true);

      if (passwordMatches) {
        const userToLogin = { ...foundUser };
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

    const updatedUsersList = [...sessionUsers, userWithId];
    setSessionUsers(updatedUsersList);
    localStorage.setItem(SESSION_USERS_STORAGE_KEY, JSON.stringify(updatedUsersList));
    return { success: true, message: "Employee created successfully." };
  };

  const updateUser = async (userId: string, updatedData: Partial<User>): Promise<{ success: boolean; message: string; updatedUser?: User }> => {
    const userIndex = sessionUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    const updatedUsersList = [...sessionUsers];
    // Merge existing user data with new data. Password will be included here if provided.
    const fullyUpdatedUserRecord = { ...updatedUsersList[userIndex], ...updatedData };
    updatedUsersList[userIndex] = fullyUpdatedUserRecord;
    
    setSessionUsers(updatedUsersList);
    localStorage.setItem(SESSION_USERS_STORAGE_KEY, JSON.stringify(updatedUsersList));

    // If the updated user is the currently logged-in user, update their session
    if (user && user.id === userId) {
      const userForStateAndSession = { ...fullyUpdatedUserRecord };
      delete userForStateAndSession.password; // Remove password for client-side state and storage

      setUser(userForStateAndSession);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userForStateAndSession));
      return { success: true, message: "Profile updated successfully.", updatedUser: userForStateAndSession };
    }

    return { success: true, message: "User data updated.", updatedUser: fullyUpdatedUserRecord }; // This case might be for admin editing others
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      addUser,
      updateUser,
      isAdmin: !!user?.isAdmin,
      sessionUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};
