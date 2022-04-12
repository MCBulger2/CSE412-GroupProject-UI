import { LoginRounded, PersonAdd } from "@mui/icons-material";
import { Paper, TextField, Typography, Button, Alert } from "@mui/material";
import React, { useState } from "react";
import DatePicker from "react-date-picker";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";

import "./login.scss";

const Register = (props) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [birthday, setBirthday] = useState(undefined);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  console.log(selectedFile);

    const getFile = async (file) => {
        return new Promise((resolve, reject) => {
            var fileReader = new FileReader();
            fileReader.onload = () => resolve(fileReader.result.replace("data:image/png;base64,", ""));
            fileReader.readAsDataURL(file);
        });
        
    };

  const register = async () => {
    let file;
    if (selectedFile)
    {
        file = await getFile(selectedFile);
        console.log(file);
    }

    if (name.length < 1) {
      setError("Please enter a name.");
      return;
    }

    if (username.length < 1) {
      setError("Please enter a username.");
      return;
    }

    if (password !== repeatPassword) {
      setError("The passwords you entered do not match.");
      return;
    }

    if (password.length < 5) {
      setError("Your password must be at least 5 characters long.");
      return;
    }

    const result = await fetch(`${baseUrl}/profile`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        username,
        name,
        birthday: `${birthday.getFullYear()}-${birthday.getMonth()}-${birthday.getDate()}`,
        pw_hash: password,
        profile_picture: file
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setError(!result.ok);
    if (!result.ok) {
      return;
    }

    const user = await result.json();
    navigate("/login");
  };

  const handleBirthdayChange = (newDate) => {
    setBirthday(newDate);
  };

  return (
    <div className="login-page">
      <Paper className="login-paper" elevation={3}>
        <form>
          <Typography className="header" variant="h5">
            Register
          </Typography>
          {error && (
            <Alert style={{ marginBottom: "20px" }} severity="error">
              {error}
            </Alert>
          )}
          <TextField
            className="input"
            label="Name"
            fullWidth
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            className="input"
            label="Repeat Password"
            fullWidth
            type="password"
            autoComplete="new-password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          <div className="bday">
            <div className="bday-legend">Birthday:</div>
            <DatePicker
              className="birthday-input"
              onChange={handleBirthdayChange}
              value={birthday}
              required
            />
          </div>
          <Button variant="contained" component="label">
            Upload Profile Picture
            <input
              type="file"
              hidden
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </Button>
          {selectedFile?.name}
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={register}
          >
            Register
          </Button>
          <div style={{ width: "100%", marginTop: "20px" }}>
            <Typography style={{ display: "inline" }}>
              Already have an account?
            </Typography>
            <Button
              endIcon={<LoginRounded />}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Register;
