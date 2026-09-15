import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    phone: "",
    address: "",
    storeName: "",
    storeDescription: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await register(formData);

      if (data.user.role === "seller") {
        setSuccess(
          "Seller registered successfully. Waiting for admin approval."
        );

        setTimeout(() => {
          navigate("/seller");
        }, 1000);
      } else {
        setSuccess("Customer registered successfully.");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          minLength="6"
          required
        />

        <input
          name="phone"
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          name="address"
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
        </select>

        {formData.role === "seller" && (
          <>
            <input
              name="storeName"
              type="text"
              placeholder="Store Name"
              value={formData.storeName}
              onChange={handleChange}
              required
            />

            <textarea
              name="storeDescription"
              placeholder="Store Description"
              value={formData.storeDescription}
              onChange={handleChange}
            />
          </>
        )}

        {error && <p className="error">{error}</p>}

        {success && <p className="success">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;