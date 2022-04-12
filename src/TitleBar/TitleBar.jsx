import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Avatar, useTheme } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import useCurrentUser from "../useCurrentUser";
import Switch from "./Switch";

import "./titlebar.scss";
import { baseUrl } from "../constants";

const TitleBar = (props) => {
  const {
    mode,
    setMode
  } = props;

  let navigate = useNavigate();

  const { getUserId, getUsername, clearUser } = useCurrentUser();

  const user_id = getUserId();
  const username = getUsername();
  console.log(username);

  const logout = async () => {
    fetch(`${baseUrl}/auth/logout`, {
      credentials: "include",
      cookie: document.cookie,
    });
    clearUser();
    navigate("/login");
  };

  return (
    <div className="title-bar">
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Messaging Application
          </Typography>
          <Switch checked={mode === "dark"} onChange={() => setMode(mode === "dark" ? "light" : "dark")}/>
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
          <Button color="inherit" onClick={logout}>
            {username ? "Logout" : "Login"}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TitleBar;
