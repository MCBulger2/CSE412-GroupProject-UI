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

const EditName = (props) => {
    const {
        open,
        onClose
    } = props;

    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const {getCookie} = useCurrentUser();

    const update = async () => {
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
            <DialogTitle>Edit Name</DialogTitle>
            <DialogContent>
                    {error && (
                    <Alert style={{ marginBottom: "20px" }} severity="error">
                    {error}
                    </Alert>
                )}
                <DialogContentText>Enter your new name:</DialogContentText>
                <TextField
            className="input mb-3"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <DialogContentText>By befriending this user, they will be able to view all of your story posts.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button startIcon={<Close />} onClick={() => onClose()}>Cancel</Button>
                <Button variant="contained" startIcon={<Send />} onClick={update}>
                Send
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditName;