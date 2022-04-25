import { Close, Send } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  DialogContentText,
  TextField,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";

/**
 * Displays a dialog for sending a friend request to a certain user
 * @param {*} props 
 * @returns {Element}
 */
const NewFriend = (props) => {
  const { open, onClose } = props;

  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const { getCookie } = useCurrentUser();

  /**
   * Send a friend request to the specified username
   */
  const befriend = async () => {
    const result = await fetch(`${baseUrl}/friend/befriend/${username}`, {
      method: "POST",
      cookie: getCookie(),
      credentials: "include",
    });
    if (!result.ok) {
      const error = await result.text();
      setError(error);
      return;
    }

    onClose();
  };

  return (
    <form onSubmit={befriend}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          {error && (
            <Alert style={{ marginBottom: "20px" }} severity="error">
              {error}
            </Alert>
          )}
          <DialogContentText>
            Enter the username of the user you would like to befriend:
          </DialogContentText>
          <TextField
            className="input mb-3"
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <DialogContentText>
            Once this user accepts your friend request, you will be able to
            start conversations with each other, and view each other's stories.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<Close />} onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={befriend}
            type="submit"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default NewFriend;
