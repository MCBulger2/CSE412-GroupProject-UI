import {
  Avatar,
  Typography,
  Popover,
  Divider,
  ListItemText,
  ListItem,
  List,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { baseUrl } from "../constants";
import useApiRequest from "../useApiRequest";

import "./stories.scss";
import StoryPopover from "./StoryPopover";

const StoryIcon = (props) => {
  const { user_id, name, username, canPost } = props;

  

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    event.currentTarget.className += "anchorEl ";
  };

  const handleClose = () => {
    anchorEl.className = anchorEl.className.replace("anchorEl", "");
    setAnchorEl(null);
  };

  return (
    <>
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleClose}
      marginThreshold={20}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{ className: "story-popover-paper" }}
    >
      {!!anchorEl && <StoryPopover {...props} />}
      </Popover>
      <div onClick={handleClick}>
        <div className="story-icon">
          <Avatar
            className="profile-picture"
            alt={name}
            src={`${baseUrl}/profile/${user_id}/picture`}
          />
        </div>
        {!canPost && <Typography className="name-label" variant="caption">
          {name}
        </Typography>}
      </div>
    </>
  );
};

export default StoryIcon;
