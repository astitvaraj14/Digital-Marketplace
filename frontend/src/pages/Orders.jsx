import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Package, Clock, CheckCircle2, Truck, AlertCircle, Calendar, MapPin, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get("/orders/mine");
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Shipped
          </span>
        );
      case "processing":
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Processing
          </span>
        );
      default:
        return (
          <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            Pending Confirmation
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" />
            <span>My Orders</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your order history, delivery statuses, and purchased items.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800">No Orders Found</h2>
            <p className="text-slate-500 text-sm mt-2">
              You haven't placed any orders yet. Explore our marketplace to start shopping!
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden"
              >
                {/* Header bar */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 font-medium block">Order ID</span>
                      <span className="font-mono font-bold text-slate-800">#{order._id.substring(18)}</span>
                    </div>

                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                    <div>
                      <span className="text-slate-400 font-medium block">Order Placed</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-lg font-extrabold text-indigo-600">
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Items list */}
                <div className="p-6 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Quantity: <span className="font-bold text-slate-700">{item.quantity}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-sm text-slate-800">
                          ₹{Number(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Shipping address footer */}
                  {order.shippingAddress && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>Delivery Address: <strong className="text-slate-700">{order.shippingAddress}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
