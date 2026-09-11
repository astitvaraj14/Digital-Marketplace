import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Digital Marketplace</Link>
      </div>

      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            <span>Hello, {user.name}</span>

            {user.role === "seller" && (
              <Link to="/seller">Seller Dashboard</Link>
            )}
            {user?.role === "seller" && (
              <>
                {" "}
                <Link to="/seller/dashboard">Dashboard</Link>{" "}
                <Link to="/seller/products">Products</Link>{" "}
                <Link to="/seller">Profile</Link>{" "}
              </>
            )}

            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
