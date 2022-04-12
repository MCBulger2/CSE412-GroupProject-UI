import React from "react";
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import Conversation from "./Conversation/Conversation";
import TitleBar from "./TitleBar/TitleBar";
import Login from "./Login/Login";
import Register from "./Login/Register";
import { useMemo, useState } from "react";
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { amber, deepOrange, grey } from '@mui/material/colors';
import { CssBaseline, PaletteMode } from '@mui/material';

const getDesignTokens = (mode) => ({
  palette: {
    mode
  },
});

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const App = () => {
  const [mode, setMode] = useState("dark");
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
