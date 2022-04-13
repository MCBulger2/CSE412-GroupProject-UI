import { Avatar, Container, Paper, Typography } from "@mui/material";
import React from "react";
import { baseUrl } from "../constants";
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
    <Container>
        <Typography variant="h3">Profile</Typography>
        <Typography variant="caption">Click your profile picture to view and post to your story.</Typography>
      <Paper className="profile-paper">
          <div>
        
        <div className="showcase">
          <div className="stories">
            <StoryIcon canPost {...user} />
          </div>
          <div className="ml-2" style={{flexGrow: 1}}>
            <Typography variant="h4">{user.username}</Typography>
            <Typography variant="h6">{user.name}</Typography>
          </div>
        </div>
        </div>
      </Paper>
      <Feed />
    </Container>
  );
};

export default Profile;
