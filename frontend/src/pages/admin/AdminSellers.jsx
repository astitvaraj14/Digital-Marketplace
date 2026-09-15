import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);

  const load = async () => {
    const res = await api.get("/admin/users", { params: { role: "seller" } });
    setSellers(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleApprove = async (id) => {
    await api.put(`/admin/sellers/${id}/approve`);
    load();
  };

  const toggleBlock = async (id) => {
    await api.put(`/admin/users/${id}/block`);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sellers</h1>
      <div className="bg-white rounded-lg shadow-sm divide-y">
        {sellers.map((s) => (
          <div key={s._id} className="flex items-center justify-between p-3">
            <div>
              <p className="font-medium">{s.storeName || s.name}</p>
              <p className="text-sm text-slate-500">{s.email}</p>
              <p className="text-xs mt-1">
                <span className={`px-2 py-0.5 rounded ${s.isApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {s.isApproved ? "Approved" : "Pending approval"}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleApprove(s._id)} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">
                {s.isApproved ? "Unapprove" : "Approve"}
              </button>
              <button
                onClick={() => toggleBlock(s._id)}
                className={`text-sm px-3 py-1 rounded ${s.isBlocked ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
              >
                {s.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSellers;
