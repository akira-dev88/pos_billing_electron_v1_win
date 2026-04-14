import { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
      className={`w-full text-left px-3 py-2 rounded transition ${active
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
        }`}
    >
      {label}
    </button>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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
        <div className="flex-1 overflow-y-auto p-3 space-y-6">

          {/* 📊 Overview */}
          {user.role === "owner" && (
            <div>
              <div className="text-xs text-gray-400 mb-2">OVERVIEW</div>
              <NavItem
                label="Dashboard"
                path="/admin/dashboard"
                currentPath={currentPath}
                onClick={() => navigate("/admin/dashboard")}
              />
            </div>
          )}

          {/* 📦 Inventory */}
          {["owner", "manager"].includes(user.role) && (
            <div>
              <div className="text-xs text-gray-400 mb-2">INVENTORY</div>

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
            </div>
          )}

          {/* 💰 Sales */}
          {["owner", "manager"].includes(user.role) && (
            <div>
              <div className="text-xs text-gray-400 mb-2">SALES</div>

              <NavItem
                label="Sales History"
                path="/admin/sales"
                currentPath={currentPath}
                onClick={() => navigate("/admin/sales")}
              />
            </div>
          )}

          {/* 📈 Reports */}
          {user.role === "owner" && (
            <div>
              <div className="text-xs text-gray-400 mb-2">REPORTS</div>

              <NavItem
                label="Reports"
                path="/admin/reports"
                currentPath={currentPath}
                onClick={() => navigate("/admin/reports")}
              />
            </div>
          )}

          {/* ⚙️ Management */}
          {user.role === "owner" && (
            <div>
              <div className="text-xs text-gray-400 mb-2">MANAGEMENT</div>

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
            </div>
          )}
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
          {children}
        </div>

      </div>
    </div>
  );
}