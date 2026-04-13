import { useEffect, useState } from "react";
import { getProducts } from "./renderer/services/productApi";
import { useCartStore } from "./renderer/store/cartStore";
import type { Product } from "./renderer/types/product";
import { useCartTotals } from "./renderer/hooks/useCartTotals";

function App() {
  const { items, addItem, removeItem, increaseQty, decreaseQty } = useCartStore();
  const totals = useCartTotals();
  const [products, setProducts] = useState<Product[]>([]);

  // 🔄 Load products from API
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="flex h-screen">

      {/* LEFT - PRODUCTS */}
      <div className="w-1/2 p-4 border-r">
        <h1 className="text-xl font-bold mb-4">Products</h1>

        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p.product_uuid}
              className="p-3 border cursor-pointer hover:bg-gray-100"
              onClick={() =>
                addItem({
                  product_uuid: p.product_uuid,
                  name: p.name,
                  price: p.price,
                  gst_percent: p.gst_percent ?? 0, // 🔥 FIX
                })
              }
            >
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-500">
                ₹{p.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - CART */}
      <div className="w-1/2 p-4">
        <h1 className="text-xl font-bold mb-4">Cart</h1>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.product_uuid} className="border p-2 space-y-1">

              <div className="flex justify-between">
                <span>{item.name}</span>
                <button onClick={() => removeItem(item.product_uuid)}>❌</button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button onClick={() => decreaseQty(item.product_uuid)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.product_uuid)}>+</button>
                </div>

                <span>₹{item.price * item.quantity}</span>
              </div>

            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 border-t pt-4 space-y-1">
          <div className="flex justify-between">
            <span>Total</span>
            <span>₹{totals.total}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{totals.tax}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Grand Total</span>
            <span>₹{totals.grand_total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;