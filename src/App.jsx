import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { FinancialRecordProvider } from "./contexts/FinancialRecordProvider";
import { ThemeProvider } from "./components/theme-provider";
import ToastContainer from "./components/ToastContainer";
import LoadingScreen from "./components/LoadingScreen";
import api from "./api/api";


// Layout + Pages
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard";
import AnalyticsPage from "./pages/Analytics";
import SettingsPage from "./pages/Settings";
import ProfilePage from "./pages/Profile";
import TransactionsPage from "./pages/Transactions";
import BudgetsPage from "./pages/Budgets";
import InsightsPage from "./pages/Insights";
import CalendarPage from "./pages/FinancialCalendar";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";

// Protect dashboard routes
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// Block login/register if already logged in
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
}

// Only allow forgot-password if not logged in
function ForgotPasswordRoute({ children }) {
  const token = localStorage.getItem("token");
  return !token ? children : <Navigate to="/" replace />;
}

// Only allow reset-password if not logged in and has email in location.state
function ResetPasswordRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const hasEmail = location.state && location.state.email;
  return !token && hasEmail ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Register Route */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      {/* Login Route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      {/* Forgot Password Route */}
      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordRoute>
            <ForgotPasswordPage />
          </ForgotPasswordRoute>
        }
      />
      {/* Reset Password Route */}
      <Route
        path="/reset-password"
        element={
          <ResetPasswordRoute>
            <ResetPasswordPage />
          </ResetPasswordRoute>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function initializeApp() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await api.getUser(); // fetch user data
      }
      // ...any other startup logic...
    } finally {
      setLoading(false);
    }
  }
  initializeApp();
}, []);

  if (loading) return <LoadingScreen />;
  return (
    <FinancialRecordProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="transition-colors duration-500 bg-white dark:bg-gray-900 min-h-screen">
            <AppRoutes />
            <ToastContainer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </FinancialRecordProvider>
  );
}

export default App;




