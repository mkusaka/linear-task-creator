import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Linear Task Creator",
  version: "0.1.0",
  permissions: ["storage", "activeTab"],
  host_permissions: ["https://api.linear.app/*"],
  action: {
    default_popup: "index.html",
  },
  options_ui: {
    page: "settings.html", 
    open_in_tab: false, 
  },
});
