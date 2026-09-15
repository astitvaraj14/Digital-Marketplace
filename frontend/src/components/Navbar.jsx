import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg">
        🛒 Digital Marketplace
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link to="/" className="hover:text-emerald-400">
          Marketplace
        </Link>

        {!user && (
          <>
            <Link to="/login" className="hover:text-emerald-400">
              Login
            </Link>

            <Link to="/register" className="hover:text-emerald-400">
              Register
            </Link>
          </>
        )}

        {user?.role === "customer" && (
          <>
            <Link to="/products" className="hover:text-emerald-400">
              Products
            </Link>

            <Link to="/cart" className="hover:text-emerald-400">
              Cart
            </Link>

            <Link to="/orders" className="hover:text-emerald-400">
              My Orders
            </Link>
          </>
        )}

        {user?.role === "seller" && (
          <>
            <Link to="/seller/dashboard" className="hover:text-emerald-400">
              Dashboard
            </Link>

            <Link to="/seller/products" className="hover:text-emerald-400">
              My Products
            </Link>

            <Link to="/seller/orders" className="hover:text-emerald-400">
              Orders
            </Link>

            <Link to="/seller/inventory" className="hover:text-emerald-400">
              Inventory
            </Link>

            <Link to="/seller" className="hover:text-emerald-400">
              Profile
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard" className="hover:text-emerald-400">
              Dashboard
            </Link>

            <Link to="/admin/sellers" className="hover:text-emerald-400">
              Sellers
            </Link>

            <Link to="/admin/users" className="hover:text-emerald-400">
              Users
            </Link>

            <Link to="/admin/categories" className="hover:text-emerald-400">
              Categories
            </Link>
          </>
        )}

        {user && (
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-700">
            <span className="text-slate-300">
              {user.name}{" "}
              <span className="text-xs text-slate-500">
                ({user.role})
              </span>
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
