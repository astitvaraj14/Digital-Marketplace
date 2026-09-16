import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSellers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/users", {
        params: { role: "seller" },
      });

      setSellers(res.data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load sellers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const approveSeller = async (id) => {
    try {
      await api.patch(`/admin/sellers/${id}/approve`);
      await loadSellers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to approve seller"
      );
    }
  };

  const rejectSeller = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this seller?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/sellers/${id}/reject`);
      await loadSellers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to reject seller"
      );
    }
  };

  const toggleBlock = async (seller) => {
    try {
      if (seller.isBlocked) {
        await api.patch(
          `/admin/users/${seller._id}/unblock`
        );
      } else {
        await api.patch(
          `/admin/users/${seller._id}/block`
        );
      }

      await loadSellers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update seller status"
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Seller Management
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-slate-500">
            Loading sellers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Seller Management
        </h1>

        <p className="text-slate-500 mt-1">
          Manage seller registrations and seller accounts.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!error && sellers.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-700">
            No Sellers Found
          </h2>

          <p className="text-slate-500 mt-2">
            There are currently no registered sellers.
          </p>
        </div>
      )}

      {!error && sellers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm divide-y">
          {sellers.map((seller) => (
            <div
              key={seller._id}
              className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h2 className="font-semibold text-lg text-slate-800">
                  {seller.name}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {seller.email}
                </p>

                {seller.phone && (
                  <p className="text-sm text-slate-500 mt-1">
                    Phone: {seller.phone}
                  </p>
                )}

                {seller.storeName && (
                  <p className="text-sm text-slate-600 mt-2">
                    Store:{" "}
                    <span className="font-medium">
                      {seller.storeName}
                    </span>
                  </p>
                )}

                {seller.storeDescription && (
                  <p className="text-sm text-slate-400 mt-1">
                    {seller.storeDescription}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    seller.isApproved
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {seller.isApproved
                    ? "Approved"
                    : "Pending"}
                </span>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    seller.isBlocked
                      ? "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {seller.isBlocked
                    ? "Blocked"
                    : "Active"}
                </span>

                {!seller.isApproved && (
                  <>
                    <button
                      onClick={() =>
                        approveSeller(seller._id)
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-1.5 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectSeller(seller._id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() => toggleBlock(seller)}
                  className={`text-sm px-3 py-1.5 rounded text-white ${
                    seller.isBlocked
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-slate-700 hover:bg-slate-800"
                  }`}
                >
                  {seller.isBlocked
                    ? "Unblock"
                    : "Block"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSellers;