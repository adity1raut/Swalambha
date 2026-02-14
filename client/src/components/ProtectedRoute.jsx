import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
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

  // If not logged in, redirect to appropriate login page
  if (!user || !userType) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    // Redirect to their appropriate dashboard
    if (userType === 'admin') {
      return <Navigate to="/dashboard" replace />;
    } else if (userType === 'voter') {
      return <Navigate to="/voter/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;