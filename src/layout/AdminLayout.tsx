import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";

function NavItem({
  label,
  path,
  currentPath,
  onClick,
}: {
  label: string;
  path: string;
  currentPath: string;
  onClick: () => void;
}) {
  const active = currentPath === path;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      {label}
    </button>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // ✅ Prevent crash if user not loaded yet
  if (!user) {
    return <div className="p-4">Loading user...</div>;
  }

  // ✅ Works correctly with HashRouter
  const currentPath = location.pathname;

  return (
    <div className="h-screen flex">

      {/* 🧭 Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="text-lg font-bold">Admin Panel</div>
          <div className="text-xs text-gray-400 capitalize">
            {user.role}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">

          {user.role === "owner" && (
            <NavItem
              label="Dashboard"
              path="/admin/dashboard"
              currentPath={currentPath}
              onClick={() => navigate("/admin/dashboard")}
            />
          )}

          {["owner", "manager"].includes(user.role) && (
            <>
              <NavItem
                label="Products"
                path="/admin/products"
                currentPath={currentPath}
                onClick={() => navigate("/admin/products")}
              />

              <NavItem
                label="Stock"
                path="/admin/stock"
                currentPath={currentPath}
                onClick={() => navigate("/admin/stock")}
              />

              <NavItem
                label="Sales"
                path="/admin/sales"
                currentPath={currentPath}
                onClick={() => navigate("/admin/sales")}
              />
            </>
          )}

          {user.role === "owner" && (
            <>
              <NavItem
                label="Reports"
                path="/admin/reports"
                currentPath={currentPath}
                onClick={() => navigate("/admin/reports")}
              />

              <NavItem
                label="Staff"
                path="/admin/staff"
                currentPath={currentPath}
                onClick={() => navigate("/admin/staff")}
              />

              <NavItem
                label="Settings"
                path="/admin/settings"
                currentPath={currentPath}
                onClick={() => navigate("/admin/settings")}
              />
            </>
          )}

          {/* Always visible */}
          <NavItem
            label="Profile"
            path="/admin/profile"
            currentPath={currentPath}
            onClick={() => navigate("/admin/profile")}
          />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={() => navigate("/pos")}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold"
          >
            Go to POS
          </button>
        </div>
      </div>

      {/* 📄 Content */}
      <div className="flex-1 flex flex-col bg-gray-100">

        {/* 🔝 Topbar */}
        <Topbar />

        {/* 📄 Page Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}