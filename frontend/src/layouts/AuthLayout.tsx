import { Outlet, Link } from "react-router-dom";

/**
 * Minimal layout for login/register pages — centered card, no nav.
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* ── Logo ── */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-slate-900">
            FoundIt
          </Link>
          <p className="text-body-sm text-on-surface-variant mt-2">
            Reconnecting people with their belongings
          </p>
        </div>

        {/* ── Auth Form Card ── */}
        <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-8">
          <Outlet />
        </div>

        {/* ── Back to Home ── */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-body-sm text-primary hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
