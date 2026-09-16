import { useEffect, useState } from "react";
import api from "../../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/my-orders")
      .then((r) => setOrders(r.data.orders || []))
      .catch((e) => setError(e.response?.data?.message || "Failed to load orders"));
  }, []);

  return (
    <div className="page-container max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {error && <p className="error text-red-500 mb-4">{error}</p>}
      {orders.length === 0 ? (
        <p className="text-slate-500">No orders yet.</p>
      ) : (
        orders.map((o) => (
          <div className="order-card border border-slate-200 rounded-xl p-4 shadow-sm bg-white mb-4" key={o._id}>
            <h3 className="font-bold text-base mb-1">Order #{o._id}</h3>
            <p className="text-slate-700 text-sm font-semibold">Status: {o.status}</p>
            <p className="text-slate-700 text-sm font-semibold">Total: ₹{o.totalAmount}</p>
            <p className="text-slate-600 text-xs">Address: {o.shippingAddress}</p>
            <div className="mt-2 space-y-1">
              {o.items &&
                o.items.map((i) => (
                  <p className="text-xs text-slate-500" key={i.product?._id || i._id || i.name}>
                    {i.name} × {i.quantity}
                  </p>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
