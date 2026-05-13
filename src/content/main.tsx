import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContentApp } from "./ContentApp";
// Inline the compiled Tailwind CSS via Vite so it can be injected into the shadow root
// This relies on @tailwindcss/vite to process the CSS before inlining
import tailwindCss from "../styles/tailwind.css?inline";
import StatusApp from "./StatusApp.tsx";
import NotificationApp from "./NotificationApp.tsx";

const contentApp = new ContentApp();
void contentApp.init();

// Create shadow host and attach shadow root
const host = document.createElement("div");
host.id = "ghost-click-shadow-host";
document.body.appendChild(host);

const shadowRoot = host.attachShadow({ mode: "open" });

// Inject compiled Tailwind CSS into shadow root to style isolated UI
const styleEl = document.createElement("style");
styleEl.textContent = `
${tailwindCss as unknown as string}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
shadowRoot.appendChild(styleEl);

// Mount point inside shadow root
const mount = document.createElement("div");
mount.id = "ghost-click-mount";
shadowRoot.appendChild(mount);

// Pass the mount element to ContentApp for theme management
contentApp.setThemeTarget(mount);

createRoot(mount).render(
  <StrictMode>
    <StatusApp app={contentApp} />
    <NotificationApp app={contentApp} />
  </StrictMode>
);

// TODO:
// Cleanup on unload (if ever needed)
// 1. Unmount React app
// 2. Remove shadow host from document body
// 3. Create a render class to handle mounting and unmounting the app
