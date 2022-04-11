import { Button, Typography } from "@mui/material";
import React from "react";
import ConversationListings from "./ConversationListing";

import "./main.scss";

const Main = () => {

    const conversations = [{
        conversationId: 1,
        name: "name1",
        users: [{ name: "user1", username: "uname1" }, { name: "user2", username: "uname2" }]
    },
    {
        conversationId: 2,
        name: "name2",
        users: [{ name: "user1", username: "uname1" }, { name: "user3", username: "uname3" }]
    }];

    return (
        <div className="main-page">
            <Typography variant="h5">Conversations</Typography>
            <Button variant="contained">New Conversation</Button>
            <ConversationListings conversations={conversations} />
        </div>
    );
};

export default Main;