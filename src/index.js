import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './components/App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import darkTheme from './components/UI/DarkTheme';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <CustomThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CustomThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
