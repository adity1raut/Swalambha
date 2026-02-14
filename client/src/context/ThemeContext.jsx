import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const colors = theme === 'dark' ? {
    // Dark Mode - "Midnight Teal Elite" (Premium + Modern)
    primary: '#38BDF8',
    secondary: '#2DD4BF',
    background: '#020617',
    surface: '#0F172A',
    surfaceGlass: 'rgba(15, 23, 42, 0.8)',
    cardBg: '#0F172A',
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    border: '#1E293B',
    accent: '#2DD4BF',
    success: '#22C55E',
    warning: '#FACC15',
    error: '#F87171',
    hover: 'rgba(56, 189, 248, 0.15)',
    dashPrimary: '#38BDF8',
    dashSecondary: '#2DD4BF',
    dashAccent: '#2DD4BF',
    sidebarBg: '#0F172A',
    sidebarHover: 'rgba(56, 189, 248, 0.15)',
    gradient: 'linear-gradient(135deg, #020617 0%, #0A1628 50%, #0F172A 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.95))',
    buttonHover: '#0EA5E9',
    gradientStart: '#020617',
    gradientEnd: '#0F172A',
    navbarBg: 'rgba(15, 23, 42, 0.8)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
  } : {
    // Light Mode - "Ivory Mint Pro" (Clean + Trustworthy)
    primary: '#2563EB',
    secondary: '#059669',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceGlass: 'rgba(255, 255, 255, 0.85)',
    cardBg: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    accent: '#059669',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    hover: 'rgba(37, 99, 235, 0.08)',
    dashPrimary: '#2563EB',
    dashSecondary: '#059669',
    dashAccent: '#059669',
    sidebarBg: '#F8FAFC',
    sidebarHover: 'rgba(37, 99, 235, 0.08)',
    gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 50%, #E2E8F0 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
    buttonHover: '#1D4ED8',
    gradientStart: '#FFFFFF',
    gradientEnd: '#E2E8F0',
    navbarBg: 'rgba(255, 255, 255, 0.85)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
