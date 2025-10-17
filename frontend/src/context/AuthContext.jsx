import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is logged in on app start
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Function to check if user is logged in
  const checkUserLoggedIn = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        // Verify token by calling /me endpoint
        const response = await authAPI.getCurrentUser(storedToken);
        
        if (response.success) {
          setUser(response.user);
          setToken(storedToken);
        } else {
          // Token is invalid, logout user
          logout();
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { token: newToken, user: userData } = response;
        
        // Store token in localStorage
        localStorage.setItem('token', newToken);
        
        // Update state
        setToken(newToken);
        setUser(userData);
        
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register(username, email, password);
      
      if (response.success) {
        const { token: newToken, user: userData } = response;
        
        // Store token in localStorage
        localStorage.setItem('token', newToken);
        
        // Update state
        setToken(newToken);
        setUser(userData);
        
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Reset state
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    checkUserLoggedIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;