import React from "react";
import useApiRequest from "../useApiRequest";
import StoryIcon from "./StoryIcon";

import "./stories.scss";

const Stories = () => {

    const friends = useApiRequest("/friend/friendee", []);

    return (
        <div className="stories">
            {friends.map(friend => (
                <StoryIcon key={friend.user_id} {...friend} />
            ))}
        </div>
    );
};

export default Stories;