import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./views/App";
import { SidePanelApp } from "./SidePanelApp";
import "../styles/tailwind.css";

const sidePanelApp = new SidePanelApp();
void sidePanelApp.init();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App app={sidePanelApp} />
  </StrictMode>
);
