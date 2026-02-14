import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './components/Home';
import PortalSelection from './components/PortalSelection';
import Login from './components/Login';
import VoterLogin from './components/VoterLogin';
import VoterForgotPassword from './components/VoterForgotPassword';
import Dashboard from './components/Dashboard';
import VoterDashboard from './components/VoterDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Home Route - Only accessible when NOT logged in */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              } 
            />
            
            {/* Portal Selection - Only accessible when NOT logged in */}
            <Route 
              path="/portals" 
              element={
                <PublicRoute>
                  <PortalSelection />
                </PublicRoute>
              } 
            />
            
            {/* Public Routes - Only accessible when NOT logged in */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* Voter Authentication Routes */}
            <Route path="/voter/login" element={<VoterLogin />} />
            <Route path="/voter/forgot-password" element={<VoterForgotPassword />} />
            
            {/* Protected Routes - Only for Admin */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes - Only for Voter */}
            <Route 
              path="/voter/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['voter']}>
                  <VoterDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;