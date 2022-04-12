import { useMemo } from "react";

const useCurrentUser = () => {
    return {
        getUserId: () => parseInt(localStorage.getItem("user_id")),
        getUsername: () => localStorage.getItem("username"),
        clearUser: () => {
            localStorage.clear();
            document.cookie = "";
        }
    };
}

export default useCurrentUser;