import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Layout from './components/Layout/Navbar';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SecurityScorePage from './pages/SecurityScorePage';
import VulnerabilityScanPage from './pages/VulnerabilityScanPage';
import CompliancePage from './pages/CompliancePage';
import FraudDetectionPage from './pages/FraudDetectionPage';
import IdentityVerificationPage from './pages/IdentityVerificationPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/security-score" element={<SecurityScorePage />} />
            <Route path="/vulnerability-scans" element={<VulnerabilityScanPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/fraud-detection" element={<FraudDetectionPage />} />
            <Route path="/identity-verification" element={<IdentityVerificationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;