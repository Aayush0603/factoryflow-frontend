/* eslint-disable no-unused-vars */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation
} from "react-router-dom";
import { useState } from "react";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddWorker from "./pages/AddWorker";
import Attendance from "./pages/Attendance";
import Salary from "./pages/Salary";
import AttendanceHistory from "./pages/AttendanceHistory";
import Workers from "./pages/Workers";
import AttendanceCalendar from "./pages/AttendanceCalendar";
import WorkerProfile from "./pages/WorkerProfile";
import Analytics from "./pages/Analytics";
import UserManagement from "./pages/UserManagement";
import Products from "./pages/Products";
import Machines from "./pages/Machines";
import AddProductionEntry from "./pages/AddProductionEntry";
import ProductionDashboard from "./pages/ProductionDashboard";
import RawMaterials from "./pages/RawMaterials";
import Purchases from "./pages/Purchases";
import Suppliers from "./pages/Suppliers";
import Inquiries from "./pages/Inquiries";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [dark, setDark] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Area */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <MainLayout dark={dark} setDark={setDark} user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function MainLayout({ dark, setDark, user }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "linear-gradient(180deg, #111827, #0f172a)",
          padding: "18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          color: "white"
        }}
      >
        <h2 style={{ fontSize: "18px" }}>FactoryFlow</h2>

        <div style={{ fontSize: "12px" }}>
          Welcome, <b>{user?.username}</b>
          <br />
          <span
            style={{
              background: "#2563eb",
              padding: "2px 6px",
              borderRadius: "10px",
              fontSize: "10px"
            }}
          >
            {user?.role}
          </span>
        </div>

        <NavItem to="/" label="Dashboard" />
        <NavItem to="/workers" label="Workers" />
        <NavItem to="/attendance" label="Attendance" />
        <NavItem to="/calendar" label="Calendar" />
        <NavItem to="/history" label="History" />
        <NavItem to="/analytics" label="Analytics" />

        <div style={{ marginTop: "12px", fontSize: "11px", opacity: 0.6 }}>
          PRODUCTION
        </div>

        <NavItem to="/production-dashboard" label="Production Dashboard" />
        <NavItem to="/products" label="Products" />
        <NavItem to="/machines" label="Machines" />
        <NavItem to="/add-production" label="Add Production" />
        <NavItem to="/raw-materials" label="Raw Materials" />
        <NavItem to="/purchases" label="Purchases" />

        {user?.role === "admin" && (
          <>
            <div style={{ marginTop: "12px", fontSize: "11px", opacity: 0.6 }}>
              ADMIN
            </div>

            <NavItem to="/salary" label="Salary" />
            <NavItem to="/add-worker" label="Add Worker" />
            <NavItem to="/users" label="Users" />
            <NavItem to="/suppliers" label="Suppliers" />
            <NavItem to="/inquiries" label="Inquiries" />
          </>
        )}

        <button
          onClick={() => setDark(!dark)}
          style={{
            padding: "8px",
            background: "#334155",
            color: "white",
            border: "none",
            borderRadius: "6px",
            marginTop: "10px"
          }}
        >
          {dark ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>

        <button
          style={{
            marginTop: "auto",
            padding: "8px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
          onClick={() => {
            sessionStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: dark ? "#0f172a" : "#f8fafc",
          color: dark ? "#f1f5f9" : "#0f172a"
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard dark={dark} />} />
          <Route path="/workers" element={<Workers dark={dark} />} />
          <Route path="/attendance" element={<Attendance dark={dark} />} />
          <Route path="/calendar" element={<AttendanceCalendar dark={dark} />} />
          <Route path="/history" element={<AttendanceHistory dark={dark} />} />
          <Route path="/analytics" element={<Analytics dark={dark} />} />

          <Route path="/production-dashboard" element={<ProductionDashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/machines" element={<Machines />} />
          <Route path="/add-production" element={<AddProductionEntry />} />
          <Route path="/raw-materials" element={<RawMaterials />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Only Routes */}
          <Route
            path="/salary"
            element={
              <ProtectedRoute requiredRole="admin">
                <Salary dark={dark} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-worker"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddWorker dark={dark} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/suppliers"
            element={
              <ProtectedRoute requiredRole="admin">
                <Suppliers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inquiries"
            element={
              <ProtectedRoute requiredRole="admin">
                <Inquiries />
              </ProtectedRoute>
            }
          />

          <Route path="/worker/:id" element={<WorkerProfile dark={dark} />} />
        </Routes>
      </div>
    </div>
  );
}

function NavItem({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        padding: "8px 10px",
        borderRadius: "8px",
        fontSize: "14px",
        textDecoration: "none",
        background: isActive ? "#334155" : "transparent",
        color: "white"
      }}
    >
      {label}
    </Link>
  );
}

export default App;