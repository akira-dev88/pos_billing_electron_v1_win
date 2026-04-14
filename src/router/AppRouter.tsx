import { BrowserRouter, Routes, Route } from "react-router-dom";

import POSPage from "../pages/pos/POSPage";
import Dashboard from "../pages/admin/Dashboard";
import Reports from "../pages/admin/Reports";
import Products from "../pages/admin/Products";
import Stock from "../pages/admin/Stock";
import Staff from "../pages/admin/Staff";
import Settings from "../pages/admin/Settings";
import Sales from "../pages/admin/Sales";

import AdminLayout from "../layout/AdminLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* POS */}
        <Route path="/pos" element={<POSPage />} />

        {/* ADMIN WITH LAYOUT */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <AdminLayout>
              <Reports />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <Products />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/stock"
          element={
            <AdminLayout>
              <Stock />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/sales"
          element={
            <AdminLayout>
              <Sales />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/staff"
          element={
            <AdminLayout>
              <Staff />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}