import { Typography, ListItemAvatar, Avatar, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import moment from "moment";

import "./messagebubble.scss";
import { baseUrl } from "../constants";
import { Check } from "@mui/icons-material";

const MessageBubble = (props) => {
  const { isOutgoing, message, prevMessage, isGroupConversation, readReceipts, user_id } = props;

  const old = moment(prevMessage?.timestamp);
  const timestamp = moment(message.timestamp);

  const theme = useTheme();
  console.log(readReceipts)
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
        } ${theme.palette.mode}`}
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
          {readReceipts && (isGroupConversation || isOutgoing) &&
            <Typography className={"message-name read-receipt"} variant="caption">
              <Check sx={{fontSize: "14px"}}/> {isGroupConversation ? `Read by ${readReceipts.map(user => user.user_id == user_id ? "Me" : user.name).join(", ")}` : "Read"}
          </Typography>
          }
        </div>
      </div>
    </>
  );
};

export default MessageBubble;
