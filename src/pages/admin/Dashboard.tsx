import { useEffect, useState } from "react";
import { getDashboardReport } from "../../renderer/services/reportApi";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardReport()
      .then(setData)
      .catch((err) => {
        console.error("Dashboard error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  if (!data) return <div className="text-red-500">Failed to load data</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="text-gray-500 text-sm">Today's Sales</div>
          <div className="text-3xl font-bold text-green-600">
            ₹{data.today_sales}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="text-gray-500 text-sm">Monthly Sales</div>
          <div className="text-3xl font-bold text-blue-600">
            ₹{data.month_sales}
          </div>
        </div>

      </div>
    </div>
  );
}