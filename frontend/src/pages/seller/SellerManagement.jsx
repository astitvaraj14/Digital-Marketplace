import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const SellerManagement = () => {
  const { user } = useAuth();

  const [seller, setSeller] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    storeName: "",
    storeDescription: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSellerProfile = async () => {
      try {
        const response = await api.get("/sellers/profile");

        const sellerData = response.data.seller;

        setSeller(sellerData);

        setFormData({
          name: sellerData.name || "",
          phone: sellerData.phone || "",
          address: sellerData.address || "",
          storeName: sellerData.storeName || "",
          storeDescription: sellerData.storeDescription || ""
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load seller profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSellerProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const response = await api.put(
        "/sellers/profile",
        formData
      );

      setSeller(response.data.seller);

      setMessage(
        "Seller profile updated successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update seller profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="seller-container">
        <p>Loading seller profile...</p>
      </div>
    );
  }

  return (
    <div className="seller-container">
      <h1>Seller Management</h1>

      {user && (
        <p>
          Seller Status:{" "}
          <strong>
            {user.isApproved
              ? "Approved"
              : "Waiting for Admin Approval"}
          </strong>
        </p>
      )}

      {message && (
        <p className="success">
          {message}
        </p>
      )}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {seller && (
        <form onSubmit={handleSubmit}>
          <label>Name</label>

          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Phone</label>

          <input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Address</label>

          <input
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
          />

          <label>Store Name</label>

          <input
            name="storeName"
            type="text"
            value={formData.storeName}
            onChange={handleChange}
            required
          />

          <label>Store Description</label>

          <textarea
            name="storeDescription"
            value={formData.storeDescription}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Seller Profile"}
          </button>
        </form>
      )}
    </div>
  );
};

export default SellerManagement;