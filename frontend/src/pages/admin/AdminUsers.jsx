import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const res = await api.get("/admin/users", { params: { role: "customer" } });
    setUsers(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleBlock = async (id) => {
    await api.put(`/admin/users/${id}/block`);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <div className="bg-white rounded-lg shadow-sm divide-y">
        {users.map((u) => (
          <div key={u._id} className="flex items-center justify-between p-3">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-slate-500">{u.email}</p>
            </div>
            <button
              onClick={() => toggleBlock(u._id)}
              className={`text-sm px-3 py-1 rounded ${u.isBlocked ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
            >
              {u.isBlocked ? "Unblock" : "Block"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
