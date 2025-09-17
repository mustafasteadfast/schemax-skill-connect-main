import React, { createContext, useContext, useEffect, useState } from 'react';
import { MockUser } from '@/lib/mock-data';
import { mockAuth, AuthContextType } from '@/lib/mock-auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const MockAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = mockAuth.getUser();
    setUser(currentUser);
    setLoading(false);

    // Listen for auth state changes
    const { data: { subscription } } = mockAuth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await mockAuth.signIn(email, password);
      if (result.data?.user) {
        setUser(result.data.user);
      }
      return { error: result.error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      const result = await mockAuth.signUp(email, password, displayName);
      if (result.data?.user) {
        setUser(result.data.user);
      }
      return { error: result.error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await mockAuth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
