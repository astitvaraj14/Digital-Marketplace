import { useEffect, useState } from "react";
import api from "../../api/axios";
const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const load = async () => {
    try {
      const response = await api.get("/inventory");
      setProducts(response.data.products);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load inventory");
    }
  };
  useEffect(() => {
    load();
  }, []);
  const restock = async (id) => {
    const quantity = Number(prompt("Enter restock quantity:"));
    if (!Number.isInteger(quantity) || quantity <= 0) return;
    try {
      await api.patch(`/inventory/${id}/stock`, {
        quantity,
        type: "restock",
        note: "Seller restock",
      });
      load();
    } catch (error) {
      setError(error.response?.data?.message || "Stock update failed");
    }
  };
  return (
    <div className="page-container">
      {" "}
      <h1>Inventory Management</h1> {error && <p className="error">{error}</p>}{" "}
      {products.map((product) => (
        <div className="product-card" key={product._id}>
          {" "}
          <h3>{product.name}</h3> <p>Current stock: {product.stock}</p>{" "}
          <button onClick={() => restock(product._id)}>Restock</button>{" "}
        </div>
      ))}{" "}
    </div>
  );
};
export default Inventory;
