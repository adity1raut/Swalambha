import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './components/Home';
import PortalSelection from './components/PortalSelection';
import Login from './components/Login';
import VoterLogin from './components/VoterLogin';
import Dashboard from './components/Dashboard';
import VoterDashboard from './components/VoterDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Home Route */}
            <Route path="/" element={<Home />} />
            
            {/* Portal Selection - Choose between Admin/Voter */}
            <Route path="/portals" element={<PortalSelection />} />
            
            {/* Public Routes - Only accessible when NOT logged in */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/voter/login" 
              element={
                <PublicRoute>
                  <VoterLogin />
                </PublicRoute>
              } 
            />
            
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
            
            ]['p32qewzx      <VoterDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;