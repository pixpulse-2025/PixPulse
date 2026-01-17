/**
 * @file App.jsx
 * @description Main application component that defines the routing structure and layout.
 * It also handles the initial authentication check when the app loads.
 */

import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Explore from "./pages/Explore";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import MyUploads from "./pages/MyUploads";
import ArtworkDetail from "./pages/ArtworkDetail";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import MyPurchases from "./pages/MyPurchases";
import MyReports from "./pages/MyReports";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminArtworks from "./pages/admin/Artworks";
import AdminReports from "./pages/admin/Reports";
import AdminAnalytics from "./pages/admin/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

/**
 * The root component of the React application.
 * Manages the layout (Navbar/Footer) and all route definitions.
 */
function App() {
  const { loadUser, isAuthenticated } = useAuth();

  /**
   * Effect hook to verify the user's session on initial load.
   * If a JWT token exists in localStorage, it attempts to fetch the user profile.
   */
  useEffect(() => {
    // Load user on app mount if token exists
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      loadUser();
    }
  }, [loadUser, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col
                    bg-background text-text
                    transition-colors font-sans selection:bg-primary/30 selection:text-text">
      {/* Persistent Navigation Bar */}
      <Navbar />

      {/* Main Route Definitions */}
      <Routes>
        {/* ==========================================================================
           PUBLIC ROUTES
           ========================================================================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/community" element={<Community />} />
        <Route path="/artwork/:id" element={<ArtworkDetail />} />

        {/* ==========================================================================
           PROTECTED ROUTES (Require Authentication)
           ========================================================================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-uploads"
          element={
            <ProtectedRoute>
              <MyUploads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-purchases"
          element={
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <MyReports />
            </ProtectedRoute>
          }
        />

        {/* ==========================================================================
           ADMIN ROUTES (Require Admin Privileges)
           ========================================================================== */ }
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/artworks"
          element={
            <ProtectedRoute>
              <AdminArtworks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}

export default App;