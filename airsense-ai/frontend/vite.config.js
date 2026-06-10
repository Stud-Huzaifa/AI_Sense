import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replaceAll("\\", "/");
          if (normalized.includes("/node_modules/recharts/")) return "charts";
          if (normalized.includes("/node_modules/leaflet/") || normalized.includes("/node_modules/react-leaflet/")) return "maps";
          if (normalized.includes("/node_modules/")) return "vendor";
          return undefined;
        },
      },
    },
  },
});
