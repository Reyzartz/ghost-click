# Ghost Click - Chrome Extension

A Chrome extension built with Manifest V3, React, TypeScript, and Vite using the CRXJS plugin.


## Quick Start

1. Install dependencies:

```bash
bun install
```

2. Start development server:

```bash
bun dev
```

3. Load the extension in Chrome:

   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` directory from this project

4. Test the extension:

   - Click the extension icon in the toolbar to open the popup
   - Click "Test Background Connection" to verify the service worker is running
   - Navigate to any webpage and click "Inject Content Script" to test content script injection

5. Build for production:

```bash
bun build
```