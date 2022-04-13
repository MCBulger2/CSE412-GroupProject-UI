import { useState, useEffect } from "react";
import { baseUrl } from "./constants";
import useCurrentUser from "./useCurrentUser";

const useApiRequest = (apiPath, defaultValue, deps = []) => {
    const [obj, setObj] = useState(defaultValue);

    const {getCookie} = useCurrentUser();

    const makeRequest = async (path) => {
        const response = await fetch(`${baseUrl}${path}`, {
            credentials: "include",
            cookie: getCookie(),
        });
        const obj = await response.json()
        setObj(obj);
        console.log(obj);
    };

    useEffect(() => {
        makeRequest(apiPath);
    }, deps);

    return obj;
};

export default useApiRequest;