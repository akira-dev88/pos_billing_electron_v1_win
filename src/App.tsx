import { Routes, Route, Navigate } from "react-router-dom";

import POS from "./pages/pos/POSPage";

import AdminLayout from "./layout/AdminLayout";

import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Sales from "./pages/admin/Sales";
import Stock from "./pages/admin/Stock";
import Reports from "./pages/admin/Reports";
import Staff from "./pages/admin/Staff";
import Settings from "./pages/admin/Settings";
import Profile from "./pages/admin/Profile";
import SupplierPage from "./pages/admin/Supplier";

function App() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/pos" />} />

      {/* POS */}
      <Route path="/pos" element={<POS />} />

      {/* ✅ ADMIN ROUTES (NESTED) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="sales" element={<Sales />} />
        <Route path="stock" element={<Stock />} />
        <Route path="reports" element={<Reports />} />
        <Route path="supplier" element={<SupplierPage />} />
        <Route path="staff" element={<Staff />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default App;