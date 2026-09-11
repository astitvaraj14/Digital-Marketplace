import { useEffect, useState } from "react";
import api from "../../api/axios";
const SellerDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/sellers/dashboard")
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Unable to load dashboard"),
      );
  }, []);
  if (error)
    return (
      <div className="page-container">
        <p className="error">{error}</p>
      </div>
    );
  if (!data)
    return (
      <div className="page-container">
        <p>Loading dashboard...</p>
      </div>
    );
  return (
    <div className="page-container">
      {" "}
      <h1>Seller Dashboard</h1>{" "}
      <div className="dashboard-grid">
        {" "}
        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p>{data.statistics.totalProducts}</p>
        </div>{" "}
        <div className="dashboard-card">
          <h3>Active Products</h3>
          <p>{data.statistics.activeProducts}</p>
        </div>{" "}
        <div className="dashboard-card">
          <h3>Total Stock</h3>
          <p>{data.statistics.totalStock}</p>
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default SellerDashboard;
