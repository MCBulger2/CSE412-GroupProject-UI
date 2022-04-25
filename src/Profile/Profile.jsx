import {
  PersonAdd,
  Publish,
  PublishRounded,
  Update,
  Upgrade,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Button,
  Container,
  Divider,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import RegisterFields from "../Login/RegisterFields";
import BottomNavigation from "../Main/BottomNavigation";
import StoryIcon from "../Stories/StoryIcon";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";
import Loading from "../Utils/Loading";

import "./profile.scss";

/**
 * Displays the Profile page, where you can post to your story, or update your profile/password.
 * @returns 
 */
const Profile = () => {
  const navigate = useNavigate();

  // Get the current user to load their profile
  const { getUserId, getCookie } = useCurrentUser();
  const user_id = getUserId();

  // Get the full user account info
  const user = useApiRequest(`/profile/${user_id}`, {}, [profileUpdated, passwordUpdated]);

  // Control when snackbars/loading are displayed
  const {state} = useLocation();
  const [profileUpdated, setProfileUpdated] = useState(state?.profileUpdated ?? false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // User entered fields/errors
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Fields for 
  const [imageSrc, setImageSrc] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // When the account info is loaded from the API
  useEffect(() => {
    if (user.user_id) { // loading was successful
      // Reinitialize fields with new data
      setIsLoading(false);
      setName(user.name);
      setUsername(user.username);
      setPassword("");
      setNewPassword("");
      setRepeatPassword("");

      // Format birthday
      const bday = user?.birthday?.split("-");
      if (bday?.length == 3) setBirthday(new Date(bday[0], bday[1], bday[2]));

      // Format profile picture
      setImageSrc(`${baseUrl}/profile/${user.user_id}/picture`);
      setSelectedFile("Current");
    }
  }, [user]);

  /**
   * Update the account info (except for password)
   * @param {Event} e
   */
  const update = async (e) => {
    e.preventDefault();

    if (name.length < 1) {
      setError("Please enter a name.");
      return;
    }

    if (username.length < 1) {
      setError("Please enter a username.");
      return;
    }

    setIsLoading(true);
    const pf = selectedFile == "Current" ? "keep" : imageSrc.replace(/^.*;base64,/, "")
    const obj = {
      username,
      name,
      birthday: birthday
        ? `${birthday.getFullYear()}-${birthday.getMonth()}-${birthday.getDate()}`
        : undefined,
      profile_picture: selectedFile ? pf : undefined,
      isJpeg: !imageSrc.includes("/png;base64")
    };
    const body = JSON.stringify(obj);
    const result = await fetch(`${baseUrl}/profile`, {
      method: "PUT",
      credentials: "include",
      cookie: getCookie(),
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!result.ok) {
      setError(
        "There was an issue updating your account. Please choose a unique username."
      );
      setIsLoading(false);
      return;
    }
    navigate(0, { state: { profileUpdated: true } });
    //setProfileUpdated(true);
  };

  /**
   * Update the current password
   * @param {Event} e
   */
  const updatePassword = async (e) => {
    e.preventDefault();

    if (password.length < 5) {
      setPasswordError("The original password you entered was invalid.");
    }

    if (newPassword !== repeatPassword) {
      setPasswordError("The passwords you entered do not match.");
      return;
    }

    if (newPassword.length < 5) {
      setPasswordError("Your password must be at least 5 characters long.");
      return;
    }
    setIsLoading(true);
    const result = await fetch(`${baseUrl}/profile/password`, {
      method: "PUT",
      credentials: "include",
      cookie: getCookie(),
      body: JSON.stringify({
        password,
        newPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setIsLoading(false);
    if (!result.ok) {
      setPasswordError(await result.text());
      return;
    }
    setPasswordUpdated(true);
  };

  return (
    <>
      <Container className="profile-page">
        <Typography variant="h3">Profile</Typography>
        <Typography>
          Click your profile picture to view and post to your story.
        </Typography>
        <Paper className="profile-paper">
          <div className="showcase">
            <div className="main d-flex align-items-center">
              <div className="stories">
                <StoryIcon canPost {...user} />
              </div>
              <div className="ml-2" style={{ flexGrow: 1 }}>
                <Typography variant="h4">{user.username}</Typography>
                <Typography variant="h6">{user.name}</Typography>
              </div>
            </div>
            <div className="d-flex flex-column">
              {/* maybe put a change password button here or something */}
            </div>
          </div>
        </Paper>
        <div className="login-page">
          <form onSubmit={update}>
            <div className="login-paper">
              <Typography className="header" variant="h5">
                Update Profile
              </Typography>
              <RegisterFields
                hidePassword
                error={error}
                name={name}
                setName={setName}
                username={username}
                setUsername={setUsername}
                birthday={birthday}
                setBirthday={setBirthday}
                imageSrc={imageSrc}
                selectedFile={selectedFile}
                setImageSrc={setImageSrc}
                setSelectedFile={setSelectedFile}
                shrink
              />
              <Button
                variant="contained"
                startIcon={<PublishRounded />}
                onClick={update}
                type="submit"
              >
                Update Profile
              </Button>
            </div>
          </form>
          <Divider />
          <form onSubmit={updatePassword}>
            <div className="login-paper">
              <Typography className="header" variant="h5">
                Update Password
              </Typography>
              {passwordError && (
                <Alert style={{ marginBottom: "20px" }} severity="error">
                  {passwordError}
                </Alert>
              )}
              <TextField
                className="input"
                label="Old Password"
                fullWidth
                type="password"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                className="input"
                label="New Password"
                fullWidth
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                className="input"
                label="Repeat New Password"
                fullWidth
                type="password"
                autoComplete="new-password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              <Button
                variant="contained"
                startIcon={<PublishRounded />}
                onClick={updatePassword}
                type="submit"
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </Container>
      <BottomNavigation />
      <Loading open={isLoading} />
      <Snackbar
        open={state?.profileUpdated || profileUpdated}
        autoHideDuration={5000}
        onClose={() => setProfileUpdated(false)}
      >
        <Alert
          severity="success"
          onClose={() => setProfileUpdated(false)}
          sx={{ width: "100%" }}
        >
          Your profile has been updated successfully. You may need to refresh the page to see the effects.
        </Alert>
      </Snackbar>
      <Snackbar
        open={passwordUpdated}
        autoHideDuration={5000}
        onClose={() => setPasswordUpdated(false)}
      >
        <Alert
          severity="success"
          onClose={() => setPasswordUpdated(false)}
          sx={{ width: "100%" }}
        >
          Your password has been updated successfully.
        </Alert>
      </Snackbar>
      <Loading open={isLoading} />
    </>
  );
};

export default Profile;
