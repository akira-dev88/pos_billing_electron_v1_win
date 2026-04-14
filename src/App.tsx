import { Routes, Route, Navigate } from "react-router-dom";
import POS from "./pages/pos/POSPage";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Reports from "./pages/admin/Reports";
import Sales from "./pages/admin/Sales";
import Stock from "./pages/admin/Stock";
import Staff from "./pages/admin/Staff";
import Settings from "./pages/admin/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/pos" />} />

      {/* POS - everyone */}
      <Route path="/pos" element={<POS />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["owner", "manager"]}>
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/sales"
        element={
          <ProtectedRoute allowedRoles={["owner", "manager"]}>
            <Sales />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/stock"
        element={
          <ProtectedRoute allowedRoles={["owner", "manager"]}>
            <Stock />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/staff"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <Staff />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;