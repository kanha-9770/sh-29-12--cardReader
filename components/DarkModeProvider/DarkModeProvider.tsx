// components/DarkModeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type DarkModeContextType = {
  isDark: boolean;
  toggle: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 1. Check localStorage
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      const dark = saved === "true";
      setIsDark(dark);
      document.documentElement.classList.toggle("dark", dark);
      return;
    }

    // 2. Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);

    // 3. Listen for system changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const systemDark = e.matches;
      if (localStorage.getItem("darkMode") === null) {
        // Only follow system if user hasn't chosen manually
        setIsDark(systemDark);
        document.documentElement.classList.toggle("dark", systemDark);
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("darkMode", String(newDark));
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) throw new Error("useDarkMode must be used within DarkModeProvider");
  return context;
};