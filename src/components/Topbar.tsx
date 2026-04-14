import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function getPageTitle(path: string) {
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/products")) return "Products";
    if (path.includes("/stock")) return "Stock";
    if (path.includes("/sales")) return "Sales";
    if (path.includes("/reports")) return "Reports";
    if (path.includes("/staff")) return "Staff";
    if (path.includes("/settings")) return "Settings";
    return "Admin";
}

export default function Topbar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const title = getPageTitle(location.pathname);

    return (
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between">

            {/* LEFT */}
            <div>
                <h1 className="text-xl font-semibold">{title}</h1>
                <div className="text-xs text-gray-500">
                    {location.pathname}
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                {/* Date */}
                <div className="text-sm text-gray-500">
                    {new Date().toLocaleString()}
                </div>

                {/* User */}
                <div className="text-right">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">
                        {user.role}
                    </div>
                    <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full">
                        {user.name.charAt(0)}
                    </div>

                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                    Logout
                </button>

            </div>
        </div>
    );
}