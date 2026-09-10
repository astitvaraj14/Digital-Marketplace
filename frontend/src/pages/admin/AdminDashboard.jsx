import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Customers" value={stats.totalCustomers} />
        <Stat label="Sellers" value={stats.totalSellers} />
        <Stat label="Pending Seller Approvals" value={stats.pendingSellerApprovals} />
        <Stat label="Products" value={stats.totalProducts} />
        <Stat label="Categories" value={stats.totalCategories} />
        <Stat label="Orders" value={stats.totalOrders} />
        <Stat label="Total Revenue" value={`₹${stats.totalRevenue}`} />
      </div>
    </div>
  );
};

export default AdminDashboard;
