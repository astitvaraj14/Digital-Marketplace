import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerDashboard from "./pages/seller/SellerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Icons
import { ShoppingBag, ShoppingCart, Package, LogIn, LogOut, User, Store, ShieldCheck } from "lucide-react";

function NavigationHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-black shadow-md shadow-indigo-200 group-hover:scale-105 transition">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 block leading-none">
              Digital<span className="text-indigo-600">Market</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
              Customer & Order Portal
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition rounded-xl hover:bg-slate-100/80"
          >
            Marketplace
          </Link>

          {user && user.role === "customer" && (
            <>
              <Link
                to="/cart"
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition rounded-xl hover:bg-slate-100/80"
              >
                <ShoppingCart className="w-4 h-4 text-indigo-600" />
                <span>Cart</span>
              </Link>

              <Link
                to="/orders"
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition rounded-xl hover:bg-slate-100/80"
              >
                <Package className="w-4 h-4 text-indigo-600" />
                <span>My Orders</span>
              </Link>
            </>
          )}

          {user && user.role === "seller" && (
            <Link
              to="/seller/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition"
            >
              <Store className="w-4 h-4" />
              <span>Seller Panel</span>
            </Link>
          )}

          {user && user.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-purple-700 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          )}

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-extrabold text-slate-800 line-clamp-1">{user.name}</span>
                <span className="text-[10px] text-slate-400 capitalize font-medium">{user.role}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <NavigationHeader />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Routes (Indushree Owned) */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute roles={["customer"]}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute roles={["customer"]}>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              {/* Seller & Admin Role Dashboards */}
              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedRoute roles={["seller"]}>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <footer className="bg-slate-900 text-slate-400 py-8 text-center text-xs border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 Digital Marketplace. Day 1 Module: Indushree N (Customer Marketplace & Order Management).</p>
              <div className="flex gap-4">
                <span>Frontend: Port 5174</span>
                <span>•</span>
                <span>Backend: Port 5001</span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
