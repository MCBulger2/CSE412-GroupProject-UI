import { Typography } from "@mui/material";
import React from "react";

import "./messagebubble.scss";

const MessageBubble = (props) => {
    const {
        isOutgoing,
        message
    } = props;

    return (
        <div className={`message-bubble-row  ${isOutgoing ? "outgoing" : ""}`}>
            <div className={`message-bubble`}>
                <Typography>{message.content}</Typography>
            </div>
            <Typography className={"message-timestamp"} variant="caption">{message.timestamp}</Typography>
        </div>
    );
};

export default MessageBubble;