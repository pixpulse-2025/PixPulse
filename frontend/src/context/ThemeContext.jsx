/**
 * @file ThemeContext.jsx
 * @description Provides dark mode and light mode state management across the application.
 * Persists user preference in localStorage and applies Tailwind's 'dark' class to the document root.
 */

import { createContext, useContext, useEffect, useState } from "react";

// Initialize the context for holding theme state and toggle function
const ThemeContext = createContext();

/**
 * ThemeProvider component.
 * Wraps the app and provides the current theme and a function to toggle it.
 */
export const ThemeProvider = ({ children }) => {
  // Default to 'light' theme
  const [theme, setTheme] = useState("light");

  /**
   * On initial mount, load the user's preferred theme from localStorage.
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  /**
   * Whenever the 'theme' state changes:
   * 1. Add/Remove the 'dark' class from the <html> element (for Tailwind dark mode).
   * 2. Persist the new theme in localStorage.
   */
  useEffect(() => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  /**
   * Switches between 'light' and 'dark' modes.
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook for consuming the ThemeContext.
 * @returns {Object} { theme, toggleTheme }
 */
export const useTheme = () => useContext(ThemeContext);
