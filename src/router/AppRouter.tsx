import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import POSPage from "../pages/pos/POSPage";
import Dashboard from "../pages/admin/Dashboard";
import Reports from "../pages/admin/Reports";
import Products from "../pages/admin/Products";
import Stock from "../pages/admin/Stock";
import Staff from "../pages/admin/Staff";
import Settings from "../pages/admin/Settings";
import Sales from "../pages/admin/Sales";
import SupplierPage from "../pages/admin/Supplier";
import LoginPage from "../pages/LoginPage";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🔓 PUBLIC (optional) */}
        <Route path="/pos" element={<POSPage />} />

        {/* 🔒 ADMIN AREA */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["owner", "manager"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="products" element={<Products />} />
          <Route path="stock" element={<Stock />} />
          <Route path="sales" element={<Sales />} />
          <Route path="staff" element={<Staff />} />
          <Route path="settings" element={<Settings />} />
          <Route path="supplier" element={<SupplierPage />} />
        </Route>

        {/* 🔁 DEFAULT ROUTE */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ❌ 404 fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}