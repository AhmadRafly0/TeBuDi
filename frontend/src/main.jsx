/**
 * @file main.jsx
 * @description Entry point aplikasi React.
 *
 * Membungkus App dengan:
 * - BrowserRouter (untuk routing)
 * - AuthProvider (untuk global auth state)
 * - StrictMode (untuk development checks)
 */

import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Context provider
import { AuthProvider } from "./context/AuthContext";

// Root component
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* AuthProvider di sini supaya useAuth() bisa dipakai di mana saja */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
