import { Routes, Route, Navigate } from "react-router-dom";

import POS from "./pages/pos/POSPage";
import Dashboard from "./pages/admin/Dashboard";

// 👇 create empty pages for now
import Products from "./pages/admin/Products";
import Reports from "./pages/admin/Reports";
import Sales from "./pages/admin/Sales";
import Stock from "./pages/admin/Stock";
import Staff from "./pages/admin/Staff";
import Settings from "./pages/admin/Settings";

import POSLayout from "./layout/POSLayout";
import AdminLayout from "./layout/AdminLayout";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/pos" />} />

      {/* POS */}
      <Route
        path="/pos"
        element={
          <POSLayout>
            <POS />
          </POSLayout>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin/dashboard"
        element={<AdminLayout><Dashboard /></AdminLayout>}
      />

      <Route
        path="/admin/products"
        element={<AdminLayout><Products /></AdminLayout>}
      />

      <Route
        path="/admin/reports"
        element={<AdminLayout><Reports /></AdminLayout>}
      />

      <Route
        path="/admin/sales"
        element={<AdminLayout><Sales /></AdminLayout>}
      />

      <Route
        path="/admin/stock"
        element={<AdminLayout><Stock /></AdminLayout>}
      />

      <Route
        path="/admin/staff"
        element={<AdminLayout><Staff /></AdminLayout>}
      />

      <Route
        path="/admin/settings"
        element={<AdminLayout><Settings /></AdminLayout>}
      />

    </Routes>
  );
}

export default App;