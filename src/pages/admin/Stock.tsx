import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getStock, updateStock } from "../../renderer/services/stockApi";

export default function Stock() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);

  const loadStock = async () => {
    const data = await getStock();
    setItems(data);
    
  };

  useEffect(() => {
    loadStock();
  }, []);

  const handleUpdate = async (uuid: string) => {
    await updateStock(uuid, newStock);
    setEditing(null);
    setNewStock(0);
    loadStock();
  };

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
              key={item.name}
              className="grid grid-cols-4 p-3 border-b items-center"
            >
              <span>{item.name}</span>

              {/* Stock */}
              <span className={isLow ? "text-red-600 font-bold" : ""}>
                {item.stock}
              </span>

              {/* Status */}
              <span>
                {isLow ? (
                  <span className="text-red-500">Low Stock</span>
                ) : (
                  <span className="text-green-600">OK</span>
                )}
              </span>

              {/* Actions */}
              <div>
                {editing === item.name ? (
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
                      setEditing(item.name);
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