import { useEffect, useState } from "react";
import { createPurchase } from "../../renderer/services/purchaseApi";
import { getProducts } from "../../renderer/services/productApi";
import { getSuppliers } from "../../renderer/services/supplierApi";

interface Item {
  product_uuid: string;
  quantity: number;
  cost_price: number;
}

export default function PurchasePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const [supplierId, setSupplierId] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    addItem(); // ✅ always start with one row
  }, []);

  const loadData = async () => {
    try {
      const [p, s] = await Promise.all([
        getProducts(),
        getSuppliers(),
      ]);

      setProducts(Array.isArray(p) ? p : []);
      setSuppliers(Array.isArray(s) ? s : []);
    } catch (e) {
      console.error("Load error:", e);
    }
  };

  // ➕ Add item
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { product_uuid: "", quantity: 1, cost_price: 0 },
    ]);
  };

  // ✏️ Update item safely
  const updateItem = (index: number, field: keyof Item, value: any) => {
    setItems((prev) => {
      const updated = [...prev];

      if (field === "product_uuid") {
        const product = products.find(
          (p) => p.product_uuid === value
        );

        updated[index] = {
          ...updated[index],
          product_uuid: value,
          cost_price:
            product?.purchase_price ??
            product?.price ??
            0,
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
      }

      return updated;
    });
  };

  // ❌ Remove item
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 💰 Total
  const total = items.reduce((sum, i) => {
    const qty = Number(i.quantity) || 0;
    const price = Number(i.cost_price) || 0;
    return sum + qty * price;
  }, 0);

  // 🚀 Submit
  const handleSubmit = async () => {
    const validItems = items.filter(
      (i) => i.product_uuid && i.quantity > 0
    );

    if (!supplierId) {
      alert("Select supplier");
      return;
    }

    if (validItems.length === 0) {
      alert("Add valid items");
      return;
    }

    try {
      setLoading(true);

      await createPurchase({
        supplier_uuid: supplierId,
        items: validItems,
      });

      alert("Purchase saved");

      // reset
      setItems([]);
      setSupplierId("");
      addItem();
    } catch (e) {
      console.error("Purchase error:", e);
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Purchase</h1>

      {/* Supplier */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <select
          className="border p-2 w-full"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s.supplier_uuid} value={s.supplier_uuid}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Items */}
      <div className="bg-white p-4 rounded shadow mb-4 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-2">
            {/* Product */}
            <select
              className="border p-2"
              value={item.product_uuid}
              onChange={(e) =>
                updateItem(index, "product_uuid", e.target.value)
              }
            >
              <option value="">Product</option>
              {(products || []).map((p) => (
                <option key={p.product_uuid} value={p.product_uuid}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Qty */}
            <input
              type="number"
              min="1"
              className="border p-2"
              value={item.quantity}
              onChange={(e) =>
                updateItem(
                  index,
                  "quantity",
                  Math.max(1, Number(e.target.value))
                )
              }
            />

            {/* Cost */}
            <input
              type="number"
              min="0"
              step="0.01"
              className="border p-2"
              value={item.cost_price}
              onChange={(e) =>
                updateItem(
                  index,
                  "cost_price",
                  Number(e.target.value) || 0
                )
              }
            />

            {/* Row total */}
            <div className="text-sm flex items-center">
              ₹{(item.quantity * item.cost_price).toFixed(2)}
            </div>

            {/* Delete */}
            <button
              onClick={() => removeItem(index)}
              className="bg-red-600 text-white rounded"
            >
              X
            </button>
          </div>
        ))}

        <button
          onClick={addItem}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          + Add Item
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white w-full p-3 rounded"
      >
        {loading ? "Saving..." : "Save Purchase"}
      </button>
    </div>
  );
}