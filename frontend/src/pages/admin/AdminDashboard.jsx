import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [dashboard, pending, allUsers] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/sellers/pending"),
        api.get("/admin/users")
      ]);

      setStats(dashboard.data.statistics);
      setSellers(pending.data.sellers);
      setUsers(allUsers.data.users);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load admin data"
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id) => {
    await api.patch(`/admin/sellers/${id}/approve`);
    loadData();
  };

  const reject = async (id) => {
    await api.delete(`/admin/sellers/${id}/reject`);
    loadData();
  };

  const toggleBlock = async (user) => {
    if (user.isBlocked)
      await api.patch(`/admin/users/${user._id}/unblock`);
    else
      await api.patch(`/admin/users/${user._id}/block`);

    loadData();
  };

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>

      {error && <p className="error">{error}</p>}

      {stats && (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Users</h3>
            <p>{stats.totalUsers}</p>
          </div>

          <div className="dashboard-card">
            <h3>Customers</h3>
            <p>{stats.totalCustomers}</p>
          </div>

          <div className="dashboard-card">
            <h3>Sellers</h3>
            <p>{stats.totalSellers}</p>
          </div>

          <div className="dashboard-card">
            <h3>Pending</h3>
            <p>{stats.pendingSellers}</p>
          </div>

          <div className="dashboard-card">
            <h3>Approved</h3>
            <p>{stats.approvedSellers}</p>
          </div>

          <div className="dashboard-card">
            <h3>Blocked</h3>
            <p>{stats.blockedUsers}</p>
          </div>
        </div>
      )}

      <h2>Pending Sellers</h2>

      {sellers.map((seller) => (
        <div className="product-card" key={seller._id}>
          <h3>{seller.storeName || seller.name}</h3>
          <p>{seller.email}</p>

          <button onClick={() => approve(seller._id)}>
            Approve
          </button>

          <button onClick={() => reject(seller._id)}>
            Reject
          </button>
        </div>
      ))}

      <h2>Users</h2>

      {users.map((user) => (
        <div className="product-card" key={user._id}>
          <strong>{user.name}</strong>

          <p>
            {user.email} — {user.role}
          </p>

          <p>
            Status: {user.isBlocked ? "Blocked" : "Active"}
          </p>

          {user.role !== "admin" && (
            <button onClick={() => toggleBlock(user)}>
              {user.isBlocked ? "Unblock" : "Block"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;