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

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";
import HistoryIcon from "@mui/icons-material/History";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InsightsIcon from "@mui/icons-material/Insights";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";

function App() {
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [dark, setDark] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {!isLoggedIn ? (
          <Route path="*" element={<Navigate to="/login" />} />
        ) : (
          <Route
            path="*"
            element={
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
                  <h2 style={{ marginBottom: "8px", fontSize: "18px" }}>
                    FactoryFlow
                  </h2>

                  <div style={{ fontSize: "12px", marginBottom: "8px" }}>
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

                  {/* Core Modules */}
                  <NavItem to="/" icon={<DashboardIcon />} label="Dashboard" />
                  <NavItem to="/workers" icon={<PeopleIcon />} label="Workers" />
                  <NavItem to="/attendance" icon={<EventAvailableIcon />} label="Attendance" />
                  <NavItem to="/calendar" icon={<CalendarMonthIcon />} label="Calendar" />
                  <NavItem to="/history" icon={<HistoryIcon />} label="History" />
                  <NavItem to="/analytics" icon={<InsightsIcon />} label="Analytics" />

                  {/* Production Section */}
                  <div style={{ marginTop: "12px", fontSize: "11px", opacity: 0.6 }}>
                    PRODUCTION
                  </div>

                  <NavItem to="/production-dashboard" icon={<PrecisionManufacturingIcon />} label="Production Dashboard" />
                  <NavItem to="/products" icon={<PrecisionManufacturingIcon />} label="Products" />
                  <NavItem to="/machines" icon={<PrecisionManufacturingIcon />} label="Machines" />
                  <NavItem to="/add-production" icon={<PrecisionManufacturingIcon />} label="Add Production" />
                  <NavItem to="/raw-materials" icon={<InventoryIcon />} label="Raw Materials" />
                  <NavItem to="/purchases" icon={<ShoppingCartIcon />} label="Purchases" />

                  {/* Admin Only */}
                  {user?.role === "admin" && (
                    <>
                      <div style={{ marginTop: "12px", fontSize: "11px", opacity: 0.6 }}>
                        ADMIN
                      </div>

                      <NavItem to="/salary" icon={<PaymentsIcon />} label="Salary" />
                      <NavItem to="/add-worker" icon={<PersonAddIcon />} label="Add Worker" />
                      <NavItem to="/users" icon={<PeopleIcon />} label="Users" />
                      <NavItem to="/suppliers" icon={<BusinessIcon />} label="Suppliers" />
                      <NavItem to="/inquiries" icon={<AssignmentIcon />} label="Inquiries" />
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
                      cursor: "pointer",
                      fontSize: "13px",
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
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px"
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

                    {/* Production Routes */}
                    <Route path="/production-dashboard" element={<ProductionDashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/machines" element={<Machines />} />
                    <Route path="/add-production" element={<AddProductionEntry />} />
                    <Route path="/raw-materials" element={<RawMaterials />} />
                    <Route path="/purchases" element={<Purchases />} />
                    {user?.role === "admin" && (
                      <>
                        <Route path="/salary" element={<Salary dark={dark} />} />
                        <Route path="/add-worker" element={<AddWorker dark={dark} />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/suppliers" element={<Suppliers />} />
                        <Route path="/inquiries" element={<Inquiries />} />
                      </>
                    )}

                    <Route path="/worker/:id" element={<WorkerProfile dark={dark} />} />
                  </Routes>
                </div>
              </div>
            }
          />
        )}
      </Routes>
    </Router>
  );
}

function NavItem({ to, label, icon }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 10px",
        borderRadius: "8px",
        fontSize: "14px",
        textDecoration: "none",
        background: isActive ? "#334155" : "transparent",
        color: "white"
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

export default App;