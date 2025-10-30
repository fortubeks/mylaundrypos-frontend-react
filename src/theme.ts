import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#008aff',
      light: '#33a3ff',
      dark: '#0070cc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#17c100',
      light: '#4dd633',
      dark: '#0f9100',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    success: {
      main: '#17c100',
      light: '#4dd633',
      dark: '#0f9100',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#008aff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      color: '#000000',
    },
    h2: {
      fontWeight: 600,
      color: '#000000',
    },
    h3: {
      fontWeight: 600,
      color: '#000000',
    },
    h4: {
      fontWeight: 600,
      color: '#000000',
    },
    h5: {
      fontWeight: 500,
      color: '#000000',
    },
    h6: {
      fontWeight: 500,
      color: '#000000',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;

