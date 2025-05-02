import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), crx({ manifest })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@linear/sdk": "@linear/sdk/dist/index-umd.min.js",
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
        settings: "settings.html",
      },
    },
  },
});
