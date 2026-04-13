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

import { checkoutCart } from "./renderer/services/saleApi";

function App() {
  const [cartUUID, setCartUUID] = useState<string | null>(null);
  const [cartData, setCartData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [cash, setCash] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const handleCheckout = async () => {
    if (!cartUUID || !cartData) return;

    const grandTotal = Number(cartData.summary.grand_total);

    if (cash < grandTotal) {
      alert("Insufficient payment");
      return;
    }

    setLoading(true);

    try {
      const res = await checkoutCart(cartUUID, [
        { method: "cash", amount: cash },
      ]);

      console.log("✅ Checkout success:", res);

      alert("Payment successful");

      // 🔄 Reset cart
      const newCart = await createCart();
      setCartUUID(newCart.cart_uuid);
      setCartData(null);
      setCash(0);

    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }

    setLoading(false);
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

        <div className="mt-6 border-t pt-4 space-y-3">

          {/* Payment input */}
          <input
            type="number"
            placeholder="Enter cash amount"
            className="w-full p-2 border"
            value={cash}
            onChange={(e) => setCash(Number(e.target.value))}
            onFocus={() => setCash(cartData?.summary?.grand_total || 0)}
          />

          {/* Change */}
          <div className="flex justify-between">
            <span>Change</span>
            <span>
              ₹{Math.max(0, cash - (cartData?.summary?.grand_total || 0))}
            </span>
          </div>

          {/* Checkout button */}
          <button
            className="w-full bg-green-600 text-white p-3 font-bold"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Checkout"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default App;