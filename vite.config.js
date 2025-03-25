import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend URL
        changeOrigin: true, // Adjust the origin to match the backend
        secure: false, // Ignore HTTPS issues in local development
        ws: true, // Enable WebSocket support if needed
      },
    },
  },
});
