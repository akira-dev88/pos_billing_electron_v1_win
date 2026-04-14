import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-60 bg-gray-900 text-white p-4 space-y-3">
        <h1 className="text-xl font-bold mb-4">Admin</h1>

        <Link to="/admin/dashboard">Dashboard</Link>
        <br />
        <Link to="/admin/reports">Reports</Link>
        <br />
        <Link to="/admin/products">Products</Link>
        <br />
        <Link to="/admin/stock">Stock</Link>
        <br />
        <Link to="/admin/sales">Sales</Link>
        <br />
        <Link to="/admin/staff">Staff</Link>
        <br />
        <Link to="/admin/settings">Settings</Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;