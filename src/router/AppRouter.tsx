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

        {/* ADMIN WITH LAYOUT */}
        <Route
          path="/admin/dashboard"
          element={
            <div>
              <Dashboard />
            </div>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <div>
              <Reports />
            </div>
          }
        />

        <Route
          path="/admin/products"
          element={
            <div>
              <Products />
            </div>
          }
        />

        <Route
          path="/admin/stock"
          element={
            <div>
              <Stock />
            </div>
          }
        />

        <Route
          path="/admin/sales"
          element={
            <div>
              <Sales />
            </div>
          }
        />

        <Route
          path="/admin/staff"
          element={
            <div>
              <Staff />
            </div>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <div>
              <Settings />
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}