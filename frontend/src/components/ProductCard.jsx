import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Eye } from "lucide-react";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const productId = product?._id || product?.id;

  const image =
    product?.image ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop";

  const categoryName =
    typeof product?.categoryId === "object"
      ? product.categoryId?.name
      : product?.category || "";

  const rating = Number(product?.rating) || 0;
  const stock = Number(product?.stock) || 0;
  const price = Number(product?.price) || 0;

  const handleViewProduct = () => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">

      {/* Product Image */}
      <div className="relative overflow-hidden bg-slate-100 h-52">
        <img
          src={image}
          alt={product?.name || "Product"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category */}
        {categoryName && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
            {categoryName}
          </span>
        )}

        {/* Stock */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
            stock > 0
              ? "bg-emerald-500/90 text-white"
              : "bg-rose-500/90 text-white"
          }`}
        >
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </span>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">

        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-amber-500 mb-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />

            <span className="text-xs font-bold text-slate-700">
              {rating > 0 ? rating.toFixed(1) : "No rating"}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product?.name || "Unnamed Product"}
          </h3>

          {/* Description */}
          <p className="text-slate-500 text-sm mt-1.5 line-clamp-2 leading-relaxed">
            {product?.description || "No description provided."}
          </p>
        </div>

        {/* Price + Button */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">

          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Price
            </span>

            <p className="text-xl font-extrabold text-indigo-600">
              ₹{price.toLocaleString("en-IN")}
            </p>
          </div>

          <button
            onClick={handleViewProduct}
            disabled={!productId}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg active:scale-95"
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