import { useEffect, useState } from "react";
import api from "../../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/orders/my-orders")
      .then((res) => setOrders(res.data.orders || []))
      .catch((err) => setError(err.response?.data?.message || "Unable to load orders"));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div className="border border-slate-200 rounded-xl p-4 shadow-sm bg-white" key={order._id}>
            <h3 className="font-bold text-base mb-1">Order #{order._id.slice(-6)}</h3>
            <p className="text-slate-700 text-sm font-semibold">Total: ₹{order.totalAmount}</p>
            <p className="text-slate-600 text-xs">Status: <span className="capitalize font-medium">{order.status}</span></p>
            <p className="text-slate-500 text-xs">Items: {order.items ? order.items.length : 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
