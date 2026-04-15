import { useEffect, useState } from "react";
import { getPurchases } from "../../renderer/services/purchaseApi";

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getPurchases();
      setPurchases(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Purchase History</h1>

      {/* 📋 TABLE */}
      <div className="bg-white rounded shadow">
        <div className="grid grid-cols-3 p-3 border-b font-semibold">
          <span>Supplier</span>
          <span>Total</span>
          <span>Date</span>
        </div>

        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : purchases.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No purchases found
          </div>
        ) : (
          purchases.map((p) => (
            <div
              key={p.purchase_uuid}
              onClick={() => setSelected(p)} // ✅ CLICK TO OPEN
              className="grid grid-cols-3 p-3 border-b cursor-pointer hover:bg-gray-50"
            >
              <span>{p.supplier?.name || "Walk-in Supplier"}</span>
              <span>₹{Number(p.total).toFixed(2)}</span>
              <span>
                {new Date(p.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* 🧾 MODAL */}
      {selected && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">

          <div className="bg-white w-[400px] p-4 rounded shadow">

            {/* Header */}
            <h2 className="text-lg font-bold mb-2">
              Purchase Details
            </h2>

            <div className="text-sm mb-2">
              <div>
                <strong>Supplier:</strong>{" "}
                {selected.supplier?.name || "Walk-in Supplier"}
              </div>

              <div>
                <strong>Date:</strong>{" "}
                {new Date(selected.created_at).toLocaleString()}
              </div>
            </div>

            <hr className="my-2" />

            {/* Items */}
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {selected.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product?.name || "Item"} x{item.quantity}
                  </span>

                  <span>
                    ₹{Number(item.cost_price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-2" />

            {/* Total */}
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{Number(selected.total).toFixed(2)}</span>
            </div>

            {/* Buttons */}
            <div className="mt-4">
              <button
                onClick={() => setSelected(null)}
                className="w-full bg-gray-600 text-white p-2 rounded"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}