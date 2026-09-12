import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerManagement from "./pages/seller/SellerManagement";

import SellerDashboard from "./pages/seller/SellerDashboard";
import ProductManagement from "./pages/seller/ProductManagement";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import SellerDashboard from "./pages/seller/SellerDashboard";

const Home = () => {
  return (
    <div className="page-container">
      <h1>Digital Marketplace</h1>

      <p>Welcome to the Digital Marketplace.</p>

      <p>Browse products and manage your marketplace account.</p>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                {" "}
                <SellerDashboard />{" "}
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                {" "}
                <ProductManagement />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
