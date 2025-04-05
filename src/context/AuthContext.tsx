
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AuthState, User } from '@/types';

// In a real app, this would be handled by a backend API
const MOCK_USERS = [
  { id: '1', email: 'user@example.com', password: 'password', name: 'Demo User' }
];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in via localStorage
    const storedUser = localStorage.getItem('taskkeeper-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('taskkeeper-user');
        setAuthState({ ...authState, isLoading: false });
      }
    } else {
      setAuthState({ ...authState, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('taskkeeper-user', JSON.stringify(userWithoutPassword));
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false
      });
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "This email is already registered. Please use a different email.",
      });
      return false;
    }

    // In a real app, this would create a user in the database
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name
    };

    // Add user to mock data
    MOCK_USERS.push({ ...newUser, password });

    // Log the user in
    localStorage.setItem('taskkeeper-user', JSON.stringify(newUser));
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false
    });

    toast({
      title: "Account created",
      description: `Welcome to TaskKeeper, ${name}!`,
    });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('taskkeeper-user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
