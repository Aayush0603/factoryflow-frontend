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
              <div
                style={{
                  display: isMobile ? "block" : "flex",
                  minHeight: "100vh",
                  position: "relative"
                }}
              >
                {/* Overlay */}
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

                {/* Sidebar */}
                <div
                  style={{
                    background:
                      "linear-gradient(180deg, #111827, #0f172a)",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    color: "white",
                    transition: "all 0.3s ease",
                    position: isMobile ? "fixed" : "relative",
                    left:
                      isMobile && !mobileOpen ? "-240px" : "0",
                    width: collapsed ? "80px" : "240px",
                    minHeight: "100vh",
                    zIndex: 1000
                  }}
                >
                  {!isMobile && (
                    <button
                      onClick={() => setCollapsed(!collapsed)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "18px"
                      }}
                    >
                      {collapsed ? "»" : "«"}
                    </button>
                  )}

                  {!collapsed && (
                    <>
                      <h2>FactoryFlow</h2>
                      <div style={{ fontSize: "13px" }}>
                        Welcome, <b>{user?.username}</b>
                      </div>
                    </>
                  )}

                  <NavItem to="/" icon={<DashboardIcon />} label="Dashboard" collapsed={collapsed} setMobileOpen={setMobileOpen} />
                  <NavItem to="/workers" icon={<PeopleIcon />} label="Workers" collapsed={collapsed} setMobileOpen={setMobileOpen} />
                  <NavItem to="/attendance" icon={<EventAvailableIcon />} label="Attendance" collapsed={collapsed} setMobileOpen={setMobileOpen} />
                  <NavItem to="/analytics" icon={<InsightsIcon />} label="Analytics" collapsed={collapsed} setMobileOpen={setMobileOpen} />

                  <button
                    style={{
                      marginTop: "auto",
                      padding: "8px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      sessionStorage.clear();
                      window.location.href = "/login";
                    }}
                  >
                    {!collapsed && "Logout"}
                  </button>
                </div>

                {/* MAIN CONTENT */}
                <div style={{ flex: 1, padding: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      marginBottom: "20px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {isMobile && (
                        <button
                          onClick={() => setMobileOpen(!mobileOpen)}
                          style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "22px",
                            cursor: "pointer"
                          }}
                        >
                          ☰
                        </button>
                      )}
                      <h3 style={{ margin: 0 }}>
                        Welcome back, {user?.username} 👋
                      </h3>
                    </div>
                  </div>

                  <Routes>
                    <Route path="/" element={<Dashboard dark={dark} />} />
                    <Route path="/workers" element={<Workers />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/worker/:id" element={<WorkerProfile />} />
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

function NavItem({ to, label, icon, collapsed, setMobileOpen }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      style={{
        color: "white",
        textDecoration: "none",
        padding: "10px",
        borderRadius: "8px",
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

export default App;