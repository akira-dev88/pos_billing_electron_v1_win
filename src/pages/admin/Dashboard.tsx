import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getDashboardReport } from "../../renderer/services/reportApi";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDashboardReport().then(setData);
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {!data ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-white p-4 rounded shadow">
            <div className="text-gray-500">Today's Sales</div>
            <div className="text-2xl font-bold">
              ₹{data.today_sales}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <div className="text-gray-500">Monthly Sales</div>
            <div className="text-2xl font-bold">
              ₹{data.month_sales}
            </div>
          </div>

        </div>
      )}
    </AdminLayout>
  );
}