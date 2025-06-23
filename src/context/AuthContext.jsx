import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Check for existing authentication on app load
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (userId && token) {
        setIsAuthenticated(true);
        setUser({ userId, token });
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = ({ userId, token, newUser }) => {
    try {
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('isNewUser', newUser.toString());
      
      setIsAuthenticated(true);
      setUser({ userId, token, newUser });
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('isNewUser');
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}