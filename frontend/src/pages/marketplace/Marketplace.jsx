import { useEffect, useState } from "react";
import api from "../../api/axios";

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const loadProducts = async () => {
    try {
      const response = await api.get("/marketplace/products", {
        params: { search, category }
      });
      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    api.get("/marketplace/categories")
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => {});
    loadProducts();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded px-4 py-2 flex-1"
        />
        <button
          onClick={loadProducts}
          className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700"
        >
          Search
        </button>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-300 rounded px-4 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div className="border border-slate-200 rounded-xl p-4 shadow-sm bg-white" key={product._id}>
            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
            <p className="text-slate-600 text-sm mb-2">{product.description}</p>
            <p className="font-semibold text-indigo-600 text-base">₹{product.price}</p>
            <p className="text-xs text-slate-500">Stock: {product.stock}</p>
            <p className="text-xs text-slate-500">
              Seller: {product.seller?.storeName || product.seller?.name || product.sellerId?.storeName || product.sellerId?.name || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
