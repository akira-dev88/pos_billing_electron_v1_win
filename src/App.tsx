import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import POS from "./pages/pos/POSPage";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./layout/AdminLayout";

  function RouteLogger() {
    const location = useLocation();

    console.log("📍 Current Route:", location.pathname);

    return (
      <div className="fixed top-0 right-0 bg-black text-white text-xs p-1 z-50">
        {location.pathname}
      </div>
    );
  }
  
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

      <Route path="/" element={<Navigate to="/pos" />} />

        <Route path="/pos" element={<POS />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />

    </Routes>

    
  );
}



export default App;