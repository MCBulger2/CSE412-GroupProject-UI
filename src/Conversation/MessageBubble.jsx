import { Typography, ListItemAvatar, Avatar } from "@mui/material";
import React from "react";
import moment from "moment";

import "./messagebubble.scss";
import { baseUrl } from "../constants";

const MessageBubble = (props) => {
  const { isOutgoing, message, prevMessage, isGroupConversation } = props;

  const old = moment(prevMessage?.timestamp);
  const timestamp = moment(message.timestamp);

  return (
    <>
      {!old ||
        (Math.abs(old.diff(timestamp, "minutes")) > 1 && (
          <Typography className={"message-timestamp"}>
            {moment(message.timestamp).format("MMMM d, h:mm A")}
          </Typography>
        ))}
      <div
        className={`message-bubble-row-container ${
          isOutgoing ? "outgoing" : ""
        }`}
      >
        {isGroupConversation && (
            <Avatar
                className="message-bubble-picture"
              alt={message.name}
              src={`${baseUrl}/profile/${message.sender_id}/picture`}
            />
        )}
        <div className={`message-bubble-row  ${isOutgoing ? "outgoing" : ""}`}>
          <div className={`message-bubble`}>
            <Typography>{message.content}</Typography>
          </div>
          <Typography className={"message-name"} variant="caption">
            {message.name}
          </Typography>
        </div>
      </div>
    </>
  );
};

export default MessageBubble;
