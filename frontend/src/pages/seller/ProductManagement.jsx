import { useEffect, useState } from "react";
import api from "../../api/axios";
const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  image: "",
};
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const loadProducts = async () => {
    try {
      const response = await api.get("/products/seller/my-products");
      setProducts(response.data.products);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load products");
    }
  };
  useEffect(() => {
    loadProducts();
  }, []);
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        setMessage("Product updated successfully.");
      } else {
        await api.post("/products", formData);
        setMessage("Product created successfully.");
      }
      resetForm();
      loadProducts();
    } catch (error) {
      setError(error.response?.data?.message || "Product operation failed");
    }
  };
  const editProduct = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image || "",
    });
  };
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setMessage("Product deleted successfully.");
      loadProducts();
    } catch (error) {
      setError(error.response?.data?.message || "Unable to delete product");
    }
  };
  return (
    <div className="page-container">
      {" "}
      <h1>Product Management</h1>{" "}
      {message && <p className="success">{message}</p>}{" "}
      {error && <p className="error">{error}</p>}{" "}
      <form onSubmit={handleSubmit}>
        {" "}
        <input
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />{" "}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />{" "}
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />{" "}
        <input
          name="price"
          type="number"
          min="0"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />{" "}
        <input
          name="stock"
          type="number"
          min="0"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />{" "}
        <input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />{" "}
        <button type="submit">
          {editingId ? "Update Product" : "Create Product"}
        </button>{" "}
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}{" "}
      </form>{" "}
      {products.map((product) => (
        <div className="product-card" key={product._id}>
          {" "}
          <h3>{product.name}</h3> <p>{product.description}</p>{" "}
          <p>Category: {product.category}</p> <p>Price: {product.price}</p>{" "}
          <p>Stock: {product.stock}</p>{" "}
          <button onClick={() => editProduct(product)}>Edit</button>{" "}
          <button onClick={() => deleteProduct(product._id)}>
            Delete
          </button>{" "}
        </div>
      ))}{" "}
    </div>
  );
};
export default ProductManagement;
