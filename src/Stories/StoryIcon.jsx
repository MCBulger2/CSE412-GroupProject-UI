import { Avatar, Typography } from "@mui/material";
import React from "react";
import { baseUrl } from "../constants";

import "./stories.scss";

const StoryIcon = (props) => {
    const {
        user_id,
        name
    } = props;

    return (
        <div className="story-icon">
            <Avatar
            className="profile-picture"
            alt={name}
            src={`${baseUrl}/profile/${user_id}/picture`}
          />
          <Typography className="name-label" variant="caption">{name}</Typography>
        </div>
    );
};

export default StoryIcon;