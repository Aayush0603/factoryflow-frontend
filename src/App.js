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

/* ================= MAIN APP ================= */

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
              <div
                style={{
                  display: "flex",
                  minHeight: "100vh",
                  position: "relative"
                }}
              >
                {/* ================= SIDEBAR ================= */}

                {isMobile && mobileOpen && (
                  <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "rgba(0,0,0,0.4)",
                      zIndex: 999
                    }}
                  />
                )}

                <div
                  style={{
                    ...sidebar,
                    position: isMobile ? "fixed" : "relative",
                    left: isMobile
                      ? mobileOpen
                        ? "0"
                        : "-240px"
                      : "0",
                    top: 0,
                    height: "100%",
                    zIndex: 1000,
                    width: collapsed ? "80px" : "240px"
                  }}
                >
                  {/* Toggle Collapse (Desktop only) */}
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
                      <h2 style={{ marginBottom: "5px" }}>FactoryFlow</h2>

                      <div style={userBox}>
                        Welcome, <b>{user?.username}</b>
                        <br />
                        Role:
                        <span style={roleBadge}>
                          {user?.role}
                        </span>
                      </div>
                    </>
                  )}

                  <NavItem to="/" icon={<DashboardIcon />} label="Dashboard" collapsed={collapsed} setMobileOpen={setMobileOpen} />
                  <NavItem to="/workers" icon={<PeopleIcon />} label="Workers" collapsed={collapsed} setMobileOpen={setMobileOpen} />
                  <NavItem to="/attendance" icon={<EventAvailableIcon />} label="Attendance" collapsed={collapsed} setMobileOpen={setMobileOpen} />
                  <NavItem to="/calendar" icon={<CalendarMonthIcon />} label="Calendar" collapsed={collapsed} setMobileOpen={setMobileOpen} />
                  <NavItem to="/history" icon={<HistoryIcon />} label="History" collapsed={collapsed} setMobileOpen={setMobileOpen} />
                  <NavItem to="/analytics" icon={<InsightsIcon />} label="Analytics" collapsed={collapsed} setMobileOpen={setMobileOpen} />

                  {user?.role === "admin" && (
                    <>
                      <NavItem to="/salary" icon={<PaymentsIcon />} label="Salary" collapsed={collapsed} setMobileOpen={setMobileOpen} />
                      <NavItem to="/add-worker" icon={<PersonAddIcon />} label="Add Worker" collapsed={collapsed} setMobileOpen={setMobileOpen} />
                      <NavItem to="/users" icon={<PeopleIcon />} label="Users" collapsed={collapsed} setMobileOpen={setMobileOpen} />
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

                {/* ================= MAIN CONTENT ================= */}

                <AnimatedPage dark={dark}>
                  <div style={main}>
                    {/* Top Header */}
                    <div style={topHeader}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {isMobile && (
                          <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            style={{
                              background: "transparent",
                              border: "none",
                              fontSize: "22px",
                              marginRight: "10px",
                              cursor: "pointer"
                            }}
                          >
                            ☰
                          </button>
                        )}

                        <div>
                          <h3 style={{ margin: 0 }}>
                            Welcome back, {user?.username} 👋
                          </h3>
                          <span style={{ color: "#64748b", fontSize: "13px" }}>
                            Here’s what’s happening in your factory today.
                          </span>
                        </div>
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
                </AnimatedPage>
              </div>
            }
          />
        )}
      </Routes>
    </Router>
  );
}

/* ================= NAV ITEM ================= */

function NavItem({ to, label, icon, collapsed, setMobileOpen }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      style={{
        ...navItem,
        background: isActive ? "#334155" : "transparent"
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {icon}
        {!collapsed && label}
      </span>
    </Link>
  );
}

/* ================= ANIMATED WRAPPER ================= */

function AnimatedPage({ children, dark }) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: dark ? "#0f172a" : "#f4f6f9",
        transition: "all 0.3s ease"
      }}
    >
      {children}
    </div>
  );
}

/* ================= STYLES ================= */

const sidebar = {
  background: "linear-gradient(180deg, #111827, #0f172a)",
  boxShadow: "4px 0 20px rgba(0,0,0,0.3)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  color: "white",
  transition: "all 0.3s ease"
};

const navItem = {
  color: "white",
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: "10px",
  fontSize: "15px",
  transition: "all 0.2s ease"
};

const toggleBtn = {
  background: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "18px",
  marginBottom: "10px"
};

const logoutBtn = {
  marginTop: "auto",
  padding: "8px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const themeBtn = {
  padding: "8px",
  background: "#334155",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const main = {
  padding: "20px",
  width: "100%"
};

const userBox = {
  fontSize: "13px",
  marginBottom: "15px"
};

const roleBadge = {
  marginLeft: "5px",
  background: "#2563eb",
  padding: "2px 8px",
  borderRadius: "10px",
  fontSize: "11px"
};

const roleBadgeHeader = {
  background: "#2563eb",
  color: "white",
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "12px"
};

const topHeader = {
  background: "white",
  padding: "16px 20px",
  borderRadius: "14px",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
};

export default App;