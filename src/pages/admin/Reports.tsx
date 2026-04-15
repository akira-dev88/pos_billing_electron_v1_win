import { useEffect, useState } from "react";
import {
  getTopProducts,
  getStockReport,
  getProfitReport,
} from "../../renderer/services/reportApi";

export default function Reports() {
  const [top, setTop] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [profit, setProfit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getTopProducts(),
      getStockReport(),
      getProfitReport(),
    ]).then(([topRes, stockRes, profitRes]) => {

      if (topRes.status === "fulfilled") setTop(topRes.value);
      if (stockRes.status === "fulfilled") setStock(stockRes.value);
      if (profitRes.status === "fulfilled") setProfit(profitRes.value);

    });
  }, []);

  if (loading) return <div>Loading reports...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      {/* 💰 Profit */}
      {profit && (
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-3">Profit Summary</h2>

          <div className="grid grid-cols-3 gap-4 text-center">

            <div>
              <div className="text-gray-500 text-sm">Revenue</div>
              <div className="font-bold text-green-600">
                ₹{profit.revenue}
              </div>
            </div>

            <div>
              <div className="text-gray-500 text-sm">Cost</div>
              <div className="font-bold text-red-500">
                ₹{profit.cost}
              </div>
            </div>

            <div>
              <div className="text-gray-500 text-sm">Profit</div>
              <div className="font-bold text-blue-600">
                ₹{profit.profit}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🔥 Top Products */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">Top Products</h2>

        {top.length === 0 ? (
          <div className="text-gray-500">No data</div>
        ) : (
          top.map((p) => (
            <div
              key={p.product_uuid}
              className="flex justify-between border-b py-2"
            >
              <span>{p.product?.name}</span>
              <span className="font-semibold">{p.total_qty}</span>
            </div>
          ))
        )}
      </div>

      {/* 📦 Stock */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Stock</h2>

        {stock.length === 0 ? (
          <div className="text-gray-500">No stock data</div>
        ) : (
          stock.map((s, i) => (
            <div
              key={i}
              className="flex justify-between border-b py-2"
            >
              <span>{s.name}</span>
              <span className="font-semibold">{s.stock}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}