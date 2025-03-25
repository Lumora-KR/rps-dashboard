import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { ThemeProvider as CustomThemeProvider } from "./contexts/ThemeContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4361ee",
      dark: "#3a56d4",
      light: "#637efc",
    },
    secondary: {
      main: "#ff9800",
      dark: "#f57c00",
      light: "#ffb74d",
    },
    success: {
      main: "#2ec4b6",
      dark: "#21a99d",
      light: "#48d1c5",
    },
    error: {
      main: "#e63946",
      dark: "#d32f2f",
      light: "#ef5350",
    },
    warning: {
      main: "#ff9f1c",
      dark: "#f57c00",
      light: "#ffb74d",
    },
    info: {
      main: "#4cc9f0",
      dark: "#0288d1",
      light: "#4dd0e1",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-2px)",
            transition: "all 0.3s ease",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CustomThemeProvider>
  </React.StrictMode>
);
