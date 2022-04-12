import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";

import "./conversation.scss";
import { AppBar, Fab, TextField, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";
import { baseUrl } from "../constants";

const Conversation = () => {
  let { conversationId } = useParams();

  const [newMessage, setNewMessage] = useState("");
  const [refresh, setRefresh] = useState(false);

  const conversation = useApiRequest(`/conversation/${conversationId}`, {}, [
    refresh,
  ]);

  const { getUserId } = useCurrentUser();
  const user_id = getUserId();

  const handleSend = async () => {
    const body = JSON.stringify({
      conversation_id: conversation.conversation_id,
      content: newMessage,
    });
    const response = await fetch(`${baseUrl}/conversation/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      credentials: "include",
      cookie: document.cookie,
    });

    if (!response.ok) {
      return;
    }

    const obj = await response.json();
    console.log(obj);

    setNewMessage("");
    setRefresh(true);
  };

  useEffect(() => {
    setRefresh(false);
    var div = document.querySelector(".conversation-list");
    div.scrollTop = div.scrollHeight;
  }, [conversation]);

  return (
    <>
      <div
        className="top-bar"
        style={{
          position: "fixed",
          top: 64,
          bottom: "auto",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h6">{conversation.name}</Typography>
        <React.Fragment>
          {conversation?.users?.map((user, idx, convs) => (
            <Typography
              className="users-label"
              sx={{ display: "inline" }}
              component="span"
              variant="caption"
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
              />
            </React.Fragment>
          ))}
        </div>
      </div>
      <div
        className="bottom-bar"
        style={{ position: "fixed", top: "auto", bottom: 0, marginTop: "20px" }}
      >
        <TextField
          className="mesage-input"
          label="Message"
          variant="filled"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <div className="send-button-container">
          <Fab color="primary" aria-label="add" onClick={handleSend}>
            <Send />
          </Fab>
        </div>
      </div>
    </>
  );
};

export default Conversation;
