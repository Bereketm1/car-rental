import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0E5F4B',
      dark: '#094737',
      light: '#2F8E75',
    },
    secondary: {
      main: '#C88211',
    },
    background: {
      default: '#F3F7F8',
      paper: '#FFFFFF',
    },
    success: {
      main: '#1F8A5B',
    },
    warning: {
      main: '#CA8B18',
    },
    error: {
      main: '#CF3B35',
    },
    info: {
      main: '#2F73C9',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'Manrope, "IBM Plex Sans", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '1.65rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.3rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.1rem',
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #D8E5E8',
          boxShadow: '0 8px 24px rgba(4, 30, 36, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: '14px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
