import { useEffect, useState } from "react";
import { getPurchases } from "../../renderer/services/purchaseApi";

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState<any[]>([]);
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
              className="grid grid-cols-3 p-3 border-b"
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
    </div>
  );
}