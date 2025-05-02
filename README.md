# Linear Task Creator Chrome Extension

Add tasks to your Linear.app workspace directly from your browser popup.

## ⚙️ Features

* **Quick Issue Creation**: Capture the current tab’s URL and title
* **Editable Form**: Modify title and description before creating
* **Searchable Dropdowns**: Find projects, teams, and assignees via keyboard-driven Combobox
* **Persistent Defaults**: Remembers your last-used project and assignee
* **Settings Page**: Configure your Linear API key in extension options
* **Tech Stack**: Vite + React + TypeScript, Tailwind CSS v4, shadcn/ui, Sonner for toasts, pnpm

## 📝 Prerequisites

Ensure you have the following installed:

* **Node.js** v16 or later
* **pnpm** ([https://pnpm.io](https://pnpm.io))
* **Chrome** (or any Chromium-based browser)

## 🚀 Installation & Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/linear-task-creator.git
   cd linear-task-creator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run in development mode**

   ```bash
   pnpm dev
   ```

   * This starts Vite’s dev server.
   * The extension bundle will be served at `localhost:3000` (or the port Vite chooses).

4. **Load unpacked extension**

   * Open `chrome://extensions` in Chrome
   * Enable **Developer mode**
   * Click **Load unpacked**, and select your project’s `dist/` directory

5. **Open the popup**

   * Click the extension icon in the toolbar
   * Configure your API key under **Settings** (⚙️ link at the bottom)
   * Create issues using the form

## 🔧 Project Structure

```
├─ public/
│  └─ settings.html         # Options page entrypoint
├─ src/
│  ├─ popup/App.tsx         # Popup UI and logic
│  ├─ settings/
│  │  ├─ Settings.tsx       # Settings page component
│  │  └─ main.tsx           # Settings entrypoint
│  ├─ storage.ts            # chrome.storage helpers
│  ├─ styles.css            # Tailwind + shadcn-ui globals
│  ├─ manifest.config.ts    # CRXJS/Vite manifest definition
│  └─ vite.config.ts        # Vite config
├─ tailwind.config.ts       # Tailwind CSS setup
├─ tsconfig.json            # TypeScript config
└─ README.md                # This file
```

## 🔑 Configuration

1. Click the **Settings** link in the popup or go to your extension’s **Options** page.
2. Enter your Linear API key (format: `lin_xxxxx`).
3. Save — you’ll see a toast confirming the update.

## 🎨 Styling

* Uses **Tailwind CSS v4** for utility-first styling
* **shadcn/ui** components for consistent UI primitives
* **Sonner** for toast notifications

## 📦 Build & Publish

* **Build for production**:

  ```bash
  pnpm build
  ```

  The output is in `dist/`.

* **Publish to Chrome Web Store**:

  1. Zip the `dist/` directory.
  2. Upload via the Developer Dashboard: [https://chrome.google.com/webstore/developer/dashboard](https://chrome.google.com/webstore/developer/dashboard)
  3. Follow the on-screen instructions to set listing details and submit.

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/awesome`)
3. Commit your changes (`git commit -m "Add awesome feature"`)
4. Push (`git push origin feature/awesome`)
5. Open a Pull Request

Please keep PRs focused and include relevant tests or screenshots.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
