import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import { loadConfig } from "./config";

const rootElement = document.getElementById("root");

const renderApp = async () => {
  await loadConfig();
  const { default: App } = await import("./App.jsx");

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

renderApp();
