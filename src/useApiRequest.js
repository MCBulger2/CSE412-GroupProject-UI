import { useState, useEffect } from "react";
import { baseUrl } from "./constants";

const useApiRequest = (apiPath, defaultValue, deps = []) => {
    const [obj, setObj] = useState(defaultValue);

    const makeRequest = async (path) => {
        const response = await fetch(`${baseUrl}${path}`, {
            credentials: "include",
            cookie: document.cookie,
        });
        const obj = await response.json()
        console.log(obj);
        setObj(obj);
    };

    useEffect(() => {
        makeRequest(apiPath);
    }, deps);

    return obj;
};

export default useApiRequest;