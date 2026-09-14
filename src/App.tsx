import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SurveyPage } from './pages/SurveyPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminSurveysPage } from './pages/admin/AdminSurveysPage';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen flex-col bg-[#fcfcfc] text-neutral-950">
          <Routes>
            {/* Student Survey is the primary root experience */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <SurveyPage />
                  </main>
                  <Footer />
                </>
              }
            />

            {/* /survey alias redirects to / */}
            <Route path="/survey" element={<Navigate to="/" replace />} />

            {/* Admin Panel (Accessible only when explicitly navigating to /admin) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Navigate to="/admin/dashboard" replace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/surveys"
              element={
                <ProtectedRoute>
                  <AdminSurveysPage />
                </ProtectedRoute>
              }
            />

            {/* 404 handler */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <NotFoundPage />
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
