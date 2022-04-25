import { AddRounded, PlusOne } from "@mui/icons-material";
import {
  Alert,
  Button,
  IconButton,
  setRef,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useLocation, matchPath } from "react-router-dom";
import { baseUrl } from "../constants";
import Stories from "../Stories/Stories";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";
import useInterval from "../useInterval";
import Loading from "../Utils/Loading";
import BottomNavigation from "./BottomNavigation";
import ConversationListings from "./ConversationListing";

import "./main.scss";
import NewConversation from "./NewConversation";
import NewFriend from "./NewFriend";

/**
 * The home page of the application that contains Stories and ConversationListing
 * @returns 
 */
const Main = () => {
  // Get all of the user's conversations
  const [refresh, setRefresh] = useState(false);
  const conversations = useApiRequest("/conversation/all", null, [refresh]);

  const [newConverationOpen, setNewConversationOpen] = useState(false); // Open modal to create conversation
  const [addFriendOpen, setAddFriendOpen] = useState(false); // Open modal to add new friend (now unused)
  const [isLoading, setIsLoading] = useState(true); // If true, show full page loading (initial load)

  const navigate = useNavigate();

  // Get the current user_id to make sure the user is still logged in
  const { getUserId } = useCurrentUser();
  const user_id = getUserId();

  // Make sure the user is logged in. If they aren't, redirect them to the login page
  useEffect(() => {
    if (!user_id) {
      navigate("/login");
    }
  }, [user_id]);

  // Automatically the list of conversations every 20s (so we can display the notification bubbles)
  useInterval(() => setRefresh(true), 20000);
  useEffect(() => {
    if (refresh === true) {
      setRefresh(false);
    }

    if (conversations !== null) {
      setIsLoading(false);
    }
  }, [conversations]);

  return (
    <>
      <div className="main-page">
        <div className="friends-container">
          <div className="friends-header">
            <Typography variant="h5">Stories</Typography>
          </div>
          <Stories />
        </div>
        <div className="friends-container">
          <div className="friends-header">
            <Typography variant="h5">Conversations</Typography>
              <IconButton
                onClick={() => setNewConversationOpen(true)}
              >
                <AddRounded />
              </IconButton>
          </div>
          {conversations?.length == 0 && (
            <Alert
              severity="info"
              action={
                <Button onClick={() => setNewConversationOpen(true)}>
                  New Conversation
                </Button>
              }
            >
              You currently aren't in any conversations. Once you've made a
              friend, you can start a conversation here.
            </Alert>
          )}
          <ConversationListings conversations={conversations ?? []} user_id={user_id} />
        </div>
      </div>
      <NewConversation
        open={newConverationOpen}
        onClose={() => setNewConversationOpen(false)}
      />
      <NewFriend open={addFriendOpen} onClose={() => setAddFriendOpen(false)} />
      <BottomNavigation />
      <Loading open={isLoading} />
    </>
  );
};

export default Main;
