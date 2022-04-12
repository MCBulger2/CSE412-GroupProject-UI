import { Button, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import Stories from "../Stories/Stories";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";
import ConversationListings from "./ConversationListing";

import "./main.scss";
import NewConversation from "./NewConversation";
import NewFriend from "./NewFriend";

const Main = () => {
    const conversations = useApiRequest("/conversation/all", [])
    const navigate = useNavigate();
    const { getUserId } = useCurrentUser();
    const user_id = getUserId();

    useEffect(() => {
        if (!user_id) {
            navigate("/login");
        }
    }, [user_id]);

    const [newConverationOpen, setNewConversationOpen] = useState(false);
    const [addFriendOpen, setAddFriendOpen] = useState(false);


    return (
        <>
        <div className="main-page">
            <div style={{backgroundColor: "grey"}}>
                <Typography variant="h5">Friends</Typography>
                <Button variant="contained" onClick={() => setAddFriendOpen(true)}>Add Friend</Button>
                <Stories />
            </div>
            <Typography variant="h5">Conversations</Typography>
            <Button variant="contained" onClick={() => setNewConversationOpen(true)}>New Conversation</Button>
            <ConversationListings conversations={conversations} />
        </div>
        <NewConversation open={newConverationOpen} onClose={() => setNewConversationOpen(false)}/>
        <NewFriend open={addFriendOpen} onClose={() => setAddFriendOpen(false)}/>
        </>
    );
};

export default Main;