import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  CarFront,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MoonStar,
  Settings2,
  SunMedium,
  UsersRound,
  WalletCards,
} from 'lucide-react';

import { ToastProvider } from './components/Toast';
import { I18nProvider } from './context/i18nContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import GlobalSearch from './components/GlobalSearch';
import NotificationBell from './components/NotificationBell';
import PageTransition from './components/PageTransition';
import CommandPalette from './components/CommandPalette';

import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Vehicles from './pages/Vehicles';
import Deals from './pages/Deals';
import Partners from './pages/Partners';
import Marketing from './pages/Marketing';
import Analytics from './pages/Analytics';
import Search from './pages/Search';
import Settings from './pages/Settings';
import HealthMonitor from './pages/HealthMonitor';
import Login from './pages/Login';
import Finance from './pages/Finance';
import { getInitials } from './utils/format';

const navigationSections = [
  {
    title: 'Overview',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Executive overview' },
      { path: '/analytics', label: 'Analytics', icon: BarChart3, description: 'Sales & performance' },
      { path: '/health', label: 'System Health', icon: Activity, description: 'Services & audit trail' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { path: '/customers', label: 'Customers', icon: UsersRound, description: 'CRM & loan applications' },
      { path: '/vehicles', label: 'Vehicles', icon: CarFront, description: 'Inventory & suppliers' },
      { path: '/deals', label: 'Deal Flow', icon: ArrowLeftRight, description: 'Transaction lifecycle' },
      { path: '/finance', label: 'Finance Portal', icon: WalletCards, description: 'Reviews & approvals' },
    ],
  },
  {
    title: 'Growth',
    items: [
      { path: '/partners', label: 'Partnerships', icon: HeartHandshake, description: 'Agreements & commissions' },
      { path: '/marketing', label: 'Marketing', icon: Megaphone, description: 'Leads & campaigns' },
      { path: '/settings', label: 'Settings', icon: Settings2, description: 'Preferences & configuration' },
    ],
  },
];

const allNavItems = navigationSections.flatMap((s) => s.items.map((i) => ({ ...i, sectionTitle: s.title })));

const sidebarStorageKey = 'merkato_sidebar_collapsed';

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function Sidebar({ collapsed, mobileOpen, onClose, onToggleCollapse }) {
  const user = getCurrentUser();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  return (
    <aside className={`sidebar-shell ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-header">
        <div className="brand-block">
          <div className="brand-mark">MM</div>
          <div className="sidebar-copy">
            <span className="eyebrow">Vehicle Financing</span>
            <div className="brand-name">Merkato Motors</div>
          </div>
        </div>
        <button
          className="sidebar-toggle-btn"
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* User profile */}
      <div className="sidebar-profile">
        <div className="sidebar-profile-avatar">{getInitials(user?.name || 'MM')}</div>
        <div className="sidebar-profile-copy">
          <div className="sidebar-profile-name">{user?.name || 'Platform Admin'}</div>
          <div className="sidebar-profile-meta">{user?.role || 'Administrator'}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navigationSections.map((section) => (
          <div key={section.title} className="sidebar-group">
            <div className="sidebar-group-title">{section.title}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  onClick={onClose}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-link-icon">
                    <Icon size={17} strokeWidth={2.1} />
                  </span>
                  <span className="sidebar-link-copy">
                    <span className="sidebar-link-label">{item.label}</span>
                    <span className="sidebar-link-desc">{item.description}</span>
                  </span>
                </NavLink>
              );
            })}
          </div>
        ))}

        {/* Logout at bottom of nav */}
        <div className="sidebar-group" style={{ marginTop: 'auto' }}>
          <button
            className="sidebar-link"
            type="button"
            onClick={handleLogout}
            style={{ width: '100%', textAlign: 'left' }}
          >
            <span className="sidebar-link-icon">
              <LogOut size={17} strokeWidth={2.1} />
            </span>
            <span className="sidebar-link-copy">
              <span className="sidebar-link-label">Sign Out</span>
            </span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

function ServiceBanner() {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handler = (event) => setError(event.detail || 'A service is currently unavailable');
    window.addEventListener('api-error', handler);
    return () => window.removeEventListener('api-error', handler);
  }, []);

  if (!error) return null;

  return (
    <div className="service-banner">
      <span><strong>Service warning:</strong> {error}. Some data may be stale until connectivity is restored.</span>
      <button className="btn btn-sm btn-secondary" type="button" onClick={() => setError(null)}>
        Dismiss
      </button>
    </div>
  );
}

function Header({ onToggleSidebar, onOpenMobileNav }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const routeMeta = useMemo(() => {
    return allNavItems.find((item) => item.path === location.pathname) || {
      label: 'Search',
      sectionTitle: 'Workspace',
    };
  }, [location.pathname]);

  return (
    <header className="topbar">
      <div className="topbar-leading">
        <button className="header-icon-btn topbar-mobile-toggle" type="button" onClick={onOpenMobileNav} aria-label="Open navigation">
          <Menu size={17} strokeWidth={2.2} />
        </button>
        <button
          className="header-icon-btn topbar-sidebar-toggle"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={17} strokeWidth={2.2} />
        </button>
        <div className="topbar-heading">
          <div className="topbar-route-meta">
            <span className="eyebrow">Merkato Motors</span>
            <span className="topbar-route-dot" />
            <span>{routeMeta.sectionTitle}</span>
          </div>
          <h1>{routeMeta.label}</h1>
        </div>
      </div>

      <div className="topbar-actions">
        <GlobalSearch />
        <button className="header-icon-btn" type="button" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle dark mode">
          {theme === 'dark' ? <SunMedium size={17} strokeWidth={2.2} /> : <MoonStar size={17} strokeWidth={2.2} />}
        </button>
        <NotificationBell />
        <div className="header-user-chip">
          <div className="header-avatar">{getInitials(currentUser?.name || 'MM')}</div>
          <div>
            <div className="header-user-name">{currentUser?.name || 'Admin'}</div>
            <div className="header-user-role">{currentUser?.role || 'admin'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function AppLayout() {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem(sidebarStorageKey) === 'true',
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(sidebarStorageKey, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className={`app-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isMobileNavOpen ? 'sidebar-mobile-open' : ''}`}>
      {isMobileNavOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      <Sidebar
        collapsed={isSidebarCollapsed}
        mobileOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((c) => !c)}
      />

      <div className="workspace-shell">
        <ServiceBanner />
        <Header
          onToggleSidebar={() => setIsSidebarCollapsed((c) => !c)}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
        />

        <main className="main-content">
          <PageTransition>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/health" element={<HealthMonitor />} />
              <Route path="/search" element={<Search />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </PageTransition>
        </main>
      </div>

      <CommandPalette />

      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav">
        {[
          { path: '/dashboard', icon: LayoutDashboard },
          { path: '/customers', icon: UsersRound },
          { path: '/vehicles', icon: CarFront },
          { path: '/finance', icon: WalletCards },
          { path: '/settings', icon: Settings2 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon size={20} strokeWidth={2.2} />
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')));

  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
              <Route path="/*" element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
