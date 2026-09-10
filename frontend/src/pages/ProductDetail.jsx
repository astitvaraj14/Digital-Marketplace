import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react"
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft, Store, CheckCircle, AlertCircle } from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching product detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // PDF Section 9.3: Add to cart implementation
  const addToCart = async () => {
    if (!user) {
      alert("Please login as a customer to add items to your cart");
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      alert(`Role '${user.role}' cannot add products to cart. Please login as a customer.`);
      return;
    }

    setAdding(true);
    setFeedback({ type: "", message: "" });

    try {
      await api.post("/cart", {
        productId: product._id,
        quantity: quantity,
      });

      setFeedback({ type: "success", message: `${product.name} added to cart!` });
      // native alert popup as requested in contract
      alert("Product added to cart");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Unable to add product";
      setFeedback({ type: "error", message: errMsg });
      alert(errMsg);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto my-16 p-8 bg-white rounded-3xl text-center shadow-sm border border-slate-200">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 mt-2">The requested product might have been removed or unavailable.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isSeller = typeof product.sellerId === "object" ? product.sellerId : null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-10">
          {/* Image Column */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                  product.stock > 0 ? "bg-emerald-600" : "bg-rose-600"
                }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
                  {typeof product.categoryId === "object" ? product.categoryId.name : "Product"}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-slate-700">{product.rating || 4.8}</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-indigo-600">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-400 font-medium">Inclusive of all taxes</span>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.description || "No detailed description provided for this product."}
                </p>
              </div>

              {/* Seller Information */}
              {isSeller && (
                <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Sold By</p>
                      <p className="text-sm font-bold text-slate-800">
                        {isSeller.storeName || isSeller.name}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified Seller
                  </span>
                </div>
              )}
            </div>

            {/* Actions & Add to Cart */}
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-extrabold text-slate-800 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-400">Max limit: {product.stock} units</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={addToCart}
                  disabled={product.stock <= 0 || adding}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{adding ? "Adding to Cart..." : "Add to Cart"}</span>
                </button>

                <button
                  onClick={() => {
                    addToCart();
                    navigate("/cart");
                  }}
                  disabled={product.stock <= 0}
                  className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition shadow-md disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-500" />
                  <span>Fast Express Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Genuine Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
