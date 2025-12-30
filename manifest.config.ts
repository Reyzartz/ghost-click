import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: "Ghost Click - Chrome Extension with Manifest V3",
  icons: {
    48: "public/logo.png",
  },
  action: {
    default_icon: {
      48: "public/logo.png",
    },
    default_popup: "src/popup/index.html",
  },
  background: {
    scripts: ["src/utils/App.ts", "src/services/ShortcutService.ts"],
    service_worker: "src/background/index.ts",
    type: "module",
  },
  permissions: ["activeTab", "tabs", "scripting", "storage", "sidePanel"],
  host_permissions: ["https://*/*", "http://*/*"],
  content_scripts: [
    {
      js: ["src/content/main.tsx"],
      matches: ["<all_urls>"],
      run_at: "document_idle",
    },
  ],
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
  commands: {
    "start-recording": {
      description: "Start Ghost Click recording",
      suggested_key: {
        default: "Alt+Q",
        mac: "Alt+Q",
      },
    },
  },
});
