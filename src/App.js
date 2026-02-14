import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation
} from "react-router-dom";
import { useState, useEffect } from "react";

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

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";
import HistoryIcon from "@mui/icons-material/History";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InsightsIcon from "@mui/icons-material/Insights";

function App() {
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [dark, setDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                
                {/* Overlay */}
                {isMobile && mobileOpen && (
                  <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "rgba(0,0,0,0.4)",
                      zIndex: 999
                    }}
                  />
                )}

                {/* Sidebar */}
                <div
                  style={{
                    ...sidebar,
                    width: collapsed ? "75px" : "220px",
                    position: isMobile ? "fixed" : "relative",
                    transform: isMobile
                      ? mobileOpen
                        ? "translateX(0)"
                        : "translateX(-100%)"
                      : "translateX(0)",
                    transition: "0.3s",
                    zIndex: 1000
                  }}
                >
                  {!isMobile && (
                    <button
                      onClick={() => setCollapsed(!collapsed)}
                      style={toggleBtn}
                    >
                      {collapsed ? "»" : "«"}
                    </button>
                  )}

                  {!collapsed && (
                    <>
                      <h2 style={{ marginBottom: "6px", fontSize: "18px" }}>
                        FactoryFlow
                      </h2>

                      <div style={userBox}>
                        Welcome, <b>{user?.username}</b>
                        <br />
                        <span style={roleBadge}>{user?.role}</span>
                      </div>
                    </>
                  )}

                  <NavItem to="/" icon={<DashboardIcon />} label="Dashboard" collapsed={collapsed} />
                  <NavItem to="/workers" icon={<PeopleIcon />} label="Workers" collapsed={collapsed} />
                  <NavItem to="/attendance" icon={<EventAvailableIcon />} label="Attendance" collapsed={collapsed} />
                  <NavItem to="/calendar" icon={<CalendarMonthIcon />} label="Calendar" collapsed={collapsed} />
                  <NavItem to="/history" icon={<HistoryIcon />} label="History" collapsed={collapsed} />
                  <NavItem to="/analytics" icon={<InsightsIcon />} label="Analytics" collapsed={collapsed} />

                  {user?.role === "admin" && (
                    <>
                      <NavItem to="/salary" icon={<PaymentsIcon />} label="Salary" collapsed={collapsed} />
                      <NavItem to="/add-worker" icon={<PersonAddIcon />} label="Add Worker" collapsed={collapsed} />
                      <NavItem to="/users" icon={<PeopleIcon />} label="Users" collapsed={collapsed} />
                    </>
                  )}

                  <button onClick={() => setDark(!dark)} style={themeBtn}>
                    {!collapsed && (dark ? "Light Mode ☀️" : "Dark Mode 🌙")}
                  </button>

                  <button
                    style={logoutBtn}
                    onClick={() => {
                      sessionStorage.clear();
                      window.location.href = "/login";
                    }}
                  >
                    {!collapsed && "Logout"}
                  </button>
                </div>

                {/* Main Content */}
                <div
                  style={{
                    flex: 1,
                    marginLeft: isMobile ? 0 : collapsed ? 75 : 220,
                    padding: "16px 20px",  // 🔥 reduced gap
                    background: dark ? "#0f172a" : "#f8fafc",
                    color: dark ? "#f1f5f9" : "#0f172a",
                    transition: "0.3s"
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      ...topHeader,
                      background: dark ? "#1e293b" : "white",
                      color: dark ? "white" : "black"
                    }}
                  >
                    {isMobile && (
                      <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={menuBtn(dark)}
                      >
                        ☰
                      </button>
                    )}

                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: "16px" }}>
                        Welcome back, {user?.username}
                      </h3>
                      <span style={{ fontSize: "12px", opacity: 0.7 }}>
                        Factory overview
                      </span>
                    </div>

                    <div style={roleBadgeHeader}>
                      {user?.role}
                    </div>
                  </div>

                  <Routes>
                    <Route path="/" element={<Dashboard dark={dark} />} />
                    <Route path="/workers" element={<Workers dark={dark} />} />
                    <Route path="/attendance" element={<Attendance dark={dark} />} />
                    <Route path="/calendar" element={<AttendanceCalendar dark={dark} />} />
                    <Route path="/history" element={<AttendanceHistory dark={dark} />} />
                    <Route path="/analytics" element={<Analytics dark={dark} />} />
                    {user?.role === "admin" && (
                      <>
                        <Route path="/salary" element={<Salary dark={dark} />} />
                        <Route path="/add-worker" element={<AddWorker dark={dark} />} />
                        <Route path="/users" element={<UserManagement />} />
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

/* ===== Components ===== */

function NavItem({ to, label, icon, collapsed }) {
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
      {!collapsed && label}
    </Link>
  );
}

/* ===== Styles ===== */

const sidebar = {
  background: "linear-gradient(180deg, #111827, #0f172a)",
  padding: "18px 14px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  color: "white",
  minHeight: "100vh"
};

const toggleBtn = {
  background: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "16px"
};

const logoutBtn = {
  marginTop: "auto",
  padding: "8px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px"
};

const themeBtn = {
  padding: "8px",
  background: "#334155",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px"
};

const userBox = {
  fontSize: "12px",
  marginBottom: "8px"
};

const roleBadge = {
  background: "#2563eb",
  padding: "2px 6px",
  borderRadius: "10px",
  fontSize: "10px"
};

const roleBadgeHeader = {
  background: "#2563eb",
  color: "white",
  padding: "4px 10px",
  borderRadius: "14px",
  fontSize: "11px"
};

const topHeader = {
  padding: "10px 14px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  marginBottom: "12px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.05)"
};

const menuBtn = (dark) => ({
  background: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  marginRight: "10px",
  color: dark ? "white" : "black"
});

export default App;