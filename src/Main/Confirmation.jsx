import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

/**
 * Opens a confirmation dialog to confirm that the user would like to delete the specified conversation.
 * @param {*} props 
 * @returns {Element}
 */
const Confirmation = (props) => {
    const {
        open,
        onClose,
        conversation,
        callback
    } = props;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete conversation <i>"{conversation?.name}"</i>? Deleting it will <b>permanently</b> delete all messages for every user in the conversation.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" className="red" onClick={callback}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Confirmation;