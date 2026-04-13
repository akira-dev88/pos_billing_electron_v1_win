import { useEffect, useState } from "react";
import { getProducts } from "./renderer/services/productApi";
import { useCartStore } from "./renderer/store/cartStore";
import type { Product } from "./renderer/types/product";

function App() {
  const { items, addItem } = useCartStore();
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
            <div key={item.product_uuid} className="flex justify-between border p-2">
              <span>{item.name}</span>
              <span>{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;