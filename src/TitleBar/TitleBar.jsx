import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Avatar, Tooltip, useTheme } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import useCurrentUser from "../useCurrentUser";
import Switch from "./Switch";

import "./titlebar.scss";
import { baseUrl } from "../constants";

/**
 * Display the Title bar containg the login/logout link, light/dark mode switch, and logged in user
 * @param {*} props 
 * @returns {Element}
 */
const TitleBar = (props) => {
  const {
    mode,
    setMode
  } = props;

  let navigate = useNavigate();

  // Get current user account info
  const { getUserId, getUsername, clearUser, getCookie } = useCurrentUser();
  const user_id = getUserId();
  const username = getUsername();

  /**
   * Log out of the current account and redirect the login page
   */
  const logout = async () => {
    fetch(`${baseUrl}/auth/logout`, {
      credentials: "include",
      cookie: getCookie(),
    });
    clearUser();
    navigate("/login");
  };

  return (
    <div className="title-bar">
      <AppBar>
        <Toolbar>
          <Typography className="app-title" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Messaging Application
          </Typography>
          <div className="right-toolbar-items">
          <Tooltip title={mode === "dark" ? "Dark Mode Enabled" : "Light Mode Enabled"}>
            <span className="ml-auto">
              <Switch checked={mode === "dark"} onChange={() => setMode(mode === "dark" ? "light" : "dark")}/>
            </span>
          </Tooltip>
          <span className="welcome d-flex align-items-center">
          {!!user_id && 
          <Avatar
            className="profile-picture"
            alt={username}
            src={`${baseUrl}/profile/${user_id}/picture`}
          />}
          {username && (
            <Typography component="div">
              Welcome, <b>{username}</b>!
            </Typography>
          )}
          </span>
          <Button color="inherit" onClick={logout}>
            {username ? "Logout" : "Login"}
          </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TitleBar;
