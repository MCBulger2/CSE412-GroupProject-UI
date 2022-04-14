import { PlusOne } from "@mui/icons-material";
import { Button, setRef, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link,useLocation, matchPath } from "react-router-dom";
import { baseUrl } from "../constants";
import Stories from "../Stories/Stories";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";
import useInterval from "../useInterval";
import BottomNavigation from "./BottomNavigation";
import ConversationListings from "./ConversationListing";

import "./main.scss";
import NewConversation from "./NewConversation";
import NewFriend from "./NewFriend";



const Main = () => {
  const [refresh, setRefresh] = useState(false);
  const conversations = useApiRequest("/conversation/all", [], [refresh]);
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

  useInterval(() => setRefresh(true), 20000);
  useEffect(() => {
    if (refresh === true) {
      setRefresh(false);
    }
  }, [refresh]);

  return (
    <>
      <div className="main-page">
        
        <div className="friends-container">
          <div className="friends-header">
            <Typography variant="h5">Friends</Typography>
            <Button variant="contained" onClick={() => setAddFriendOpen(true)}>
              Add Friend
            </Button>
          </div>
          <Stories />
        </div>
        <div className="friends-container">
          <div className="friends-header">
            <Typography variant="h5">Conversations</Typography>
            <Button
              variant="contained"
              onClick={() => setNewConversationOpen(true)}
            >
              New Conversation
            </Button>
          </div>
          <ConversationListings conversations={conversations} />
        </div>
      </div>
      <NewConversation
        open={newConverationOpen}
        onClose={() => setNewConversationOpen(false)}
      />
      <NewFriend open={addFriendOpen} onClose={() => setAddFriendOpen(false)} />
      <BottomNavigation />
    </>
  );
};

export default Main;
