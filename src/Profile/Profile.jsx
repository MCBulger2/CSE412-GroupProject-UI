import { Avatar, Button, Container, Paper, Typography } from "@mui/material";
import React from "react";
import { baseUrl } from "../constants";
import BottomNavigation from "../Main/BottomNavigation";
import StoryIcon from "../Stories/StoryIcon";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";
import Feed from "./Feed";

import "./profile.scss";

const Profile = () => {
  const { getUserId } = useCurrentUser();
  const user_id = getUserId();
  const user = useApiRequest(`/profile/${user_id}`, {});

  return (
    <>
    <Container className="profile-page pt-5 pl-4 pr-4">
        <Typography variant="h3">Profile</Typography>
        <Typography variant="caption">Click your profile picture to view and post to your story.</Typography>
      <Paper className="profile-paper">
        
        <div className="showcase">
          <div className="main d-flex align-items-center">
          <div className="stories">
            <StoryIcon canPost {...user} />
          </div>
          <div className="ml-2" style={{flexGrow: 1}}>
            <Typography variant="h4">{user.username}</Typography>
            <Typography variant="h6">{user.name}</Typography>
          </div>
          </div>
          <div className="d-flex flex-column">
            <Button variant="contained">Upload Profile Picture</Button>
            <Button>Edit Name</Button>
            <Button>Edit Username</Button>
          </div>
        </div>
      </Paper>
    </Container>
    <BottomNavigation />
    </>
  );
};

export default Profile;
