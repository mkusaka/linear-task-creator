// src/settings/main.tsx
import { createRoot } from "react-dom/client";
import "../styles.css"; // Tailwind を含む共通スタイル
import { Settings } from "./Settings";

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(<Settings />);
}
