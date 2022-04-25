import { Close, Send } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";

/**
 * Displays a dialog for creating a new conversation.
 * @param {*} props
 * @returns
 */
const NewConversation = (props) => {
  const { open, onClose } = props;

  // Get the current user's friends to determine who you can start conversations with
  const friends = useApiRequest("/friend", []);

  const navigate = useNavigate(); // So we can redirect to the newly created conversation

  const { getCookie } = useCurrentUser();

  // Fields for the user input
  const [usernames, setUsernames] = useState([]);
  const [conversationName, setConversationName] = useState("");
  const [error, setError] = useState(false); // error message (not dispalyed if false)

  /**
   * Add/remove a user from the drop-down field when you click one of the options
   * @param {*} e 
   */
  const handleSelectUsername = (e) => {
    const {
      target: { value },
    } = e;
    setUsernames(typeof value === "string" ? value.split(",") : value);
  };

  /**
   * Creates a new conversation and redirects to that page (or displays error)
   * @param {Event} e - click/form submission event
   */
  const createConversation = async (e) => {
    e.preventDefault();
    const result = await fetch(`${baseUrl}/conversation`, {
      method: "POST",
      body: JSON.stringify({ name: conversationName, users: usernames }),
      credentials: "include",
      cookie: getCookie(),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!result.ok) {
      setError("There was an issue creating the conversation.");
      return;
    }
    const conversation = await result.json();

    navigate(`/conversation/${conversation.conversation_id}`);
  };

  return (
    <form onSubmit={createConversation}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>New Conversation</DialogTitle>
        {friends.length == 0 && (
          <Alert severity="warning">
            You don't have any friends to start a conversation with.
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <DialogContent>
          <DialogContentText>
            Enter the name of the conversation:
          </DialogContentText>
          <TextField
            className="input mb-3"
            label="Conversation Name"
            fullWidth
            value={conversationName}
            onChange={(e) => setConversationName(e.target.value)}
          />
          <DialogContentText>
            Select the users you would like to include in the conversation:
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="usernames-label">Name</InputLabel>
            <Select
              labelId="usernames-label"
              id="usernames"
              multiple
              value={usernames}
              onChange={handleSelectUsername}
              input={<OutlinedInput label="Name" />}
            >
              {friends.map((friend) => (
                <MenuItem key={friend.user_id} value={friend.user_id}>
                  {friend.username} ({friend.name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<Close />} onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            disabled={conversationName.length == 0 || usernames.length == 0}
            variant="contained"
            startIcon={<Send />}
            onClick={createConversation}
            type="submit"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default NewConversation;
