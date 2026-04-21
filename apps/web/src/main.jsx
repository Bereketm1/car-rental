import React from "react";
import ReactDOM from "react-dom/client";
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";
import App from "./App";
import { I18nProvider } from "./context/i18nContext";
import {
  ThemeProvider as WorkspaceThemeProvider,
  useTheme as useWorkspaceTheme,
} from "./context/ThemeContext";
import "./index.css";

function AppThemeBridge() {
  const { theme } = useWorkspaceTheme();
  const surfaceBorder =
    theme === "dark"
      ? "1px solid rgba(91, 117, 174, 0.28)"
      : "1px solid #D5DDED";
  const paperShadow =
    theme === "dark"
      ? "0 14px 28px rgba(0, 0, 0, 0.32)"
      : "0 10px 20px rgba(21, 38, 73, 0.07)";
  const inputBackground = theme === "dark" ? "#16213F" : "#FFFFFF";

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: {
            main: "#2B4DA1",
            dark: "#1E3778",
            light: "#4F70C7",
          },
          secondary: {
            main: "#1E7A6B",
          },
          background: {
            default: theme === "dark" ? "#0E152C" : "#EEF2F8",
            paper: theme === "dark" ? "#161F3D" : "#FFFFFF",
          },
          success: {
            main: "#1F9D66",
          },
          warning: {
            main: "#C98A1A",
          },
          error: {
            main: "#C64747",
          },
          info: {
            main: "#2C6DCB",
          },
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontFamily: 'Public Sans, "Plus Jakarta Sans", sans-serif',
          h1: {
            fontWeight: 800,
            fontSize: "1.54rem",
            letterSpacing: "-0.02em",
          },
          h2: {
            fontWeight: 700,
            fontSize: "1.22rem",
            letterSpacing: "-0.01em",
          },
          h3: {
            fontWeight: 700,
            fontSize: "1.02rem",
          },
          button: {
            fontWeight: 700,
            textTransform: "none",
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                border: surfaceBorder,
                boxShadow: paperShadow,
                backgroundImage: "none",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                paddingInline: "14px",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                backgroundColor: inputBackground,
              },
              notchedOutline: {
                borderColor:
                  theme === "dark" ? "rgba(132, 156, 214, 0.28)" : undefined,
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                border: surfaceBorder,
                boxShadow: paperShadow,
              },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              toolbar: {
                color: theme === "dark" ? "#C0CEF2" : "#50658F",
              },
            },
          },
        },
      }),
    [inputBackground, paperShadow, surfaceBorder, theme],
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WorkspaceThemeProvider>
      <I18nProvider>
        <AppThemeBridge />
      </I18nProvider>
    </WorkspaceThemeProvider>
  </React.StrictMode>,
);
