import { LoginRounded, PersonAdd } from "@mui/icons-material";
import { Paper, TextField, Typography, Button, Alert } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import Loading from "../Utils/Loading";

import "./login.scss";

/**
 * Displays the Login page, where you can enter a username and password to login
 * @param {*} props 
 * @returns 
 */
const Login = (props) => {
  const [username, setUsername] = useState(""); // Currently entered username
  const [password, setPassword] = useState(""); // Currently entered password
  const [error, setError] = useState(false); // If not false, displays the error in a banner
  const [isLoading, setIsLoading] = useState(false); // If true, loading animation is played
  
  const navigate = useNavigate(); // Get navigate function so we can redirect to home page on successful login

  /**
   * Attempts to log the user in with the entered credentials
   * @param {Event} e - click/submit event
   */
  const login = async (e) => {
    e.preventDefault(); // Prevent page refresh when hitting enter key
    setIsLoading(true);

    const result = await fetch(
      `${baseUrl}/auth?username=${username}&pw_hash=${password}`,
      { credentials: "include" }
    );

    setError(!result.ok);
    if (!result.ok) {
      setIsLoading(false);
      return;
    }

    const user = await result.json();
    sessionStorage.setItem("user_id", user.user_id);

    const result2 = await fetch(`${baseUrl}/profile/${user.user_id}`, {
      credentials: "include",
    });
    const user_full = await result2.json();
    sessionStorage.setItem("username", user_full.username);

    navigate("/");
  };

  return (
    <div className="login-page">
      <Paper className="login-paper" elevation={3}>
        <form onSubmit={login}>
          <Typography className="header" variant="h3">
            Login
          </Typography>
          {error && (
            <Alert style={{ marginBottom: "20px" }} severity="error">
              There was an issue with the username or password you provided.
            </Alert>
          )}
          <TextField
            className="input"
            label="Username"
            fullWidth
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            className="input"
            label="Password"
            fullWidth
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={<LoginRounded />}
            onClick={login}
            type="submit"
          >
            Login
          </Button>
          <div style={{ width: "100%", marginTop: "20px" }}>
            <Typography style={{ display: "inline" }}>New User?</Typography>
            <Button
              endIcon={<PersonAdd />}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        </form>
      </Paper>
      <Loading open={isLoading} />
    </div>
  );
};

export default Login;
