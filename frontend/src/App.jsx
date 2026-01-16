import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import MyUploads from "./pages/MyUploads";
import Marketplace from "./pages/Marketplace";
import ArtworkDetail from "./pages/ArtworkDetail";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import MyPurchases from "./pages/MyPurchases";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";


function App() {
  const { loadUser, isAuthenticated } = useAuth();

  useEffect(() => {
    // Load user on app mount if token exists
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      loadUser();
    }
  }, [loadUser, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col
                    bg-gray-50 dark:bg-gray-950
                    text-gray-900 dark:text-gray-100
                    transition-colors font-sans selection:bg-primary-500 selection:text-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/community" element={<Community />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/artwork/:id" element={<ArtworkDetail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;