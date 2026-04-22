import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PostItem from "../pages/PostItem";
import Dashboard from "../pages/Dashboard";

/**
 * Application route configuration.
 * - MainLayout: pages with header, footer, nav
 * - AuthLayout: centered card for login/register
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public routes (with full layout) ── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/post-item"
          element={
            <ProtectedRoute>
              <PostItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── Auth routes (minimal layout) ── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ── 404 fallback ── */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-h1 text-h1 text-on-surface mb-4">404</h1>
              <p className="text-body-lg text-on-surface-variant">
                Page not found
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
