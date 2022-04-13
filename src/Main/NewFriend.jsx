import { Close, Send } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  DialogContentText,
  TextField,
  Alert
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import useApiRequest from "../useApiRequest";
import useCurrentUser from "../useCurrentUser";

const NewFriend = (props) => {
    const {
        open,
        onClose
    } = props;

    const [username, setUsername] = useState("");
    const [error, setError] = useState(false);
    const {getCookie} = useCurrentUser();

    const befriend = async () => {
        const result = await fetch(`${baseUrl}/friend/befriend/${username}`, { 
            method: "POST",
            cookie:getCookie(),
            credentials: "include"
        });
        if (!result.ok) {
            setError("The username you entered does not exist, or you are already friends.");
            return;
        }

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Friend</DialogTitle>
            <DialogContent>
                    {error && (
                    <Alert style={{ marginBottom: "20px" }} severity="error">
                    {error}
                    </Alert>
                )}
                <DialogContentText>Enter the username of the user you would like to befriend:</DialogContentText>
                <TextField
            className="input mb-3"
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <DialogContentText>By befriending this user, they will be able to view all of your story posts.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button startIcon={<Close />} onClick={() => onClose()}>Cancel</Button>
                <Button variant="contained" startIcon={<Send />} onClick={befriend}>
                Send
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewFriend;