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

                {/* ================= SIDEBAR ================= */}

                <div
                  style={{
                    ...sidebar,
                    width: collapsed ? "80px" : "240px"
                  }}
                >

                  {/* Toggle */}
                  <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={toggleBtn}
                  >
                    {collapsed ? "»" : "«"}
                  </button>

                  {/* Logo + User */}
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

                  {/* Navigation */}
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

                  {/* Theme */}
                  <button onClick={() => setDark(!dark)} style={themeBtn}>
                    {!collapsed && (dark ? "Light Mode ☀️" : "Dark Mode 🌙")}
                  </button>

                  {/* Logout */}
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

                      <div>
                        <h3 style={{ margin: 0 }}>
                          Welcome back, {user?.username} 👋
                        </h3>

                        <span style={{ color: "#64748b", fontSize: "13px" }}>
                          Here’s what’s happening in your factory today.
                        </span>
                      </div>

                      <div style={roleBadgeHeader}>
                        {user?.role}
                      </div>

                    </div>


                    {/* Routes */}
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

function NavItem({ to, label, icon, collapsed }) {

  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        ...navItem,
        background: isActive ? "#334155" : "transparent"
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "#1e293b";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
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

  const location = useLocation();

  return (
    <div
      key={location.pathname}
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
  padding: "20px"
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