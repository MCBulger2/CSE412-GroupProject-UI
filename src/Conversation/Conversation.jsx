import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";

import "./conversation.scss";
import { AppBar, Fab, IconButton, TextField, Typography, useTheme, Slide, Collapse } from "@mui/material";
import { ChevronLeft, Send } from "@mui/icons-material";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";
import { baseUrl } from "../constants";
import useInterval from "../useInterval";

const Conversation = () => {
  let { conversationId } = useParams();

  const theme = useTheme();
  const navigate = useNavigate();

  const [newMessage, setNewMessage] = useState("");
  const [refresh, setRefresh] = useState(false);

  const conversation = useApiRequest(`/conversation/${conversationId}`, {}, [
    refresh,
  ]);

  const { getUserId, getCookie } = useCurrentUser();
  const user_id = getUserId();

  const handleSend = async (e) => {
    e.preventDefault();

    const body = JSON.stringify({
      conversation_id: conversation.conversation_id,
      content: newMessage,
    });
    document.cookie = getCookie();
    console.log(document.cookie);
    const response = await fetch(`${baseUrl}/conversation/send`, {
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

  useEffect(() => {
    if (refresh === "manual")
    {
      var div = document.querySelector(".conversation-list");
      div.scrollTop = div.scrollHeight;
      setRefresh(false);
    }
  }, [conversation]);

  useInterval(() => setRefresh(true), 20000);
  useEffect(() => {
    if (refresh === true) {
      setRefresh(false);
    }
  }, [refresh]);

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
  console.log(readReceipts);
  return (
    <>
      <div
        className={`top-bar ${theme.palette.mode}`}
        style={{
          position: "fixed",
          top: 64,
          bottom: "auto",
          marginBottom: "20px",
        }}
      >
        <IconButton className="back-button" size="large" onClick={() => navigate("/")}><ChevronLeft fontSize="large" /></IconButton>
        <Typography variant="h6">{conversation.name}</Typography>
        <React.Fragment>
          {conversation?.users?.map((user, idx, convs) => (
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
      </div>
      <div className="conversation-list">
        <div className="conversation-list-scroll">
          {conversation?.messages?.map((message, idx, messages) => (
            <React.Fragment key={message.message_id}>
              <MessageBubble
                message={message}
                prevMessage={messages[idx - 1]}
                isOutgoing={message.sender_id === user_id}
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
          autoFocus
        />
        </Slide>
        <Slide direction="up" appear in mountOnEnter unmountOnExit timeout={{enter: 500}} >
        <div className="send-button-container">
          <Fab color="primary" aria-label="add" onClick={handleSend} disabled={newMessage.length === 0} type="submit">
            <Send />
          </Fab>
        </div>
        </Slide>
      </div>
      </form>
    </>
  );
};

export default Conversation;
