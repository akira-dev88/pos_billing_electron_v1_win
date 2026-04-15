import { useEffect, useState } from "react";
import { getProfile } from "../../renderer/services/profileApi";

export default function Profile() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getProfile().then((res) => setData(res.data));
  }, []);

  if (!data) return <div>Loading...</div>;

  const { user, tenant } = data;

  const isExpiringSoon =
    new Date(tenant.expiry_date) <
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className={isExpiringSoon ? "text-red-500" : ""}>
        <b>Expiry:</b> {tenant.expiry_date}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 👤 User Info */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">User Info</h2>

          <div className="space-y-2 text-sm">
            <div><b>Name:</b> {user.name}</div>
            <div><b>Email:</b> {user.email}</div>
            <div><b>Role:</b> {user.role}</div>
          </div>
        </div>

        {/* 🏢 Subscription */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Subscription</h2>

          <div className="space-y-2 text-sm">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
              {tenant.plan.toUpperCase()}
            </span>
            <div><b>Price:</b> ₹{tenant.price}</div>
            <div>
              <b>Status:</b>{" "}
              <span className={tenant.is_active ? "text-green-600" : "text-red-500"}>
                {tenant.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div><b>Expiry:</b> {tenant.expiry_date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}