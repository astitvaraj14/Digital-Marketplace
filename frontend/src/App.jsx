import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Customer / Marketplace
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/customer/Orders";

// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";

// Seller
import SellerDashboard from "./pages/seller/SellerDashboard";
import ProductManagement from "./pages/seller/ProductManagement";
import SellerManagement from "./pages/seller/SellerManagement";
import Inventory from "./pages/seller/Inventory.jsx";

// Admin
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

          <main>
            <Routes>

              {/* =========================
                  CUSTOMER / MARKETPLACE
                 ========================= */}

              <Route path="/" element={<Marketplace />} />

              <Route path="/marketplace" element={<Marketplace />} />

              <Route path="/products" element={<Products />} />

              <Route
                path="/products/:id"
                element={<ProductDetails />}
              />

              {/* Indushree product-detail route compatibility */}
              <Route
                path="/product/:id"
                element={<ProductDetail />}
              />

              {/* =========================
                  AUTHENTICATION
                 ========================= */}

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/register"
                element={<Register />}
              />

              {/* =========================
                  CUSTOMER
                 ========================= */}

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

              {/* =========================
                  SELLER
                 ========================= */}

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

              {/* =========================
                  ADMIN
                 ========================= */}

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
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;