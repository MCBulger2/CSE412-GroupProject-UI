import { LoginRounded, PersonAdd, PersonAddRounded } from "@mui/icons-material";
import {
  Paper,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { baseUrl } from "../constants";
import Loading from "../Utils/Loading";

import "./login.scss";
import RegisterFields from "./RegisterFields";

const Register = (props) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [birthday, setBirthday] = useState(undefined);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading]=  useState(false);
  const navigate = useNavigate();

  const [imageSrc, setImageSrc] = useState("Current");
  const [selectedFile, setSelectedFile] = useState(null);

  const register = async (e) => {
    e.preventDefault();

    // let file;
    // if (selectedFile) {
    //   const [file, og] = await getFile(selectedFile);
    // }

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

    setIsLoading(true);
    const obj = {
      username,
      name,
      birthday: birthday ? `${birthday.getFullYear()}-${birthday.getMonth()}-${birthday.getDate()}` : undefined,
      pw_hash: password,
      profile_picture: selectedFile
        ? imageSrc.replace(/^.*;base64,/, "")
        : undefined,
      isJpeg: !imageSrc.includes("/png;base64")
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
      setError(
        "There was an issue creating your account. Please choose a unique username."
      );
      setIsLoading(false);
      return;
    }

    const user = await result.json();
    navigate("/login");
  };

  return (
    <div className="login-page">
      <Paper className="login-paper" elevation={3}>
        <form onSubmit={register}>
          <Typography className="header" variant="h3">
            Register
          </Typography>
          <RegisterFields
            error={error}
            name={name}
            setName={setName}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            repeatPassword={repeatPassword}
            setRepeatPassword={setRepeatPassword}
            birthday={birthday}
            setBirthday={setBirthday}
            imageSrc={imageSrc}
            selectedFile={selectedFile}
            setImageSrc={setImageSrc}
            setSelectedFile={setSelectedFile}
          />
          <Button
            variant="contained"
            startIcon={<PersonAddRounded />}
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
      <Loading open={isLoading} />
    </div>
  );
};

export default Register;
