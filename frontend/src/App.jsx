/**
 * @file App.jsx
 * @description Main application component that defines the routing structure and layout.
 * It also handles the initial authentication check when the app loads.
 */

import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
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
import Wallet from "./pages/Wallet";
import MyPurchases from "./pages/MyPurchases";
import MyReports from "./pages/MyReports";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminArtworks from "./pages/admin/Artworks";
import AdminReports from "./pages/admin/Reports";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminTransactions from "./pages/admin/Transactions";
import AdminMessages from "./pages/admin/Messages";
import Profile from "./pages/Profile";
import ArtistProfile from "./pages/ArtistProfile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { useAuth } from "./hooks/useAuth";

// Set axios Authorization header immediately if token exists
// This runs before any components mount, ensuring all API calls have the token
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

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
    if (token) {
      // Set axios default header for all requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (!isAuthenticated) {
        loadUser();
      }
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
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route
          path="/artwork/:id"
          element={
            <ProtectedRoute>
              <ArtworkDetail />
            </ProtectedRoute>
          }
        />

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
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
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
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/artworks"
          element={
            <AdminRoute>
              <AdminArtworks />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <AdminRoute>
              <AdminTransactions />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <AdminRoute>
              <AdminMessages />
            </AdminRoute>
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