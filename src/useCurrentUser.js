import { useMemo } from "react";

const useCurrentUser = () => {
    return {
        getUserId: () => parseInt(sessionStorage.getItem("user_id")),
        getUsername: () => sessionStorage.getItem("username"),
        clearUser: () => {
            sessionStorage.clear();
            document.cookie = "";
        },
        getCookie: () => document.cookie
    };
}

export default useCurrentUser;