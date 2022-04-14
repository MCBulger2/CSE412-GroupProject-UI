import { LoginRounded, PersonAdd, Upload } from "@mui/icons-material";
import {
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  Avatar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import { useNavigate } from "react-router-dom";
import { ButtonGroup } from "reactstrap";
import { baseUrl } from "../constants";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

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
  const [imageSrc, setImageSrc] = useState("");

  const getFile = async (file) => {
    return new Promise((resolve, reject) => {
      var fileReader = new FileReader();
      fileReader.onload = () => {
        resolve([
          fileReader.result.replace("data:image/png;base64,", ""),
          fileReader.result,
        ])
      };
      fileReader.readAsDataURL(file);
    });
  };

  const register = async (e) => {
    e.preventDefault();

    let file;
    if (selectedFile) {
      const [file, og] = await getFile(selectedFile);
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

    const obj = {
      username,
      name,
      birthday: `${birthday.getFullYear()}-${birthday.getMonth()}-${birthday.getDate()}`,
      pw_hash: password,
      profile_picture: selectedFile ? imageSrc.replace("data:image/png;base64,", "") : undefined
    };
    const body = JSON.stringify(obj);
    const result = await fetch(`${baseUrl}/profile`, {
      method: "POST",
      credentials: "include",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    
    if (!result.ok) {
      setError("There was an issue creating yourr account. Please choose a unique username.");
      return;
    }

    const user = await result.json();
    navigate("/login");
  };

  const handleBirthdayChange = (newDate) => {
    setBirthday(newDate);
  };

  const uploadFile = (e) => {
    const file = e.target.files[0];
    if (file.size > 1048576*2) {
      setError("Profile pictures must be under 2MB.");
      return;
    }
    setSelectedFile(file);
  };

  useEffect(() => {
    if (selectedFile) {
      getFile(selectedFile).then(([file, og]) => setImageSrc(og));
    }
  }, [selectedFile])

  return (
    <div className="login-page">
      <Paper className="login-paper" elevation={3}>
        <form onSubmit={register}>
          <Typography className="header" variant="h3">
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
          <div className="picture-container">
            <Typography style={{textAlign: "left", marginBottom: "5px"}}>You can optionally upload a profile picture for your account:</Typography>
            <Button
              variant="contained"
              component="label"
              className="mb-2"
              startIcon={<Upload />}
            >
              Upload Profile Picture
              <input type="file" hidden onChange={uploadFile} accept=".png"/>
            </Button>
            <Paper variant="outlined" square className="preview-paper">
              <>
                <Avatar
                  src={imageSrc || name}
                  alt={name.toUpperCase()}
                  sx={{ width: 75, height: 75 }}
                />
                <Typography
                  variant="caption"
                  component="div"
                  className="d-block"
                >
                  {imageSrc ? selectedFile?.name : "No file selected"}
                </Typography>
              </>
            </Paper>
          </div>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={register}
            type="submit"
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
