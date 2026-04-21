import React, { useState, useEffect } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme as useMuiTheme } from "@mui/material/styles";
import { LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme as useWorkspaceTheme } from "../context/ThemeContext";
import { getInitials } from "../utils/format";
import NotificationBell from "./NotificationBell";

const pageMap = {
  "/dashboard": { title: "Executive Overview", section: "Dashboards" },
  "/customers": { title: "Customer CRM", section: "Manage Data" },
  "/vehicles": { title: "Vehicle Inventory", section: "Manage Data" },
  "/finance": { title: "Financial Portal", section: "Growth & Finance" },
  "/deals": { title: "Deal Lifecycle", section: "Manage Data" },
  "/partners": { title: "Partnerships", section: "Growth & Finance" },
  "/marketing": { title: "Lead & Marketing", section: "Growth & Finance" },
  "/analytics": { title: "Reporting & Analytics", section: "Dashboards" },
  "/health": { title: "System Health", section: "Utilities" },
  "/search": { title: "Global Search", section: "Utilities" },
  "/documentation": {
    title: "System Guide & Documentation",
    section: "Utilities",
  },
  "/settings": { title: "Workspace Settings", section: "Utilities" },
};

export default function Header({ onToggleSidebar, user, onLogout }) {
  const muiTheme = useMuiTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useWorkspaceTheme();
  
  const searchParams = new URLSearchParams(location.search);
  const qParam = searchParams.get("q") || "";
  const [search, setSearch] = useState(qParam);

  useEffect(() => {
    if (location.pathname === "/search") {
      setSearch(qParam);
    } else {
      setSearch("");
    }
  }, [location.pathname, qParam]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const safeSearch = search || "";
      if (safeSearch.trim() !== qParam.trim() && safeSearch.trim() !== "") {
        navigate(`/search?q=${encodeURIComponent(safeSearch.trim())}`);
      } else if (safeSearch.trim() === "" && location.pathname === "/search" && qParam !== "") {
        navigate("/search");
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [search, navigate, qParam, location.pathname]);

  const isDark = muiTheme.palette.mode === "dark";

  const page = pageMap[location.pathname] || {
    title: "Merkato Motors",
    section: "Marketplace Ops",
  };

  const controlSx = {
    border: "1px solid",
    borderColor: alpha(muiTheme.palette.divider, isDark ? 0.85 : 0.72),
    bgcolor: alpha(muiTheme.palette.background.paper, isDark ? 0.76 : 0.96),
    color: "text.primary",
    width: 38,
    height: 38,
  };

  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  function submitSearch(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const safeSearch = search || "";
      if (safeSearch.trim()) {
        navigate(`/search?q=${encodeURIComponent(safeSearch.trim())}`);
      }
    }
  }

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        top: 0,
        borderBottom: "1px solid",
        borderColor: alpha(muiTheme.palette.divider, isDark ? 0.88 : 0.72),
        bgcolor: isDark
          ? alpha("#081121", 0.88)
          : alpha(muiTheme.palette.background.paper, 0.84),
        backdropFilter: "blur(14px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "76px !important",
          px: { xs: 1.5, md: 2.2 },
          display: "flex",
          justifyContent: "space-between",
          gap: 1.2,
        }}
      >
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="center"
          sx={{ minWidth: 0 }}
        >
          <IconButton
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
            sx={controlSx}
          >
            <Menu size={18} />
          </IconButton>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "1.09rem", md: "1.26rem" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {page.title}
            </Typography>
            <Chip
              size="small"
              label={page.section}
              sx={{
                mt: 0.3,
                height: 20,
                fontWeight: 700,
                border: "1px solid",
                borderColor: alpha(
                  muiTheme.palette.primary.main,
                  isDark ? 0.35 : 0.2,
                ),
                bgcolor: alpha(
                  muiTheme.palette.primary.main,
                  isDark ? 0.16 : 0.12,
                ),
                color: isDark
                  ? muiTheme.palette.primary.light
                  : muiTheme.palette.primary.dark,
              }}
            />
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1.1}
          alignItems="center"
          sx={{ flexShrink: 0 }}
        >
          <TextField
            size="small"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={submitSearch}
            placeholder="Search by customer, vehicle, deal..."
            sx={{
              width: { xs: 160, md: 310 },
              display: { xs: "none", sm: "block" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: alpha(
                  muiTheme.palette.background.paper,
                  isDark ? 0.62 : 0.94,
                ),
                "& fieldset": {
                  borderColor: alpha(
                    muiTheme.palette.divider,
                    isDark ? 0.9 : 0.72,
                  ),
                },
                "&:hover fieldset": {
                  borderColor: alpha(muiTheme.palette.primary.main, 0.45),
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <IconButton onClick={toggleTheme} sx={controlSx}>
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </IconButton>
          </Tooltip>
          <NotificationBell />
          <Tooltip title="Sign out">
            <IconButton onClick={onLogout} sx={controlSx}>
              <LogOut size={17} />
            </IconButton>
          </Tooltip>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              pl: 0.9,
              borderLeft: "1px solid",
              borderColor: alpha(
                muiTheme.palette.divider,
                isDark ? 0.88 : 0.72,
              ),
            }}
          >
            <Avatar
              sx={{
                width: 35,
                height: 35,
                bgcolor: "primary.main",
                fontWeight: 800,
                fontSize: "0.78rem",
              }}
            >
              {getInitials(user?.name || "Workspace Admin")}
            </Avatar>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography
                sx={{ fontSize: "0.84rem", fontWeight: 700, lineHeight: 1.05 }}
              >
                {user?.name || "Workspace Admin"}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.74rem",
                  textTransform: "capitalize",
                }}
              >
                {user?.role || "Administrator"}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
