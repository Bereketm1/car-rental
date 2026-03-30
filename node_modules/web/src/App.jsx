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
  Megaphone,
  Menu,
  MoonStar,
  Settings2,
  SunMedium,
  UsersRound,
  WalletCards,
} from 'lucide-react';

import { ToastProvider } from './components/Toast';
import { I18nProvider, useI18n } from './context/i18nContext';
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
      { path: '/analytics', label: 'Analytics', icon: BarChart3, description: 'Commercial performance' },
      { path: '/health', label: 'Platform health', icon: Activity, description: 'Services and audit trail' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { path: '/customers', label: 'Customer CRM', icon: UsersRound, description: 'Registration, interests, loans' },
      { path: '/vehicles', label: 'Supplier portal', icon: CarFront, description: 'Inventory and supplier records' },
      { path: '/deals', label: 'Deal flow', icon: ArrowLeftRight, description: 'Selection through purchase' },
      { path: '/finance', label: 'Finance portal', icon: WalletCards, description: 'Reviews and institutions' },
    ],
  },
  {
    title: 'Growth',
    items: [
      { path: '/partners', label: 'Partnerships', icon: HeartHandshake, description: 'Agreements and commissions' },
      { path: '/marketing', label: 'Marketing', icon: Megaphone, description: 'Leads, campaigns, referrals' },
      { path: '/settings', label: 'Settings', icon: Settings2, description: 'Workspace preferences and controls' },
    ],
  },
];

const allNavigationItems = navigationSections.flatMap((section) =>
  section.items.map((item) => ({ ...item, sectionTitle: section.title })),
);

const sidebarStorageKey = 'merkatomotors_sidebar_collapsed';

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function getNavigationLabel(item, t) {
  return item.path === '/dashboard' ? t('dashboard') : item.label;
}

function Sidebar({ collapsed, mobileOpen, onClose, onToggleCollapse }) {
  const { t } = useI18n();
  const location = useLocation();
  const user = getCurrentUser();

  const activeItem = useMemo(
    () => allNavigationItems.find((item) => item.path === location.pathname) || allNavigationItems[0],
    [location.pathname],
  );

  return (
    <aside className={`sidebar-shell ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-block">
          <div className="brand-mark">MM</div>
          <div className="sidebar-copy">
            <p className="eyebrow">Vehicle financing platform</p>
            <div className="brand-name">Merkato Motors</div>
          </div>
        </div>

        <button
          className="sidebar-toggle-btn"
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-profile-avatar">{getInitials(user?.name || 'Merkato Motors')}</div>
        <div className="sidebar-profile-copy">
          <div className="sidebar-profile-name">{user?.name || 'Platform Admin'}</div>
          <div className="sidebar-profile-meta">{user?.role || 'Operations lead'}</div>
        </div>
      </div>

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
                    <Icon size={18} strokeWidth={2.1} />
                  </span>
                  <span className="sidebar-link-copy">
                    <span className="sidebar-link-label">{getNavigationLabel(item, t)}</span>
                    <small className="sidebar-link-desc">{item.description}</small>
                  </span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer-card">
        <div className="sidebar-footer-head">
          <span className="sidebar-status-dot" />
          <span>Workspace focus</span>
        </div>
        <div className="sidebar-footer-metric">{allNavigationItems.length}</div>
        <p>{activeItem.label} is active in the current operating view.</p>
      </div>
    </aside>
  );
}

function ServiceBanner() {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handler = (event) => setError(event.detail || 'A platform service is unavailable');
    window.addEventListener('api-error', handler);
    return () => window.removeEventListener('api-error', handler);
  }, []);

  if (!error) return null;

  return (
    <div className="service-banner">
      <div>
        <strong>Service warning:</strong> {error}. The workspace is still usable, but some records may be stale until connectivity is restored.
      </div>
      <button className="btn btn-secondary" type="button" onClick={() => setError(null)}>
        Dismiss
      </button>
    </div>
  );
}

function Header({ isSidebarCollapsed, onToggleSidebar, onOpenMobileNav }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const routeMeta = useMemo(() => {
    const current = allNavigationItems.find((item) => item.path === location.pathname);

    return (
      current || {
        label: 'Search',
        description: 'Cross-platform search and result curation',
        sectionTitle: 'Workspace',
      }
    );
  }, [location.pathname]);

  return (
    <header className="topbar">
      <div className="topbar-leading">
        <button className="header-icon-btn topbar-mobile-toggle" type="button" onClick={onOpenMobileNav} aria-label="Open navigation">
          <Menu size={18} strokeWidth={2.2} />
        </button>
        <button
          className="header-icon-btn topbar-sidebar-toggle"
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} strokeWidth={2.2} /> : <ChevronLeft size={18} strokeWidth={2.2} />}
        </button>

        <div className="topbar-heading">
          <div className="topbar-route-meta">
            <span className="eyebrow">Merkato Motors workspace</span>
            <span className="topbar-route-dot" />
            <span>{routeMeta.sectionTitle}</span>
          </div>
          <h1>Operations console</h1>
          <p>{routeMeta.label} · {routeMeta.description}</p>
        </div>
      </div>

      <div className="topbar-actions">
        <GlobalSearch />
        <button className="header-icon-btn" type="button" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <SunMedium size={18} strokeWidth={2.2} /> : <MoonStar size={18} strokeWidth={2.2} />}
        </button>
        <NotificationBell />
        <div className="header-user-chip">
          <div className="header-avatar">{getInitials(currentUser?.name || 'Merkato Motors')}</div>
          <div>
            <div className="header-user-name">{currentUser?.name || 'Admin User'}</div>
            <div className="header-user-role">{currentUser?.role || 'admin'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function AppLayout() {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem(sidebarStorageKey) === 'true');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(sidebarStorageKey, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className={`app-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isMobileNavOpen ? 'sidebar-mobile-open' : ''}`}>
      {isMobileNavOpen ? (
        <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setIsMobileNavOpen(false)} />
      ) : null}

      <Sidebar
        collapsed={isSidebarCollapsed}
        mobileOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
      />

      <div className="workspace-shell">
        <ServiceBanner />
        <Header
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((current) => !current)}
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
              <Icon size={19} strokeWidth={2.3} />
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
