import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Set up axios defaults - use environment variable for API URL
const API_BASE_URL =  'http://localhost:5001';
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate
    const token = localStorage.getItem('relationsync_token');
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.data);
    } catch (error) {
      localStorage.removeItem('relationsync_token');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem('relationsync_token');
    if (token) {
      try {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.data);
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        identifier,
        password
      });
      
      const { user: userData, token } = response.data.data;
      setUser(userData);
      localStorage.setItem('relationsync_token', token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        username: userData.email?.split('@')[0] || 'user',
        email: userData.email,
        password: userData.password,
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        relationship_status: userData.relationshipStatus,
      });
      
      const { user: newUser, token } = response.data.data;
      setUser(newUser);
      localStorage.setItem('relationsync_token', token);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('relationsync_token');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      isLoading,
      refreshUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};