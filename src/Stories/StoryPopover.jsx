import {
  Avatar,
  Typography,
  Popover,
  Divider,
  ListItemText,
  ListItem,
  List,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Tooltip,
  LinearProgress,
  styled
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../constants";
import useApiRequest from "../useApiRequest";
import moment from "moment";

import "./stories.scss";
import { Send } from "@mui/icons-material";
import useCurrentUser from "../useCurrentUser";
import useInterval from "../useInterval";
import { Close } from "@mui/icons-material";

const FastLinearProgress = styled(LinearProgress)({
  "& .MuiLinearProgress-bar": {
    animationDuration: "0.05s"
  }
});

const StoryPopover = (props) => {
  const { user_id, name, username, canPost } = props;

  const [refresh, setRefresh] = useState(false);
  const [deleting, setDeleting] = useState([]);
  const [progress, setProgress] = useState(false);
  const feed = useApiRequest(`/profile/${user_id}/feed`, [], [refresh]);

  useInterval(() => setRefresh(true), 1000 * 60);
  useEffect(() => {
    if (refresh === "manual")
    {
      setProgress(90);
      var div = document.querySelector(".story-list");
      if (div) div.scrollTop = 0;
      setRefresh(false);
      setProgress(100);
    }
  }, [feed]);
  useEffect(() => {
    if (refresh === true) {
      setRefresh(false);
    }
  }, [refresh]);
  useEffect(() => {
    if (progress == 100) {
      setTimeout(() => setProgress(false), 1000)
    }
  }, [progress])

  const [newMessage, setNewMessage] = useState("");
  const { getCookie } = useCurrentUser();

  const handleSend = async (e) => {
    e.preventDefault();
    setProgress(30);

    const body = JSON.stringify({
      content: newMessage,
    });
    document.cookie = getCookie();
    console.log(document.cookie);

    const response = await fetch(`${baseUrl}/profile/feed/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      credentials: "include",
      cookie: getCookie(),
    });
    setProgress(60);
    if (!response.ok) {
      return;
    }

    const obj = await response.json();
    setProgress(80);
    setNewMessage("");
    setRefresh("manual");
  };

  const handleDelete = async (message) => {
    setDeleting([message.message_id, ...deleting]);
    const response = await fetch(`${baseUrl}/profile/feed/${message.message_id}`, {
      method: "DELETE",
      credentials: "include",
      cookie: getCookie(),
    });

    setRefresh(true);
  };

  return (
    <>
    {progress && <FastLinearProgress className="loading-bar-story" variant="determinate" value={progress === false ? 0 : progress} />}
      <div>
        <Avatar
          className="profile-picture-abs"
          alt={name}
          src={`${baseUrl}/profile/${user_id}/picture`}
          sx={{ width: 75, height: 75 }}
        />
        <div className="name-info">
        <Typography variant="h6" className="story-popover-name">
          {name}
        </Typography>
        <Typography variant="caption" className="story-popover-username">
          {username}
        </Typography>
        </div>
      </div>

      {canPost && (
        <form className="mt-1 d-flex" onSubmit={handleSend}>
          
          <TextField
            value={newMessage}
            variant="filled"
            label="Story Post"
            placeholder="Say something to your friends..."
            fullWidth
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            variant="outlined"
            endIcon={<Send />}
            disabled={newMessage.length === 0}
            onClick={handleSend}
            type="submit"
          >
            Post
          </Button>
          
        </form>
      )}
      {feed.length > 0 ? (
        <div className={`story-list ${canPost ? "can-post" : ""}`}>
          <List sx={{ width: "100%" }}>
            {feed.slice(0).reverse().map((message) => (
              <React.Fragment key={message.message_id}>
                <ListItem alignItems="flex-start" className="conversation">
                  <ListItemText
                    primary={message.content}
                    secondary={moment(message.timestamp).format(
                      "MMMM d, h:mm A"
                    )}
                  />
                  {deleting.includes(message.message_id) && <CircularProgress className="mr-2"/>}
                  {canPost && <Tooltip title={"Delete Post"}>
                  <IconButton onClick={() => handleDelete(message)} className="align-self-center">
                      <Close />
                  </IconButton>
                  </Tooltip>}
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </div>
      ) : (
        <Typography style={{textAlign: "center", paddingTop: "10px"}} variant="h6">No posts</Typography>
      )}
    </>
  );
};

export default StoryPopover;
