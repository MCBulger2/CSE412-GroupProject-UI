import React, { useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import Conversation from "./Conversation/Conversation";
import TitleBar from "./TitleBar/TitleBar";
import Login from "./Login/Login";
import Register from "./Login/Register";
import { useMemo, useState } from "react";
import { ThemeProvider, useTheme, createTheme } from "@mui/material/styles";
import { amber, deepOrange, grey } from "@mui/material/colors";
import { CssBaseline, PaletteMode } from "@mui/material";
import BottomNavigation from "./Main/BottomNavigation";
import Profile from "./Profile/Profile";
import Friends from "./Friends/Friends";

// Create the MUI theme for the entire application (used for special dark mode styles)
const getDesignTokens = (mode) => ({
  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: mode === "dark" ? "#1e3250" : "#1976d2",
          borderTop: `1px solid ${mode === "dark" ? "#333" : "#eee"}`,
          color: "green",
          "&$selected": {
            color: "red",
          },
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: mode === "dark" ? "#bbb" : "#ccc",
          opacity: 1,
          textDecoration: "none",
          "&.Mui-selected": {
            color: "white"
          },
          "&:hover": {
            color: "#eee",
            textDecoration: "none",
          }
        }
      }
    }
  },
  palette: {
    mode
  },
});

// Create a Context so that any component in the application can see the theme state
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const App = () => {
  // Switch between light and dark mode
  const [mode, setMode] = useState(localStorage.getItem("theme_mode") ?? "dark"); // Default to dark mode
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  // Store whether the user is in light/dark mode whenever the user changes it so it persists across sessions
  useEffect(() => {
    localStorage.setItem("theme_mode", mode);
  }, [mode]);

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <div className="screen">
            <TitleBar mode={mode} setMode={setMode} />
            <div className="page">
              <Routes>
                <Route path="/" element={<Main />} />
                <Route
                  path="/conversation/:conversationId"
                  element={<Conversation />}
                />
                <Route
                  path="/friends"
                  element={<Friends />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
