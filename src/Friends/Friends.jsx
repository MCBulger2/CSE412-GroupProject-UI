import {
  CheckRounded,
  CloseRounded,
  PersonAddRounded,
  PersonRemoveRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import BottomNavigation from "../Main/BottomNavigation";
import NewFriend from "../Main/NewFriend";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";
import useInterval from "../useInterval";
import Loading from "../Utils/Loading";

import "./friends.scss";

const Friends = () => {
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const inPending = useApiRequest("/friend/pending/in", null, [refresh]);
  const outPending = useApiRequest("/friend/pending/out", null, [refresh]);
  const friends = useApiRequest("/friend", [], [refresh]);

  const { getCookie } = useCurrentUser();
  const acceptRequest = async (user_id) => {
    const res = await fetch(`${baseUrl}/friend/accept/${user_id}`, {
      credentials: "include",
      cookie: getCookie(),
    });

    // TODO handle errors

    setRefresh(true);
  };

  const removeFriend = async (user_id) => {
    const res = await fetch(`${baseUrl}/friend/defriend/${user_id}`, {
        method: "DELETE",
      credentials: "include",
      cookie: getCookie(),
    });

    // TODO handle errors

    setRefresh(true);
  };

  useInterval(() => setRefresh(true), 1000*60);
  useEffect(() => {
    if (refresh === true) {
      setRefresh(false);
    }

    if (inPending !== null && outPending !== null && friends !== null) {
      setIsLoading(false);
    }
  }, [inPending, outPending, friends]);

  return (
    <div className="friends-page">
        <Typography variant="h3">Friends</Typography>
      <Button
        fullWidth
        startIcon={<PersonAddRounded />}
        onClick={() => setAddFriendOpen(true)}
        variant="outlined"
        className="add-friend-btn"
      >
        Send Friend Request
      </Button>
      {(inPending?.length > 0 || outPending?.length > 0) && (
        <>
          <Typography variant="h5">Pending Friend Requests</Typography>
          <Typography variant="h6">Incoming</Typography>
          <List>
            {inPending.length == 0 && (
              <Alert severity="info">
                You don't have any incoming friend requests.
              </Alert>
            )}
            {inPending.map((pendingFriend) => (
              <React.Fragment key={pendingFriend.user_id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      alt={pendingFriend.name}
                      src={`${baseUrl}/profile/${pendingFriend.user_id}/picture`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={pendingFriend.name}
                    secondary={
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="caption"
                      >
                        {pendingFriend.username}
                      </Typography>
                    }
                  />
                  <IconButton
                    onClick={() => acceptRequest(pendingFriend.user_id)}
                  >
                    <CheckRounded />
                  </IconButton>
                  <IconButton onClick={() => removeFriend(pendingFriend.user_id)}>
                    <CloseRounded />
                  </IconButton>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          <Typography variant="h6">Outgoing</Typography>
          <List>
            {outPending?.length == 0 && (
              <Alert severity="info">
                You don't have any outgoing friend requests.
              </Alert>
            )}
            {outPending?.map((pendingFriend) => (
              <React.Fragment key={pendingFriend.user_id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      alt={pendingFriend.name}
                      src={`${baseUrl}/profile/${pendingFriend.user_id}/picture`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={pendingFriend.name}
                    secondary={
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="caption"
                      >
                        {pendingFriend.username}
                      </Typography>
                    }
                  />
                  <Typography>
                    <i>Pending</i>
                  </Typography>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </>
      )}

      <Typography variant="h5">Your Friends</Typography>
      <List>
        {friends?.length == 0 && (
          <Alert
            severity="info"
            action={
              <Button onClick={() => setAddFriendOpen(true)}>Add Friend</Button>
            }
          >
            It looks like you don't have any friends...yet!
          </Alert>
        )}
        {friends?.map((friend) => (
          <React.Fragment key={friend.user_id}>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  alt={friend.name}
                  src={`${baseUrl}/profile/${friend.user_id}/picture`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={friend.name}
                secondary={
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="caption"
                  >
                    {friend.username}
                  </Typography>
                }
              />
              <IconButton onClick={() => removeFriend(friend.user_id)}>
                <PersonRemoveRounded />
              </IconButton>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      <BottomNavigation />
      <NewFriend
        open={addFriendOpen}
        onClose={() => {
          setAddFriendOpen(false);
          setRefresh(true);
        }}
      />
      <Loading open={isLoading} />
    </div>
  );
};

export default Friends;
