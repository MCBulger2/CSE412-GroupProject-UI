import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";

import "./conversation.scss";
import { styled, AppBar, Fab, IconButton, TextField, Typography, useTheme, Slide, Collapse, LinearProgress } from "@mui/material";
import { ChevronLeft, Send } from "@mui/icons-material";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";
import { baseUrl } from "../constants";
import useInterval from "../useInterval";
import Loading from "../Utils/Loading";

// Create a custom Loading bar that animates faster than normal
const FastLinearProgress = styled(LinearProgress)({
  "& .MuiLinearProgress-bar": {
    animationDuration: "0.1s"
  }
});

/**
 * Displays all the messages in a single conversation in order
 * @returns {Element}
 */
const Conversation = () => {
  // Get the ID of the conversation from the URL
  let { conversationId } = useParams();

  // Get function to navigate to new page
  const navigate = useNavigate();

  // Get application theme (for dark mode)
  const theme = useTheme();

  const [newMessage, setNewMessage] = useState(""); // The currently typed message
  const [refresh, setRefresh] = useState(false); // If true, refetches the conversation
  const [progress, setProgress] = useState(false); // false or 0-100, determines if loading bar is showing
  const [isLoading, setIsLoading] = useState(true); // determines if full page loading is happening (initial load)

  // Get the current conversation from the URL parameter. Reload whenever "refresh" changes
  const conversation = useApiRequest(`/conversation/${conversationId}`, {}, [
    refresh,
  ]);

  // Get current user info (to get cookie and user_id)
  const { getUserId, getCookie } = useCurrentUser();
  const user_id = getUserId();

  /**
   * Sends a message in the current conversation
   * @param {Event} e - the click/submit event
   */
  const handleSend = async (e) => {
    e.preventDefault(); // Prevent page reload when pressing enter key
    setProgress(20);
    setNewMessage("");

    // Craft and send request to API
    const body = JSON.stringify({
      conversation_id: conversation.conversation_id,
      content: newMessage,
    });
    document.cookie = getCookie();
    setProgress(30);
    const response = await fetch(`${baseUrl}/conversation/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      credentials: "include",
      cookie: getCookie(),
    });
    setProgress(40);

    // If there was an error
    if (!response.ok) {
      setProgress(false);
      return;
    }

    // If we get here the message was sent successfully
    const obj = await response.json();
    setProgress(60);

    // Refresh the conversation
    setNewMessage("");
    setRefresh("manual");
  };

  // When the API request to get the conversation resolves, this runs
  useEffect(() => {
    if (refresh === "manual")
    {
      setProgress(90);
      // TODO fix scrolling to bottom especially on safari
      var div = document.querySelector(".conversation-list");
      div.scrollIntoView(false);
      div.scrollTop = 0;
        
      setRefresh(false);
      setProgress(100);
    }

    // If the conversation loaded properly, turn off loading screen (for initial load)
    if (!!conversation.conversation_id) {
      setIsLoading(false);
    }
  }, [conversation]);

  // Reload the conversation on a regular interval
  useInterval(() => setRefresh(true), 20000);
  useEffect(() => {
    if (refresh === true) {
      setRefresh(false);
    }
  }, [refresh]);

  // When the progress bar gets to 100, reset it back to false after 1s
  useEffect(() => {
    if (progress == 100) {
      setTimeout(() => setProgress(false), 1000)
    }
  }, [progress])

  // Get the readReceipts for all users in the conversation
  const readReceipts = useMemo(() => (
    conversation?.users?.reduce((prev, user) => {
      if (!user.read_receipt) return prev;

      const newVal = {...prev};
      if (prev[user.read_receipt]) {
        return { ...newVal, [user.read_receipt]: prev[user.read_receipt].concat(user) }
      }
      newVal[user.read_receipt] = [user];
      return newVal;
    }, {})
  ), [conversation, conversation?.users]);

  return (
    <>
      <div
        className={`top-bar ${theme.palette.mode}`}
        style={{
          position: "fixed",
          top: 64,
          bottom: "auto",
          marginBottom: "20px",
          minHeight: "78px"
        }}
      >
        <IconButton className="back-button" size="large" onClick={() => navigate("/")}><ChevronLeft fontSize="large" /></IconButton>
        <Typography variant="h6">{conversation.name}</Typography>
        <React.Fragment>
          {conversation?.users?.filter(u => u.user_id !== user_id).map((user, idx, convs) => (
            <Typography
              className="users-label"
              sx={{ display: "inline" }}
              component="span"
              variant="caption"
              key={user.user_id}
            >
              {user.name}
              {idx < convs.length - 1 ? ", " : ""}
            </Typography>
          ))}
        </React.Fragment>
        {progress && <FastLinearProgress className="loading-bar" variant="determinate" value={progress === false ? 0 : progress} />}
      </div>
      <div className="conversation-list">
        <div className="conversation-list-scroll">
          {conversation?.messages?.map((message, idx, messages) => (
            <React.Fragment key={message.message_id}>
              <MessageBubble
                message={message}
                prevMessage={messages[idx - 1]}
                isOutgoing={message.sender_id === user_id}
                nextMessage={messages[idx + 1]}
                isGroupConversation={conversation.users.length > 2}
                readReceipts={readReceipts?.[message.message_id]}
                user_id={user_id}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
      <form onSubmit={handleSend}>
      <div
        className={`bottom-bar ${theme.palette.mode}`}
        style={{ position: "fixed", top: "auto", bottom: 0, marginTop: "20px" }}
      >
        <Slide direction="up" appear in mountOnEnter unmountOnExit timeout={{enter: 200}}>
        <TextField
          className="mesage-input"
          label="Message"
          variant="filled"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        </Slide>
        <Slide direction="up" appear in mountOnEnter unmountOnExit timeout={{enter: 500}} >
        <div className="send-button-container">
          <Fab color="primary" aria-label="add" onClick={handleSend} disabled={newMessage.length === 0 || progress === 100} type="submit">
            <Send />
          </Fab>
        </div>
        </Slide>
      </div>
      </form>
      <Loading open={isLoading} />
    </>
  );
};

export default Conversation;
