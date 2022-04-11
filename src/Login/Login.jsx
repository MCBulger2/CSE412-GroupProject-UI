import { LoginRounded } from "@mui/icons-material";
import { Paper, TextField, Typography, Button } from "@mui/material";
import React from "react";

import "./login.scss";

const Login = () => {
    return (
        <div className="login-page">
            <Paper className="login-paper" elevation={3}>
                <Typography className="header" variant="h5">Login</Typography>
                <TextField className="input" label="Username" fullWidth autoComplete="username" />
                <TextField className="input" label="Password" fullWidth type="password" autoComplete="current-password" />
                <Button variant="contained" startIcon={<LoginRounded />}>
                    Login
                </Button>
            </Paper>
        </div>
    );
};

export default Login;