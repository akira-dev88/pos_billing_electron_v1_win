import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex">

      {/* 🧭 Sidebar */}
      <div className="w-60 bg-gray-900 text-white flex flex-col">

        <div className="p-4 font-bold text-lg border-b border-gray-700">
          Admin Panel
        </div>

        <div className="flex-1 p-2 space-y-2">

          <button onClick={() => navigate("/admin/dashboard")} className="w-full text-left p-2 hover:bg-gray-700 rounded">
            Dashboard
          </button>

          <button onClick={() => navigate("/admin/products")} className="w-full text-left p-2 hover:bg-gray-700 rounded">
            Products
          </button>

          <button onClick={() => navigate("/admin/reports")} className="w-full text-left p-2 hover:bg-gray-700 rounded">
            Reports
          </button>

          <button onClick={() => navigate("/admin/sales")} className="w-full text-left p-2 hover:bg-gray-700 rounded">
            Sales
          </button>

          <button onClick={() => navigate("/admin/stock")} className="w-full text-left p-2 hover:bg-gray-700 rounded">
            Stock
          </button>

          <button onClick={() => navigate("/admin/staff")} className="w-full text-left p-2 hover:bg-gray-700 rounded">
            Staff
          </button>

          <button onClick={() => navigate("/admin/settings")} className="w-full text-left p-2 hover:bg-gray-700 rounded">
            Settings
          </button>

        </div>

        <div className="p-2 border-t border-gray-700">
          <button
            onClick={() => navigate("/pos")}
            className="w-full bg-blue-600 p-2 rounded"
          >
            Go to POS
          </button>
        </div>
      </div>

      {/* 📄 Content */}
      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}