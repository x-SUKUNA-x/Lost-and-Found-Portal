import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import { useState } from "react";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/post-item", label: "Post Item" },
  { path: "/dashboard", label: "Dashboard" },
];

const MainLayout = () => {
  const { isAuthenticated, user, logoutUser } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ───────── Header ───────── */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center h-16 px-4 md:px-8 max-w-7xl mx-auto">
          {/* Logo + Nav */}
          <div className="flex items-center gap-8 flex-1">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-slate-900"
            >
              FoundIt
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-medium transition-colors duration-200 pb-5 mb-[-20px] ${
                      isActive
                        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                        : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Search + Auth */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-on-surface-variant hidden md:inline">
                  {user?.name || user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={logoutUser}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ───────── Page Content ───────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        <Outlet />
      </main>

      {/* ───────── Footer ───────── */}
      <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-4 md:px-8 max-w-7xl mx-auto gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-semibold text-slate-700">
              FoundIt
            </span>
            <span className="text-xs text-slate-500">
              © {new Date().getFullYear()} FoundIt Portal. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6">
            {["Terms of Service", "Privacy Policy", "Help Center", "Contact Us"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {link}
                </a>
              )
            )}
          </div>
        </div>
      </footer>

      {/* ───────── FAB ───────── */}
      {isAuthenticated && (
        <Link
          to="/post-item"
          className="fixed bottom-8 right-8 bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-container transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </Link>
      )}
    </div>
  );
};

export default MainLayout;
