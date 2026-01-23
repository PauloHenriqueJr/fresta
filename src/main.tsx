import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/state/auth/AuthProvider";
import { setupInstallPrompt } from "@/lib/push/notifications";

// Initialize PWA install prompt listener
setupInstallPrompt();

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
