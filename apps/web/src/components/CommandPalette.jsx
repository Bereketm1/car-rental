import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BookOpen,
  CarFront,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Search,
  Settings2,
  Sparkles,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { useI18n } from "../context/i18nContext";

const actionIcons = {
  dashboard: LayoutDashboard,
  customers: UsersRound,
  vehicles: CarFront,
  deals: Sparkles,
  finance: WalletCards,
  marketing: Megaphone,
  health: Activity,
  settings: Settings2,
  analytics: BarChart3,
  partners: HeartHandshake,
  documentation: BookOpen,
  logout: LogOut,
};

export default function CommandPalette() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const actions = useMemo(
    () => [
      {
        id: "dashboard",
        title: t("dashboard"),
        shortcut: "G D",
        path: "/dashboard",
      },
      {
        id: "customers",
        title: t("customers"),
        shortcut: "G C",
        path: "/customers",
      },
      {
        id: "vehicles",
        title: t("vehicles"),
        shortcut: "G V",
        path: "/vehicles",
      },
      { id: "deals", title: t("deals"), shortcut: "G L", path: "/deals" },
      {
        id: "finance",
        title: "Finance Portal",
        shortcut: "G F",
        path: "/finance",
      },
      {
        id: "partners",
        title: t("partners"),
        shortcut: "G P",
        path: "/partners",
      },
      {
        id: "marketing",
        title: t("marketing"),
        shortcut: "G M",
        path: "/marketing",
      },
      {
        id: "analytics",
        title: t("analytics"),
        shortcut: "G A",
        path: "/analytics",
      },
      { id: "health", title: t("health"), shortcut: "G H", path: "/health" },
      {
        id: "documentation",
        title: t("documentation"),
        shortcut: "G ?",
        path: "/documentation",
      },
      {
        id: "settings",
        title: t("settings"),
        shortcut: "G S",
        path: "/settings",
      },
      {
        id: "logout",
        title: t("logout") || "Logout",
        shortcut: "L O",
        action: "LOGOUT",
      },
    ],
    [t],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const filteredActions = actions.filter((action) =>
    action.title.toLowerCase().includes(query.toLowerCase()),
  );

  function handleAction(action) {
    if (!action) return;

    if (action.action === "LOGOUT") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }

    if (action.path) {
      navigate(action.path);
    }
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={() => setIsOpen(false)}>
      <div
        className="command-palette"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="command-input-wrap">
          <Search size={18} strokeWidth={2.2} />
          <input
            ref={inputRef}
            placeholder={t("search_anything")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (!filteredActions.length) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelectedIndex(
                  (current) => (current + 1) % filteredActions.length,
                );
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelectedIndex(
                  (current) =>
                    (current - 1 + filteredActions.length) %
                    filteredActions.length,
                );
              }
              if (event.key === "Enter") {
                handleAction(filteredActions[selectedIndex]);
              }
            }}
          />
          <div className="command-esc">ESC</div>
        </div>
        <div className="command-list">
          {filteredActions.length ? (
            filteredActions.map((action, index) => {
              const Icon = actionIcons[action.id] || Sparkles;
              return (
                <button
                  key={action.id}
                  type="button"
                  className={`command-item ${index === selectedIndex ? "active" : ""}`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleAction(action)}
                >
                  <div className="command-item-main">
                    <span className="command-icon">
                      <Icon size={16} strokeWidth={2.2} />
                    </span>
                    <span className="command-title">{action.title}</span>
                  </div>
                  <div className="command-shortcut">{action.shortcut}</div>
                </button>
              );
            })
          ) : (
            <div className="empty-state" style={{ minHeight: "180px" }}>
              <h3>No commands found</h3>
              <p>
                Try a module name like customers, finance, analytics, or guide.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
