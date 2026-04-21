import React from "react";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CarFront,
  ClipboardList,
  Database,
  HeartHandshake,
  LayoutDashboard,
  Megaphone,
  Search,
  Settings2,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const DRAWER_WIDTH = 272;

const navSections = [
  {
    key: "dashboard",
    label: "Dashboards",
    icon: LayoutDashboard,
    links: [
      {
        label: "Executive Overview",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Reporting & Analytics", path: "/analytics", icon: BarChart3 },
    ],
  },
  {
    key: "operations",
    label: "Manage Data",
    icon: Database,
    links: [
      { label: "Customer CRM", path: "/customers", icon: UsersRound },
      { label: "Vehicle Inventory", path: "/vehicles", icon: CarFront },
      { label: "Deal Lifecycle", path: "/deals", icon: ArrowLeftRight },
    ],
  },
  {
    key: "credit",
    label: "Growth & Finance",
    icon: WalletCards,
    links: [
      { label: "Financial Portal", path: "/finance", icon: WalletCards },
      { label: "Partnerships", path: "/partners", icon: HeartHandshake },
      { label: "Marketing & Leads", path: "/marketing", icon: Megaphone },
    ],
  },
  {
    key: "admin",
    label: "Utilities",
    icon: ClipboardList,
    links: [
      { label: "Global Search", path: "/search", icon: Search },
      { label: "System Health", path: "/health", icon: Activity },
      { label: "System Guide", path: "/documentation", icon: BookOpen },
      { label: "Workspace Settings", path: "/settings", icon: Settings2 },
    ],
  },
];

export default function Sidebar({ open, onClose, isDesktop }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(() =>
    Object.fromEntries(navSections.map((section) => [section.key, true])),
  );
  const isDark = theme.palette.mode === "dark";
  const drawerBackground = isDark
    ? "linear-gradient(180deg, #091225 0%, #10203E 48%, #15294F 100%)"
    : "linear-gradient(180deg, #16377E 0%, #204898 48%, #2A58B2 100%)";
  const sectionText = "rgba(231, 239, 255, 0.95)";
  const linkText = "rgba(222, 232, 255, 0.9)";
  const activeBg = isDark
    ? "rgba(117, 160, 255, 0.24)"
    : "rgba(104, 157, 255, 0.28)";

  function navigateTo(path) {
    navigate(path);
    if (!isDesktop) {
      onClose?.();
    }
  }

  function toggleSection(key) {
    setExpanded((current) => ({ ...current, [key]: !current[key] }));
  }

  function isSectionActive(section) {
    return section.links.some((link) => location.pathname === link.path);
  }

  const content = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: drawerBackground,
      }}
    >
      <Box sx={{ px: 2.6, pt: 2.7, pb: 2.1 }}>
        <Typography
          sx={{
            color: "#F5F8FF",
            fontWeight: 800,
            fontSize: "1.92rem",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Merkato Motors
        </Typography>
        <Typography
          sx={{
            mt: 0.65,
            color: "rgba(240, 246, 255, 0.86)",
            fontSize: "0.76rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          Native mobility finance operations
        </Typography>
      </Box>

      <Divider sx={{ borderColor: alpha("#D7E3FF", 0.18) }} />

      <Box sx={{ flex: 1, overflowY: "auto", px: 1.2, py: 1.4 }}>
        {navSections.map((section) => {
          const sectionActive = isSectionActive(section);
          const SectionIcon = section.icon;
          const sectionExpanded = expanded[section.key];

          return (
            <Box key={section.key} sx={{ mb: 0.7 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1,
                  py: 0.45,
                  borderRadius: 1.5,
                  color: sectionActive ? "#FFFFFF" : sectionText,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SectionIcon size={16} />
                  <Typography sx={{ fontWeight: 700, fontSize: "0.98rem" }}>
                    {section.label}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => toggleSection(section.key)}
                  size="small"
                  sx={{ color: "inherit", width: 26, height: 26 }}
                >
                  {sectionExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </IconButton>
              </Box>

              <Collapse in={sectionExpanded} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ mt: 0.2, ml: 0.2 }}>
                  {section.links.map((item) => {
                    const LinkIcon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <ListItemButton
                        key={item.path}
                        onClick={() => navigateTo(item.path)}
                        selected={isActive}
                        sx={{
                          borderRadius: 1.6,
                          minHeight: 38,
                          mb: 0.25,
                          pl: 1.2,
                          color: isActive ? "#FFFFFF" : linkText,
                          bgcolor: isActive ? activeBg : "transparent",
                          "&:hover": {
                            bgcolor: isActive
                              ? activeBg
                              : "rgba(255, 255, 255, 0.11)",
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 30, color: "inherit" }}>
                          <LinkIcon size={15} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: "0.9rem",
                            fontWeight: isActive ? 700 : 600,
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          px: 2.2,
          py: 1.6,
          borderTop: "1px solid rgba(201, 215, 255, 0.2)",
        }}
      >
        <Typography
          sx={{ color: "rgba(225, 236, 255, 0.85)", fontSize: "0.76rem" }}
        >
          Full platform guide included
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant={isDesktop ? "persistent" : "temporary"}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          borderRight: "none",
          boxShadow: isDark
            ? "10px 0 32px rgba(0, 0, 0, 0.38)"
            : "10px 0 32px rgba(18, 32, 67, 0.28)",
        },
      }}
    >
      {content}
    </Drawer>
  );
}
