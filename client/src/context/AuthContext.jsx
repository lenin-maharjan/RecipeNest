import { createContext, useState, useEffect } from 'react';
import { getMeApi } from '../api/auth.api';

export const AuthContext = createContext();

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  const id = rawUser.id || rawUser._id;
  return {
    ...rawUser,
    id,
    _id: rawUser._id || id,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we check token

  // on app load — check if token exists and fetch user
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMeApi();
        setUser(normalizeUser(res.data.data.user));
      } catch {
        // token invalid or expired — clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = (token, userData) => {
    const normalized = normalizeUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalized));
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => normalizeUser({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isChef: user?.role === 'chef',
        isAdmin: user?.role === 'admin',
        isVerifiedChef: user?.isVerifiedChef === true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};