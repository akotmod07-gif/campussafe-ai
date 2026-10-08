import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { IncidentProvider } from './context/IncidentContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Components
import { ProtectedRoute } from './components/ProtectedRoutes';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportIncidentPage from './pages/ReportIncidentPage';
import SOSPage from './pages/SOSPage';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import IncidentTrackingPage from './pages/IncidentTrackingPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <IncidentProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                {/* Public Routes */}
                <Route index element={<LandingPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="sos" element={<SOSPage />} />
                <Route path="report" element={<ReportIncidentPage />} />
                <Route path="incidents/:id" element={<IncidentDetailsPage />} />
                <Route path="track/:id" element={<IncidentTrackingPage />} />

                {/* Student Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
                  <Route path="student/dashboard" element={<StudentDashboard />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="admin/dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </IncidentProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
