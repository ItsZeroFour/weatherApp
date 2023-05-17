import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./scss/style.scss";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename="/weatherApp/">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
