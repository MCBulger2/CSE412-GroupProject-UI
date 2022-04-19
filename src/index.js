import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { createRoot } from "react-dom/client";

//if (window.location.protocol == 'http:') {
     
//   console.log("you are accessing us via "
//       +  "an insecure protocol (HTTP). "
//       + "Redirecting you to HTTPS.");
       
//   window.location.href =
//       window.location.href.replace(
//                  'http:', 'https:');
// }

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
