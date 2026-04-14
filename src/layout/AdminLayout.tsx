import { NavLink, Outlet } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Reports", path: "/admin/reports" },
  { name: "Products", path: "/admin/products" },
  { name: "Stock", path: "/admin/stock" },
  { name: "Sales", path: "/admin/sales" },
  { name: "Staff", path: "/admin/staff" },
  { name: "Settings", path: "/admin/settings" },
];

function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">

        {/* Logo */}
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          POS Admin
        </div>

        {/* Menu */}
        <div className="flex-1 p-2 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-700 text-sm text-gray-400">
          Logged in as <br />
          <b>Admin</b>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="h-14 bg-white border-b flex items-center justify-between px-4">

          <div className="font-semibold">
            Admin Panel
          </div>

          <div className="text-sm text-gray-600">
            Welcome 👋
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;