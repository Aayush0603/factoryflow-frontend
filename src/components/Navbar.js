import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div style={navStyle}>
      {/* Left Section */}
      <div>
        <Link to="/" style={brandStyle}>
          FactoryFlow ERP
        </Link>
      </div>

      {/* Right Section */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {token ? (
          <>
            <span style={{ marginRight: "20px" }}>
              Hi, <strong>{user?.name || "Admin"}</strong>
            </span>

            {/* Change Password (Visible When Logged In) */}
            <Link to="/change-password" style={linkStyle}>
              Change Password
            </Link>

            <button onClick={handleLogout} style={btnStyle}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 40px",
  background: "#111827",
  color: "white"
};

const brandStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
  fontWeight: "bold"
};

const linkStyle = {
  marginRight: "20px",
  color: "white",
  textDecoration: "none",
  fontWeight: 500
};

const btnStyle = {
  padding: "6px 12px",
  background: "#ef4444",
  border: "none",
  color: "white",
  cursor: "pointer",
  borderRadius: "6px"
};

export default Navbar;