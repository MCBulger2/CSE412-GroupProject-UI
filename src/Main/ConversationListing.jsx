import React from "react";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import "./conversation.css"

const ConversationListings = (props) => {
  const { conversations } = props;

  const navigate = useNavigate();

  return (
    <div className="listing-container">
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {conversations.map((conversation) => (
          <>
            <ListItem alignItems="flex-start" className="conversation" onClick={() => navigate(`/conversation/${conversation.conversationId}`)}>
              <ListItemAvatar>
                <Avatar
                  alt={conversation.name}
                  src="/static/images/avatar/1.jpg"
                />
              </ListItemAvatar>
              <ListItemText
                primary={conversation.name}
                secondary={
                  <React.Fragment>
                    {conversation.users.map((user, idx, convs) => (
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {user.name}
                        {idx < convs.length - 1 ? ", " : ""}
                      </Typography>
                    ))}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </div>
  );
};

export default ConversationListings;
