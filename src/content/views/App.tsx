import Logo from "@/assets/crx.svg";
import { useState, useEffect } from "react";

function App() {
  const [injected, setInjected] = useState(false);

  useEffect(() => {
    // Listen for messages from popup or background
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      console.log("[CONTENT] Message received:", message);

      if (message.type === "INJECT_TEST") {
        setInjected(true);
        setTimeout(() => setInjected(false), 3000);
        sendResponse({ status: "injected" });
      }

      return true;
    });
  }, []);

  if (!injected) return null;

  return (
    <div className="fixed top-5 right-5 z-999999 max-w-75 bg-red-400 border-2 border-indigo-500 rounded-lg p-5 shadow-md">
      <div className="text-center">
        <img src={Logo} alt="Ghost Click" className="w-12 h-12 mx-auto" />
        <h2 className="text-base font-semibold mt-2 text-gray-800">
          Content Script Active
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Ghost Click is running on this page
        </p>
      </div>
    </div>
  );
}

export default App;
