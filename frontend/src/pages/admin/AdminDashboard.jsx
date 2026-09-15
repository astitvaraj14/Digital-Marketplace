import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [d, p, u] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/sellers/pending"),
        api.get("/admin/users")
      ]);

      setStats(d.data.statistics);
      setSellers(p.data.sellers || []);
      setUsers(u.data.users || []);
    } catch (e) {
      setError(
        e.response?.data?.message || "Failed to load admin data"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.patch(`/admin/sellers/${id}/approve`);
    load();
  };

  const reject = async (id) => {
    if (window.confirm("Reject this seller?")) {
      await api.delete(`/admin/sellers/${id}/reject`);
      load();
    }
  };

  const toggle = async (user) => {
    const url = user.isBlocked
      ? `/admin/users/${user._id}/unblock`
      : `/admin/users/${user._id}/block`;

    await api.patch(url);
    load();
  };

  if (error) {
    return (
      <div className="page-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="page-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-grid">
        <div>Total Users: {stats.totalUsers}</div>
        <div>Customers: {stats.totalCustomers}</div>
        <div>Sellers: {stats.totalSellers}</div>
        <div>Pending: {stats.pendingSellers}</div>
        <div>Approved: {stats.approvedSellers}</div>
        <div>Blocked: {stats.blockedUsers}</div>
      </div>

      <h2>Pending Sellers</h2>

      {sellers.map((s) => (
        <div className="admin-row" key={s._id}>
          {s.storeName || s.name} — {s.email}

          <button onClick={() => approve(s._id)}>
            Approve
          </button>

          <button onClick={() => reject(s._id)}>
            Reject
          </button>
        </div>
      ))}

      <h2>Users</h2>

      {users.map((u) => (
        <div className="admin-row" key={u._id}>
          {u.name} — {u.role}

          {u.role !== "admin" && (
            <button onClick={() => toggle(u)}>
              {u.isBlocked ? "Unblock" : "Block"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;