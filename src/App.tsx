import { useEffect, useState } from "react";
import { getProducts } from "./renderer/services/productApi";
import type { Product } from "./renderer/types/product";
import {
  createCart,
  addItem,
  getCart,
  updateItem,
  removeItem,
} from "./renderer/services/cartApi";

function App() {
  const [cartUUID, setCartUUID] = useState<string | null>(null);
  const [cartData, setCartData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // 🆕 Init cart
  useEffect(() => {
    async function init() {
      const res = await createCart();
      setCartUUID(res.cart_uuid);
    }
    init();
  }, []);

  // 📦 Load products
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // 🔁 Refresh cart
  const refreshCart = async () => {
    if (!cartUUID) return;
    const updated = await getCart(cartUUID);
    setCartData(updated);
  };

  // ➕ Add item
  const handleAddItem = async (p: Product) => {
    if (!cartUUID) return;

    await addItem(cartUUID, p.product_uuid);
    await refreshCart();
  };

  // ➕ Increase
  const handleIncrease = async (item: any) => {
    if (!cartUUID) return;

    await addItem(cartUUID, item.product_uuid);
    await refreshCart();
  };

  // ➖ Decrease
  const handleDecrease = async (item: any) => {
    if (!cartUUID) return;

    const newQty = item.quantity - 1;

    if (newQty <= 0) {
      await removeItem(cartUUID, item.product_uuid);
    } else {
      await updateItem(cartUUID, item.product_uuid, {
        quantity: newQty,
      });
    }

    await refreshCart();
  };

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
              onClick={() => handleAddItem(p)}
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
          {cartData?.cart?.items?.map((item: any) => (
            <div
              key={item.product_uuid}
              className="border p-2 flex justify-between items-center"
            >
              <span>{item.product.name}</span>

              <div className="flex items-center gap-2">

                {/* ➖ */}
                <button
                  className="px-2 bg-red-500 text-white"
                  onClick={() => handleDecrease(item)}
                >
                  -
                </button>

                <span>{item.quantity}</span>

                {/* ➕ */}
                <button
                  className="px-2 bg-green-500 text-white"
                  onClick={() => handleIncrease(item)}
                >
                  +
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* 💰 Totals */}
        <div className="mt-6 border-t pt-4 space-y-1">
          <div className="flex justify-between">
            <span>Total</span>
            <span>₹{cartData?.summary?.total || 0}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{cartData?.summary?.tax || 0}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Grand Total</span>
            <span>₹{cartData?.summary?.grand_total || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;