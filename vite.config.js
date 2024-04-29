import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cors from "cors";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    middleware: [
      cors({
        origin: "*",
        methods: "*",
        allowedHeaders: "*",
        credentials: true,
      }),
    ],
  },
  plugins: [react()],
});
