import { Typography, ListItemAvatar, Avatar, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import moment from "moment";

import "./messagebubble.scss";
import { baseUrl } from "../constants";
import { Check } from "@mui/icons-material";
import useCurrentUser from "../useCurrentUser";

const MessageBubble = (props) => {
  const { isOutgoing, message, prevMessage, nextMessage, isGroupConversation, readReceipts, user_id } = props;

  const old = moment(prevMessage?.timestamp);
  const timestamp = moment(message.timestamp);
  const next = moment(nextMessage?.timestamp);
  const timeDiff = Math.abs(old.diff(timestamp, "minutes"))
  const timeDiffSeconds = Math.abs(old.diff(timestamp, "seconds"))

  const nextTimeDiffSeconds = Math.abs(next.diff(timestamp, "seconds"))

  const theme = useTheme();
  const actualReadReceipts = readReceipts?.filter(u => ![message.sender_id, user_id].includes(u.user_id));
  console.log(actualReadReceipts);
  
  return (
    <>
    {prevMessage && <div style={{marginTop: `min(calc(1px * ${(Math.ceil(timeDiffSeconds / 10) * 10) / 10}), 75px)`}}/>}
      {(!prevMessage || timeDiff > 5) && (
          <Typography className={"message-timestamp"}>
            {moment.utc(message.timestamp).format("MMMM D, h:mm A")}
          </Typography>
        )}
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
          {(!nextMessage || nextTimeDiffSeconds > 60 || nextMessage.sender_id !== message.sender_id) &&
          <Typography className={"message-name"} variant="caption">
            {message.name}
          </Typography>}
          {actualReadReceipts?.length > 0 && (isGroupConversation || isOutgoing) &&
            <Typography className={"message-name read-receipt"} variant="caption">
              <Check sx={{fontSize: "14px"}}/> {`Read by ${actualReadReceipts.map(user => user.name).join(", ")}`}
          </Typography>
          }
        </div>
      </div>
    </>
  );
};

export default MessageBubble;
