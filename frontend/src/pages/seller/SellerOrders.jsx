import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const response = await api.get("/orders/seller/orders");

        setOrders(response.data.orders || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load seller orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h1>Seller Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Seller Orders</h1>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Seller Orders</h1>

      {orders.length === 0 ? (
        <div className="dashboard-card">
          <h2>No Orders Yet</h2>
          <p>
            Orders containing your products will appear here.
          </p>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order._id}
              className="product-card"
              style={{ textAlign: "left" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <h2>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h2>

                  <p>
                    Customer:{" "}
                    <strong>
                      {order.customer?.name || "Customer"}
                    </strong>
                  </p>

                  <p>
                    Email: {order.customer?.email || "N/A"}
                  </p>
                </div>

                <span
                  style={{
                    padding: "7px 12px",
                    borderRadius: "20px",
                    background: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {order.status}
                </span>
              </div>

              <hr />

              <h3 style={{ marginTop: "15px" }}>
                Products
              </h3>

              {order.items?.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div>
                    ₹
                    {(
                      item.price * item.quantity
                    ).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "15px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                <span>Total Order Amount</span>

                <span>
                  ₹
                  {Number(order.totalAmount || 0).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div style={{ marginTop: "15px" }}>
                <strong>Delivery Address:</strong>
                <p>{order.shippingAddress}</p>
              </div>

              <p
                style={{
                  marginTop: "10px",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Ordered on{" "}
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;