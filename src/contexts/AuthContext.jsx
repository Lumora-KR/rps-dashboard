"use client";

import { createContext, useContext, useState, useEffect } from "react";
import apiLogin from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Set token in axios headers
        apiLogin.defaults.headers.common["x-auth-token"] = token;

        // Verify token and get user data
        const response = await apiLogin.get("/api/auth/user");

        if (response.data.success) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiLogin.post("/api/auth/login", {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        apiLogin.defaults.headers.common["x-auth-token"] = response.data.token;
        setIsAuthenticated(true);
        setUser(response.data.user);
        return true;
      } else {
        setError(response.data.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete apiLogin.defaults.headers.common["x-auth-token"];
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
