import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
const STORAGE_KEY = 'merkatomotors_theme_v2';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_KEY) || 'light');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
