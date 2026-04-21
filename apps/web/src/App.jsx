import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import CommandPalette from "./components/CommandPalette";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { ToastProvider } from "./components/Toast";

const Analytics = lazy(() => import("./pages/Analytics"));
const Customers = lazy(() => import("./pages/Customers"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Deals = lazy(() => import("./pages/Deals"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Finance = lazy(() => import("./pages/Finance"));
const HealthMonitor = lazy(() => import("./pages/HealthMonitor"));
const Login = lazy(() => import("./pages/Login"));
const Marketing = lazy(() => import("./pages/Marketing"));
const Partners = lazy(() => import("./pages/Partners"));
const Search = lazy(() => import("./pages/Search"));
const Settings = lazy(() => import("./pages/Settings"));
const Vehicles = lazy(() => import("./pages/Vehicles"));

const SIDEBAR_WIDTH = 272;

function RouteFallback() {
  return (
    <div className="page-shell">
      <div className="empty-state" style={{ minHeight: "42vh" }}>
        <h3>Loading workspace modules...</h3>
        <p>Please wait while the dashboard initializes.</p>
      </div>
    </div>
  );
}

function AppLayout({ user, onLogout }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  return (
    <Box className="app-bg">
      <Sidebar
        open={sidebarOpen}
        isDesktop={isDesktop}
        onClose={() => setSidebarOpen(false)}
      />

      <Box
        sx={{
          minHeight: "100vh",
          marginLeft: isDesktop && sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
          transition: theme.transitions.create("margin-left", {
            duration: theme.transitions.duration.shorter,
          }),
        }}
      >
        <Header
          onToggleSidebar={() => setSidebarOpen((current) => !current)}
          user={user}
          onLogout={onLogout}
        />
        <main className="app-main">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/health" element={<HealthMonitor />} />
            <Route path="/search" element={<Search />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <CommandPalette />
      </Box>
    </Box>
  );
}

function getSession() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return { token, user };
  } catch {
    return { token, user: {} };
  }
}

export default function App() {
  const [session, setSession] = useState(() => getSession());

  useEffect(() => {
    const onStorage = () => setSession(getSession());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const user = useMemo(() => session?.user || {}, [session]);

  function handleLogin() {
    setSession(getSession());
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSession(null);
  }

  return (
    <ToastProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route
              path="/login"
              element={
                session ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/*"
              element={
                session ? (
                  <AppLayout user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}
