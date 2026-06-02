import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (
            /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)
          ) {
            return "react";
          }
          if (
            /[\\/]node_modules[\\/](@tanstack|@trpc|superjson|devalue)[\\/]/.test(
              id
            )
          ) {
            return "api";
          }
          if (
            /[\\/]node_modules[\\/](react-markdown|remark-|rehype-|highlight\.js|unified|vfile|micromark|mdast-|hast-)[\\/]/.test(
              id
            )
          ) {
            return "markdown";
          }
          return "vendor";
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
