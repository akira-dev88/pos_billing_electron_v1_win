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
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-start">
      <h1 className="text-3xl font-bold text-white">Reports</h1>

      {/* 💰 Profit Summary */}
      {profit && (
        <div className=" rounded-2xl shadow-lg text-start">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4">
              <div className="text-green-100 text-sm mb-1">Revenue</div>
              <div className="text-2xl font-bold text-white">
                ₹{profit.revenue?.toLocaleString()}
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4">
              <div className="text-red-100 text-sm mb-1">Cost</div>
              <div className="text-2xl font-bold text-white">
                ₹{profit.cost?.toLocaleString()}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4">
              <div className="text-blue-100 text-sm mb-1">Profit</div>
              <div className="text-2xl font-bold text-white">
                ₹{profit.profit?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 Top Products */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
        <div className="border-b border-gray-100 text-start">
          <h2 className="text-lg font-semibold text-gray-800">Top Products</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {top.length === 0 ? (
            <div className="text-center text-gray-400">No data</div>
          ) : (
            top.map((p) => (
              <div key={p.product_uuid} className="flex justify-between items-center px-0 py-4 hover:bg-gray-50 cursor-pointer transition-all">
                <span className="text-gray-700">{p.product?.name}</span>
                <span className="font-semibold text-blue-600">{p.total_qty} units</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 📦 Stock */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
        <div className="border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Stock</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {stock.length === 0 ? (
            <div className="text-center text-gray-400">No stock data</div>
          ) : (
            stock.map((s, i) => {
              const isLow = s.stock <= 10;
              const isOut = s.stock === 0;
              return (
                <div key={i} className="flex justify-between items-center px-0 py-4 hover:bg-gray-50 transition-all">
                  <span className="text-gray-700">{s.name}</span>
                  <span className={`font-semibold ${isOut ? "text-red-600" : isLow ? "text-orange-600" : "text-green-600"
                    }`}>
                    {s.stock} units
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}