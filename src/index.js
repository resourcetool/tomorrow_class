import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registering the service worker is what makes the app installable and
// gives it basic offline support. See serviceWorkerRegistration.js.
serviceWorkerRegistration.register();
