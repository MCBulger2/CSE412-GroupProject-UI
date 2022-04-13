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
  TextField
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";

const NewConversation = (props) => {
  const { open, onClose } = props;

  const friends = useApiRequest("/friend/friendee", []);

  const navigate = useNavigate();

  const {getCookie} = useCurrentUser();

  const [usernames, setUsernames] = useState([]);
  const [conversationName, setConversationName] = useState("");

  const handleSelectUsername = (e) => {
    const {
        target: { value }
    } = e;
    setUsernames(typeof value === "string" ? value.split(",") : value);
  };

  const createConversation = async () => {
    const result = await fetch(`${baseUrl}/conversation`, {
        method: "POST",
        body: JSON.stringify({ name: conversationName, users: usernames }),
        credentials: "include",
        cookie: getCookie(),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const conversation = await result.json();

    navigate(`/conversation/${conversation.conversation_id}`)
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Conversation</DialogTitle>
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
            {friends.map(friend => (
              <MenuItem
                key={friend.user_id}
                value={friend.user_id}
              >
                {friend.username} ({friend.name})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<Close />} onClick={() => onClose()}>Cancel</Button>
        <Button variant="contained" startIcon={<Send />} onClick={createConversation}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewConversation;
