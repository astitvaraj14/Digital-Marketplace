import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";

import SellerDashboard from "./pages/seller/SellerDashboard";
import ProductManagement from "./pages/seller/ProductManagement";
import SellerManagement from "./pages/seller/SellerManagement";
import Inventory from "./pages/seller/Inventory.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSellers from "./pages/admin/AdminSellers";
import AdminCategories from "./pages/admin/AdminCategories";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50">
          <Navbar />

          <Routes>
            {/* Customer Marketplace */}
            <Route path="/" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Seller */}
            <Route
              path="/seller"
              element={
                <ProtectedRoute roles={["seller"]}>
                  <SellerManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute roles={["seller"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller/products"
              element={
                <ProtectedRoute roles={["seller"]}>
                  <ProductManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller/inventory"
              element={
                <ProtectedRoute roles={["seller"]}>
                  <Inventory />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
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

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/sellers"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminSellers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminCategories />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;