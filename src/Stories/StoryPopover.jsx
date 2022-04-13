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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../constants";
import useApiRequest from "../useApiRequest";
import moment from "moment";

import "./stories.scss";
import { Send } from "@mui/icons-material";
import useCurrentUser from "../useCurrentUser";
import useInterval from "../useInterval";

const StoryPopover = (props) => {
  const { user_id, name, canPost } = props;

  const [refresh, setRefresh] = useState(false);
  const feed = useApiRequest(`/profile/${user_id}/feed`, [], [refresh]);

  useInterval(() => setRefresh(true), 1000 * 60);
  useEffect(() => {
    if (refresh === "manual")
    {
      var div = document.querySelector(".story-list");
      div.scrollTop = 0;
      setRefresh(false);
    }
  }, [feed]);
  useEffect(() => {
    if (refresh === true) {
      setRefresh(false);
    }
  }, [refresh]);

  const [newMessage, setNewMessage] = useState("");
  const { getCookie } = useCurrentUser();

  const handleSend = async () => {
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

    if (!response.ok) {
      return;
    }

    const obj = await response.json();

    setNewMessage("");
    setRefresh("manual");
  };

  return (
    <>
      <div>
        <Avatar
          className="profile-picture-abs"
          alt={name}
          src={`${baseUrl}/profile/${user_id}/picture`}
          sx={{ width: 75, height: 75 }}
        />
        <Typography variant="h6" className="story-popover-name">
          {name}
        </Typography>
      </div>

      {canPost && (
        <div className="mt-1">
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
          >
            Post
          </Button>
        </div>
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
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </div>
      ) : (
        <Typography style={{textAlign: "center"}} variant="h6">No posts</Typography>
      )}
    </>
  );
};

export default StoryPopover;
