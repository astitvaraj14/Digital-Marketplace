import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingBag, Eye } from "lucide-react";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      <div className="relative overflow-hidden bg-slate-100 h-52">
        <img
          src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.categoryId && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
            {typeof product.categoryId === "object" ? product.categoryId.name : "Product"}
          </span>
        )}

        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
            product.stock > 0
              ? "bg-emerald-500/90 text-white"
              : "bg-rose-500/90 text-white"
          }`}
        >
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-amber-500 mb-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-700">{product.rating || 4.5}</span>
            <span className="text-xs text-slate-400">(customer reviews)</span>
          </div>

          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-slate-500 text-sm mt-1.5 line-clamp-2 leading-relaxed">
            {product.description || "No description provided."}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <p className="text-xl font-extrabold text-indigo-600">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </p>
          </div>

          <button
            onClick={() => navigate(`/product/${product._id}`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span>View Product</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
