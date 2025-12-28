import crxLogo from "@/assets/crx.svg";
import { useState } from "react";

export default function App() {
  const [status, setStatus] = useState<string>("Ready");

  const testConnection = async () => {
    try {
      setStatus("Testing...");
      const response = await chrome.runtime.sendMessage({ type: "PING" });
      setStatus(`Connected: ${response.status}`);
    } catch (error) {
      setStatus("Error: " + (error as Error).message);
    }
  };

  const injectScript = async () => {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, { type: "INJECT_TEST" });
        setStatus("Script injected!");
      }
    } catch (error) {
      setStatus("Injection error: " + (error as Error).message);
    }
  };

  const openSidePanel = async () => {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
      if (tab?.id && chrome.sidePanel?.open) {
        await chrome.sidePanel.open({ tabId: tab.id });
        setStatus("Side panel opened");
      } else {
        setStatus("Side panel API not available");
      }
    } catch (error) {
      setStatus("Side panel error: " + (error as Error).message);
    }
  };

  return (
    <div className="min-w-75 p-5">
      <div className="text-center mb-5">
        <img
          src={crxLogo}
          alt="Ghost Click logo"
          className="w-12 h-12 mx-auto"
        />
        <h1 className="text-lg font-semibold mt-2">Ghost Click</h1>
      </div>

      <p className="text-xs text-gray-500 mb-2">Status: {status}</p>

      <button
        onClick={testConnection}
        className="w-full mb-2 px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Test Background Connection
      </button>

      <button
        onClick={injectScript}
        className="w-full mb-2 px-3 py-2 rounded bg-slate-200 hover:bg-slate-300"
      >
        Inject Content Script
      </button>

      <button
        onClick={openSidePanel}
        className="w-full px-3 py-2 rounded bg-slate-200 hover:bg-slate-300"
      >
        Open Side Panel
      </button>
    </div>
  );
}
