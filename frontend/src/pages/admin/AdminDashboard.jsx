import React from "react";
import { ShieldCheck, Users, ShoppingBag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Admin Control Panel</h1>
            <p className="text-slate-500 text-sm">System Administrator Portal</p>
          </div>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-purple-800 text-sm font-medium">
          Logged in as System Admin ({user?.email})
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
