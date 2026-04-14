import { BrowserRouter, Routes, Route } from "react-router-dom";

import POSPage from "../pages/pos/POSPage";
import Dashboard from "../pages/admin/Dashboard";
import Reports from "../pages/admin/Reports";
import Products from "../pages/admin/Products";
import Stock from "../pages/admin/Stock";
import Staff from "../pages/admin/Staff";
import Settings from "../pages/admin/Settings";
import Sales from "../pages/admin/Sales";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* POS */}
        <Route path="/pos" element={<POSPage />} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/stock" element={<Stock />} />
        <Route path="/admin/staff" element={<Staff />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/sales" element={<Sales />} />

      </Routes>
    </BrowserRouter>
  );
}