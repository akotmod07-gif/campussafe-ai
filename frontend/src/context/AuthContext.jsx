import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, checkBackendHealth, initLocalData } from '../services/api';
import { DEMO_CREDENTIALS } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ online: false, mode: 'Checking...' });

  useEffect(() => {
    initLocalData();

    // Check backend health
    checkBackendHealth().then((status) => {
      setBackendStatus(status);
    });

    // Check stored user & token
    const storedToken = localStorage.getItem('csa_token');
    const storedUser = localStorage.getItem('csa_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('csa_token');
        localStorage.removeItem('csa_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = true) => {
    setLoading(true);
    try {
      const data = await authAPI.login(email, password);
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        if (rememberMe) {
          localStorage.setItem('csa_token', data.token);
          localStorage.setItem('csa_user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('csa_token', data.token);
          sessionStorage.setItem('csa_user', JSON.stringify(data.user));
        }
      }
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authAPI.register(userData);
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('csa_token', data.token);
        localStorage.setItem('csa_user', JSON.stringify(data.user));
      }
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (role = 'student') => {
    const creds = DEMO_CREDENTIALS[role];
    if (creds) {
      return await login(creds.email, creds.password, true);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('csa_token');
    localStorage.removeItem('csa_user');
    sessionStorage.removeItem('csa_token');
    sessionStorage.removeItem('csa_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    backendStatus,
    login,
    register,
    quickLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
