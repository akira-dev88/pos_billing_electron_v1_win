import { Routes, Route, Navigate } from "react-router-dom";

import POS from "./pages/pos/POSPage";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./layout/AdminLayout";

function App() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/pos" />} />

      {/* POS */}
      <Route path="/pos" element={<POS />} />

      {/* ADMIN (Nested Routes) */}
      <Route path="/admin" element={<AdminLayout />}>

        <Route path="dashboard" element={<Dashboard />} />

        {/* Placeholder pages for now */}
        <Route path="reports" element={<div>Reports</div>} />
        <Route path="products" element={<div>Products</div>} />
        <Route path="stock" element={<div>Stock</div>} />
        <Route path="sales" element={<div>Sales</div>} />
        <Route path="staff" element={<div>Staff</div>} />
        <Route path="settings" element={<div>Settings</div>} />

      </Route>

    </Routes>
  );
}

export default App;