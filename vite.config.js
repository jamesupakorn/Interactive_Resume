import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Interactive_Resume/",
  plugins: [react()],
});
