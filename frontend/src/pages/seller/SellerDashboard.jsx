import React from "react";
import { Store, Package, PlusCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function SellerDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Seller Dashboard</h1>
            <p className="text-slate-500 text-sm">{user?.storeName || user?.name}</p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-medium">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Status: {user?.isApproved ? "Approved Seller (Ready to post products)" : "Pending Admin Approval"}</span>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
