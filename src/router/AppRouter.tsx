import { BrowserRouter, Routes, Route } from "react-router-dom";

import POSPage from "../pages/pos/POSPage";
import Dashboard from "../pages/admin/Dashboard";
import LoginPage from "../pages/LoginPage";
import AuthGate from "../context/AuthGate";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />

        {/* PROTECTED */}
        <Route
          path="/*"
          element={
            <AuthGate>
              <Routes>
                <Route path="/pos" element={<POSPage />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
              </Routes>
            </AuthGate>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}