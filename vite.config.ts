import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const resolveBaseUrl = (value?: string) => {
  if (!value) return "./";
  if (value.startsWith(".")) {
    return value.endsWith("/") ? value : `${value}/`;
  }
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
};

const baseUrl = resolveBaseUrl(process.env.VITE_BASE_URL);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: baseUrl,
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
