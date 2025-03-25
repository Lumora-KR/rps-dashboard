"use client";

import { createContext, useState, useEffect } from "react";

// Create the context with default values
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has previously set a preference
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("darkMode");
      return savedTheme ? JSON.parse(savedTheme) : false;
    }
    return false;
  });

  useEffect(() => {
    // Save preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }

    // Apply theme to body
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Provide the context value
  const contextValue = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
