import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(user?.address || "123 Market Street, Bengaluru");

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      return handleRemoveItem(productId);
    }

    try {
      const res = await api.put(`/cart/item/${productId}`, { quantity: newQty });
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/item/${productId}`);
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    try {
      await api.delete("/cart");
      fetchCart();
    } catch (err) {
      alert("Failed to clear cart");
    }
  };

  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setCheckingOut(true);
    try {
      const res = await api.post("/orders", {
        shippingAddress,
      });

      if (res.data.success) {
        alert("Order placed successfully! Redirecting to your orders.");
        navigate("/orders");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => {
    const price = item.productId ? item.productId.price : 0;
    return acc + price * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? (subtotal > 2000 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-indigo-600" />
              <span>Shopping Cart</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review your items, update quantities, and proceed to checkout.
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
            <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
            <p className="text-slate-500 text-sm mt-2">
              Looks like you haven't added any products to your shopping cart yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.productId;
                if (!product) return null;

                return (
                  <div
                    key={item._id || product._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-4 transition hover:border-slate-300"
                  >
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop"}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                    />

                    <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className="font-bold text-slate-800 text-base line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {product.description}
                      </p>
                      <p className="text-indigo-600 font-extrabold text-lg mt-2">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <button
                          onClick={() => handleUpdateQuantity(product._id, item.quantity, -1)}
                          className="px-3 py-1.5 text-slate-700 font-bold hover:bg-slate-200 transition"
                        >
                          -
                        </button>
                        <span className="px-3 py-1.5 text-sm font-extrabold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(product._id, item.quantity, 1)}
                          className="px-3 py-1.5 text-slate-700 font-bold hover:bg-slate-200 transition"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(product._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                  Order Summary
                </h3>

                {/* Address Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Shipping Address
                  </label>
                  <textarea
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
                    placeholder="Enter delivery address..."
                  />
                </div>

                <div className="space-y-3 text-sm pt-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-slate-800">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-emerald-600">
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                    <span className="text-base font-bold text-slate-900">Total Amount</span>
                    <span className="text-2xl font-extrabold text-indigo-600">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <span>{checkingOut ? "Processing Order..." : "Proceed to Checkout"}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Encrypted 256-bit Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
