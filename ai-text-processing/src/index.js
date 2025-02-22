import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

function createMetaTag(token) {
  if (!token) return;
  const meta = document.createElement("meta");
  meta.httpEquiv = "origin-trial";
  meta.content = token;
  document.head.append(meta);
}

// Insert meta tags for the Chrome Origin Trial tokens
createMetaTag(process.env.REACT_APP_CHROME_LANG_DETECT_TOKEN);
createMetaTag(process.env.REACT_APP_CHROME_TRANSLATOR_TOKEN);
createMetaTag(process.env.REACT_APP_CHROME_SUMMARIZER_TOKEN);

// Render the React app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();




