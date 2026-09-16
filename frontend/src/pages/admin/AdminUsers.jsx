import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/users", {
        params: { role: "customer" },
      });

      setUsers(res.data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleBlock = async (user) => {
    try {
      if (user.isBlocked) {
        await api.patch(`/admin/users/${user._id}/unblock`);
      } else {
        await api.patch(`/admin/users/${user._id}/block`);
      }

      await load();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update user status"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Customers
        </h1>

        <p className="text-slate-500 mt-1">
          Manage registered customer accounts.
        </p>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-slate-500">
            Loading customers...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-700">
            No Customers Found
          </h2>

          <p className="text-slate-500 mt-2">
            There are currently no registered customers.
          </p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm divide-y">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="font-medium text-slate-800">
                  {user.name}
                </p>

                <p className="text-sm text-slate-500">
                  {user.email}
                </p>

                {user.phone && (
                  <p className="text-sm text-slate-400 mt-1">
                    {user.phone}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    user.isBlocked
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>

                <button
                  onClick={() => toggleBlock(user)}
                  className={`text-sm px-3 py-1.5 rounded text-white ${
                    user.isBlocked
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;