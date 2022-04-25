import React, { useEffect } from "react";
import {
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  Avatar,
  useTheme,
} from "@mui/material";
import DatePicker from "react-date-picker";
import { Upload, UploadFileRounded } from "@mui/icons-material";

import "./login.scss";

const MAX_IMAGE_SIZE = 4; // max image size in megabytes

/**
 * Component containing the fields to Register/Update a profile
 * @param {*} props
 * @returns
 */
const RegisterFields = (props) => {
  const {
    hidePassword,
    name,
    setName,
    username,
    setUsername,
    password,
    setPassword,
    repeatPassword,
    setRepeatPassword,
    birthday,
    setBirthday,
    setError,
    error,
    selectedFile,
    imageSrc,
    setSelectedFile,
    setImageSrc,
    shrink,
  } = props;

  const theme = useTheme(); // Get theme for dark mode

  /**
   * Fetches the selected file to send to the API and display the preview
   * @param {string} file - the name of the selected file
   * @returns the encoded file 
   */
  const getFile = async (file) => {
    return new Promise((resolve, reject) => {
      var fileReader = new FileReader();
      fileReader.onload = () => {
        resolve([
          fileReader.result.replace("data:image/png;base64,", ""),
          fileReader.result,
        ]);
      };
      fileReader.readAsDataURL(file);
    });
  };

  /**
   * Upload a profile picture and validate its format
   * @param {*} e 
   * @returns 
   */
  const uploadFile = (e) => {
    const file = e.target.files[0];
    if (file.size > 1048576 * MAX_IMAGE_SIZE) {
      setError("Profile pictures must be under 4MB.");
      return;
    }
    setSelectedFile(file);
  };

  // If the selected file is "Current", it means its coming from the API, so use that image source instead
  useEffect(() => {
    if (selectedFile && selectedFile !== "Current") {
      getFile(selectedFile).then(([file, og]) => setImageSrc(og));
    }
  }, [selectedFile]);

  return (
    <>
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
        InputLabelProps={shrink ? { shrink } : undefined}
      />
      <TextField
        className="input"
        label="Username"
        fullWidth
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputLabelProps={shrink ? { shrink } : undefined}
      />
      {!hidePassword && (
        <>
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
        </>
      )}
      <div className="bday">
        <div className="bday-legend">Birthday:</div>
        <DatePicker
          className={`birthday-input ${theme.palette.mode}`}
          onChange={setBirthday}
          value={birthday}
        />
      </div>
      <div className="picture-container">
        <Typography style={{ textAlign: "left", marginBottom: "5px" }}>
          You can optionally upload a profile picture for your account:
        </Typography>
        <Button
          component="label"
          className="mb-2"
          startIcon={<UploadFileRounded />}
          variant="outlined"
        >
          Upload Profile Picture
          <input
            type="file"
            hidden
            onChange={uploadFile}
            accept="image/jpeg, image/png"
          />
        </Button>
        <Paper variant="outlined" square className="preview-paper">
          <>
            <Avatar
              src={imageSrc || name || " "}
              alt={name?.toUpperCase()}
              sx={{ width: 75, height: 75 }}
            />
            <Typography variant="caption" component="div" className="d-block">
              {imageSrc
                ? selectedFile?.name || selectedFile
                : "No file selected"}
            </Typography>
          </>
        </Paper>
      </div>
    </>
  );
};

export default RegisterFields;
