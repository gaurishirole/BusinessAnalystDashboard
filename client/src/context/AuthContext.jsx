import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    // Simple mock authentication logic
    if (email && password) {
      let role = 'Admin';
      let name = 'Alex Mercer';
      let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces';
      
      if (email.toLowerCase().startsWith('manager')) {
        role = 'Manager';
        name = 'Emma Watson';
        avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces';
      } else if (email.toLowerCase().startsWith('analyst')) {
        role = 'Analyst';
        name = 'Robert Downey';
        avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces';
      } else if (email.toLowerCase().startsWith('editor')) {
        role = 'Editor';
        name = 'Sarah Connor';
        avatar = 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=faces';
      } else if (email.toLowerCase().startsWith('viewer')) {
        role = 'Viewer';
        name = 'John Doe';
        avatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces';
      }
      
      const mockUser = {
        id: role === 'Admin' ? '1' : (role === 'Manager' ? '2' : '3'),
        name,
        email,
        role,
        avatar,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
