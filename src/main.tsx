import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import { setCredentials } from './store/slices/authSlice';
import theme from './theme';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Check if user is authenticated
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

if (token && userStr) {
  try {
    const user = JSON.parse(userStr);
    // Initialize Redux store with saved credentials
    store.dispatch(setCredentials({ user, token }));
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

// Only render React app if root element exists
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
}

