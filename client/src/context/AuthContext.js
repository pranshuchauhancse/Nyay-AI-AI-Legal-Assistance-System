import { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

const USER_KEY = 'nyay_user';
const TOKEN_KEY = 'nyay_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (!token && user) {
      setUser(null);
    }
  }, [token, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const login = (payload) => {
    const { token, ...rest } = payload;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setToken(token);
    }
    setUser(rest);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
    updateUser,
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
