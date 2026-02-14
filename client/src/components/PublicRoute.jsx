import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function PublicRoute({ children }) {
  const { user, userType, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: colors.textSecondary,
        background: colors.background
      }}>
        Loading...
      </div>
    );
  }

  // If user is already logged in, redirect to their dashboard
  if (user && userType) {
    if (userType === 'admin') {
      return <Navigate to="/dashboard" replace />;
    } else if (userType === 'voter') {
      return <Navigate to="/voter/dashboard" replace />;
    }
  }

  return children;
}

export default PublicRoute;