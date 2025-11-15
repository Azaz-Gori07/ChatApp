import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // -----------------------------
  // Load theme from storage
  // -----------------------------
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      setTheme(storedTheme);
      document.body.className = storedTheme;    // apply class to body
    } else {
      document.body.className = "light";
    }
  }, []);

  // -----------------------------
  // Change Theme
  // -----------------------------
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;  // update class immediately
  };

  const setLight = () => {
    setTheme("light");
    localStorage.setItem("theme", "light");
    document.body.className = "light";
  };

  const setDark = () => {
    setTheme("dark");
    localStorage.setItem("theme", "dark");
    document.body.className = "dark";
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setLight,
        setDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Easy hook
export const useTheme = () => useContext(ThemeContext);
