import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  getTopProducts,
  getStockReport,
  getProfitReport,
} from "../../renderer/services/reportApi";

export default function Reports() {
  const [top, setTop] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [profit, setProfit] = useState<any>(null);

  useEffect(() => {
    getTopProducts().then(setTop);
    getStockReport().then(setStock);
    getProfitReport().then(setProfit);
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {/* 💰 Profit */}
      {profit && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-bold mb-2">Profit</h2>
          <div>Revenue: ₹{profit.revenue}</div>
          <div>Cost: ₹{profit.cost}</div>
          <div className="font-bold">Profit: ₹{profit.profit}</div>
        </div>
      )}

      {/* 🔥 Top Products */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-bold mb-2">Top Products</h2>

        {top.map((p) => (
          <div key={p.product_uuid} className="flex justify-between border-b py-1">
            <span>{p.product.name}</span>
            <span>{p.total_qty}</span>
          </div>
        ))}
      </div>

      {/* 📦 Stock */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Stock</h2>

        {stock.map((s, i) => (
          <div key={i} className="flex justify-between border-b py-1">
            <span>{s.name}</span>
            <span>{s.stock}</span>
          </div>
        ))}
      </div>

    </AdminLayout>
  );
}