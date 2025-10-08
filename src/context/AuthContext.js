import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000/api/auth'; // Backend auth endpoint

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          // Instead of just id, email, role, we'll try to fetch the full user object
          // This assumes a /me endpoint or similar, but for now, we'll just use decoded token info
          // and rely on login/register to set the full user object initially.
          // For page refresh, we might need a /me endpoint that returns the full user object.
          // For simplicity, on refresh, we'll just set basic user info from token.
          // A more robust solution would be to call a /me endpoint here.
          setUser({ id: decodedToken.id, email: decodedToken.email, role: decodedToken.role });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error('Failed to decode token or load user', error);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData); // Store the full user object including profile data
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const register = async (userData) => {
    console.log(userData)
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      const { token: newToken, user: newUserData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUserData); // Store the full user object including profile data
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);