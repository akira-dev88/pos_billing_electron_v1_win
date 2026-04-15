import { useEffect, useState } from "react";
import { getDashboardReport } from "../../renderer/services/reportApi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { getSalesTrend } from "../../renderer/services/reportApi";
import { getProfitTrend } from "../../renderer/services/reportApi";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profitTrend, setProfitTrend] = useState<any[]>([]);

  const [trend, setTrend] = useState<any[]>([]);

  useEffect(() => {
    getDashboardReport().then(setData).finally(() => setLoading(false));

    getSalesTrend()
      .then((res) => {
        // format date nicely
        const formatted = res.map((d: any) => ({
          ...d,
          date: new Date(d.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
        }));
        setTrend(formatted);
      })
      .catch(console.error);
  }, []);

  getProfitTrend()
    .then((res) => {
      const formatted = res.map((d: any) => ({
        ...d,
        date: new Date(d.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
      }));
      setProfitTrend(formatted);
    })
    .catch(console.error);

  if (loading) return <div>Loading dashboard...</div>;
  if (!data) return <div className="text-red-500">Failed to load data</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* 🔥 KPI CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow">
          <div className="text-gray-500 text-sm">Today's Sales</div>
          <div className="text-2xl font-bold text-green-600">
            ₹{Number(data.today_sales || 0).toFixed(2)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="text-gray-500 text-sm">Monthly Sales</div>
          <div className="text-2xl font-bold text-blue-600">
            ₹{Number(data.month_sales || 0).toFixed(2)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="text-gray-500 text-sm">Total Sales</div>
          <div className="text-2xl font-bold">
            ₹{Number(data.total_sales || 0).toFixed(2)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="text-gray-500 text-sm">Total Orders</div>
          <div className="text-2xl font-bold">
            {data.total_orders || 0}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Sales (Last 7 Days)</h2>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Profit (Last 7 Days)</h2>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profitTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#16a34a"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="cost"
                stroke="#dc2626"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="profit"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 GRID */}
      <div className="grid grid-cols-2 gap-4">

        {/* 🧾 Recent Sales */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Recent Sales</h2>

          {data.recent_sales?.length === 0 ? (
            <div className="text-gray-500 text-sm">No recent sales</div>
          ) : (
            data.recent_sales?.slice(0, 5).map((s: any) => (
              <div
                key={s.sale_uuid}
                className="flex justify-between border-b py-1 text-sm"
              >
                <span>{s.invoice_number}</span>
                <span>₹{Number(s.grand_total).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        {/* 📦 Low Stock */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Low Stock</h2>

          {data.low_stock?.length === 0 ? (
            <div className="text-gray-500 text-sm">All good 👍</div>
          ) : (
            data.low_stock?.slice(0, 5).map((p: any) => (
              <div
                key={p.product_uuid}
                className="flex justify-between border-b py-1 text-sm"
              >
                <span>{p.name}</span>
                <span className="text-red-600">{p.stock}</span>
              </div>
            ))
          )}
        </div>

        {/* 🏆 Top Products */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Top Products</h2>

          {data.top_products?.length === 0 ? (
            <div className="text-gray-500 text-sm">No data</div>
          ) : (
            data.top_products?.slice(0, 5).map((p: any, i: number) => (
              <div
                key={i}
                className="flex justify-between border-b py-1 text-sm"
              >
                <span>{p.name}</span>
                <span>{p.total_qty} sold</span>
              </div>
            ))
          )}
        </div>

        {/* 🚚 Recent Purchases */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Recent Purchases</h2>

          {data.recent_purchases?.length === 0 ? (
            <div className="text-gray-500 text-sm">No purchases</div>
          ) : (
            data.recent_purchases?.slice(0, 5).map((p: any) => (
              <div
                key={p.purchase_uuid}
                className="flex justify-between border-b py-1 text-sm"
              >
                <span>{p.supplier?.name || "Supplier"}</span>
                <span>₹{Number(p.total).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}