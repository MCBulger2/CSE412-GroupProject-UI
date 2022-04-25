import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import "./conversation.scss";
import { baseUrl } from "../constants";
import { Close } from "@mui/icons-material";
import Confirmation from "./Confirmation";
import useCurrentUser from "../useCurrentUser";
import { IconButton, Tooltip } from "@mui/material";

/**
 * Displays a list of all of the current user's conversations
 * @param {*} props
 * @returns
 */
const ConversationListings = (props) => {
  const { conversations, user_id } = props;

  const [selectedConversation, setSelectedConversation] = useState(null); // The conversation to delete (if any)

  const navigate = useNavigate(); // Get navigate function to redirect to conversation page

  const { getCookie } = useCurrentUser();

  /**
   * After confirming the deletion, this function actually deletes the conversation
   */
  const handleDeleteConversation = async () => {
    const result = await fetch(
      `${baseUrl}/conversation/${selectedConversation.conversation_id}`,
      { method: "DELETE", cookie: getCookie(), credentials: "include" }
    );
    if (!result.ok) {
      return;
    }

    setSelectedConversation(null);
    navigate(0);
  };

  return (
    <div className="listing-container">
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {conversations.map((conversation) => (
          <React.Fragment key={conversation.conversation_id}>
            <ListItem
              alignItems="flex-start"
              className="conversation"
              onClick={() =>
                navigate(`/conversation/${conversation.conversation_id}`)
              }
            >
              {conversation.unread && conversation.last_message !== null && (
                <div className={"unread"} />
              )}
              <ListItemAvatar>
                <Avatar
                  alt={conversation.name}
                  src={
                    conversation.users.filter((u) => u.user_id !== user_id)
                      .length == 1
                      ? `${baseUrl}/profile/${
                          conversation.users.filter(
                            (u) => u.user_id !== user_id
                          )[0].user_id
                        }/picture`
                      : ""
                  }
                />
              </ListItemAvatar>
              <ListItemText
                primary={conversation.name}
                secondary={
                  <React.Fragment>
                    {conversation?.users
                      ?.filter((u) => u.user_id !== user_id)
                      .map((user, idx, convs) => (
                        <Typography
                          className="users-label"
                          sx={{ display: "inline" }}
                          component="span"
                          variant="caption"
                          key={user.user_id}
                        >
                          {user.name}
                          {idx < convs.length - 1 ? ", " : ""}
                        </Typography>
                      ))}
                  </React.Fragment>
                }
              />
              <Tooltip title="Delete Conversation">
                <IconButton
                  className="align-self-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedConversation(conversation);
                  }}
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </ListItem>
            <Divider
              variant="inset"
              component="li"
              className={conversation.unread ? "extra-divider" : ""}
            />
          </React.Fragment>
        ))}
      </List>
      <Confirmation
        open={!!selectedConversation}
        onClose={() => setSelectedConversation(null)}
        callback={handleDeleteConversation}
        content={() => (
          <>
            Are you sure you want to delete conversation{" "}
            <i>"{selectedConversation?.name}"</i>? Deleting it will{" "}
            <b>permanently</b> delete all messages for every user in the
            conversation.
          </>
        )}
      />
    </div>
  );
};

export default ConversationListings;
