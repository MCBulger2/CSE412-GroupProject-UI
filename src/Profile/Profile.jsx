import {
  PersonAdd,
  Publish,
  PublishRounded,
  Update,
  Upgrade,
} from "@mui/icons-material";
import { Avatar, Button, Container, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import RegisterFields from "../Login/RegisterFields";
import BottomNavigation from "../Main/BottomNavigation";
import StoryIcon from "../Stories/StoryIcon";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";
import Loading from "../Utils/Loading";

import "./profile.scss";

const Profile = () => {
  const { getUserId } = useCurrentUser();
  const user_id = getUserId();
  const user = useApiRequest(`/profile/${user_id}`, {});

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const [imageSrc, setImageSrc] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user.user_id) {
      setName(user.name);
      setUsername(user.username);

      const bday = user?.birthday?.split("-")
      if (bday?.length == 3)
        setBirthday(new Date(bday[0], bday[1], bday[2]));
      setImageSrc("data:image/png;base64," + user.profile_picture);
      console.log(imageSrc)
      setSelectedFile("Current");
    }
  }, [user]);

  const update = async (e) => {
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

    setIsLoading(true);
    const obj = {
      username,
      name,
      birthday: birthday ? `${birthday.getFullYear()}-${birthday.getMonth()}-${birthday.getDate()}` : undefined,
      profile_picture: selectedFile
        ? imageSrc.replace("data:image/png;base64,", "")
        : undefined,
    };
    const body = JSON.stringify(obj);
    const result = await fetch(`${baseUrl}/profile`, {
      method: "PUT",
      credentials: "include",
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
    console.log('here');
    const user = await result.json();
    navigate(0);
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
        </div>
      </Container>
      <BottomNavigation />
      <Loading open={isLoading} />
    </>
  );
};

export default Profile;
