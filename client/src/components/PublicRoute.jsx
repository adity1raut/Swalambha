import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PublicRoute({ children }) {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
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