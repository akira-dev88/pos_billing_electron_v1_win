import { useEffect, useState } from "react";
import { getStock, updateStock } from "../../renderer/services/stockApi";

export default function Stock() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const loadStock = async () => {
    try {
      const data = await getStock();
      setItems(data || []);
    } catch (e) {
      console.error(e);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStock();
  }, []);

  const handleUpdate = async (uuid: string) => {
    try {
      await updateStock(uuid, newStock);
      setEditing(null);
      setNewStock(0);
      loadStock();
    } catch (e) {
      console.error(e);
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-4">Loading stock...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Stock Management</h1>

      <div className="bg-white rounded shadow">

        {/* Header */}
        <div className="grid grid-cols-4 p-3 border-b font-semibold">
          <span>Product</span>
          <span>Stock</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {items.map((item) => {
          const isLow = item.stock < 10;

          return (
            <div
              key={item.product_uuid}
              className="grid grid-cols-4 p-3 border-b items-center"
            >
              <span>{item.name}</span>

              <span className={isLow ? "text-red-600 font-bold" : ""}>
                {item.stock}
              </span>

              <span>
                {isLow ? (
                  <span className="text-red-500">Low</span>
                ) : (
                  <span className="text-green-600">OK</span>
                )}
              </span>

              <div>
                {editing === item.product_uuid ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="border p-1 w-20"
                      value={newStock}
                      onChange={(e) =>
                        setNewStock(Number(e.target.value))
                      }
                    />

                    <button
                      onClick={() => handleUpdate(item.product_uuid)}
                      className="bg-blue-600 text-white px-2"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditing(item.product_uuid);
                      setNewStock(item.stock);
                    }}
                    className="bg-yellow-500 text-white px-2"
                  >
                    Update
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No stock data
          </div>
        )}

      </div>
    </div>
  );
}