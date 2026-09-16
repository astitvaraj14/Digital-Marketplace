import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.categories || []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/categories", { name, description });
      setName("");
      setDescription("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create category");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete category");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-3">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-3 py-2 flex-1" required />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded px-3 py-2 flex-1" />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <div className="bg-white rounded-lg shadow-sm divide-y">
        {categories.map((c) => (
          <div key={c._id} className="flex items-center justify-between p-3">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-slate-500">{c.description}</p>
            </div>
            <button onClick={() => remove(c._id)} className="text-red-600 text-sm">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
