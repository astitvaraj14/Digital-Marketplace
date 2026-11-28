
import React, {
  createContext,
  useContext,
  useState
} from 'react';

import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smartcart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // Login function
  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { access_token, user: userData } = response.data;

      localStorage.setItem('smartcart_token', access_token);
      localStorage.setItem('smartcart_user', JSON.stringify(userData));

      setUser(userData);

      return { success: true };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.detail || 'Authentication failed'
      };

    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('smartcart_token');
    localStorage.removeItem('smartcart_user');

    setUser(null);

    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
