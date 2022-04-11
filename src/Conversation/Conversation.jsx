import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";

import "./conversation.scss";
import { AppBar, Fab, TextField, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";

const Conversation = () => {
    let { conversationId } = useParams();

    const [newMessage, setNewMessage] = useState("");

    const messages = [{ messageId: 1, content: "Hello, World", timestamp: "a;sdflasdfa" }, { messageId: 2, content: "asdfasldkjfaslkjdfa;slkdf  asdlfkjasdflkjasdl;kfj asdlfkjasdl;kfjas;ldf asdjf alskdjf;laksjd;alskdjf; las;ldkfjk" }];

    const handleSend = () => {
        setNewMessage("");
    };

    return (
        <>
            <div className="top-bar" style={{ position: "fixed", top: 64, bottom: "auto", marginBottom: "20px" }}>
                <Typography variant="h6">Conversation {conversationId}</Typography>
            </div>
            <div className="conversation-list">
                <div className="conversation-list-scroll">
                {messages.map(message => (
                    <React.Fragment key={message.messageId}>
                        <MessageBubble message={message} isOutgoing />
                        <MessageBubble message={message} />
                        <MessageBubble message={message} isOutgoing />
                        <MessageBubble message={message} />
                        <MessageBubble message={message} isOutgoing />
                        <MessageBubble message={message} />
                        <MessageBubble message={message} isOutgoing />
                        <MessageBubble message={message} />
                        <MessageBubble message={message} isOutgoing />
                        <MessageBubble message={message} />
                        <MessageBubble message={message} isOutgoing />
                        <MessageBubble message={message} />
                        <MessageBubble message={message} isOutgoing />
                        <MessageBubble message={message} />
                        <MessageBubble message={message} isOutgoing />
                        <MessageBubble message={message} />
                        <MessageBubble message={message} isOutgoing />
                        <MessageBubble message={message} />
                        <MessageBubble message={message} isOutgoing />
                        <MessageBubble message={message} />
                    </React.Fragment>
                ))}
                </div>
            </div>
            <div className="bottom-bar" style={{ position: "fixed", top: "auto", bottom: 0, marginTop: "20px" }}>
                <TextField className="mesage-input" label="Message" variant="filled" fullWidth value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
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