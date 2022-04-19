import React from "react";
import useApiRequest from "../useApiRequest";
import StoryIcon from "./StoryIcon";

import "./stories.scss";
import { Alert, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Stories = () => {

    const friends = useApiRequest("/friend", []);
    const navigate = useNavigate();

    return (
        <div className="stories">
            {friends.length == 0 && <Alert severity="info" className="stories-alert" action={<Button onClick={() => navigate("/friends")}>Friends Page</Button>}>As you gain friends, their Stories will appear here!</Alert>}
            {friends.map(friend => (
                <StoryIcon key={friend.user_id} {...friend} />
            ))}
        </div>
    );
};

export default Stories;