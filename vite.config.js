import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  // Use root path in local dev, and repository path for GitHub Pages build.
  base: command === "serve" ? "/" : "/Interactive_Resume/",
  plugins: [react()],
}));
