import { useEffect, useState } from "react";
import { getProducts } from "./renderer/services/productApi";
import type { Product } from "./renderer/types/product";
import { createCart, addItem as addItemApi, getCart } from "./renderer/services/cartApi";

function App() {

  const [cartUUID, setCartUUID] = useState<string | null>(null);
  const [cartData, setCartData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function init() {
      const res = await createCart();
      setCartUUID(res.cart_uuid);
    }

    init();
  }, []);

  const handleAddItem = async (p: Product) => {
  if (!cartUUID) {
    console.log("❌ cartUUID missing");
    return;
  }

  console.log("➡️ Adding product:", p.product_uuid);

  const res = await addItemApi(cartUUID, p.product_uuid);
  console.log("🧾 addItem response:", res);

  const updatedCart = await getCart(cartUUID);
  console.log("🛒 cart response:", updatedCart);

  setCartData(updatedCart);
};

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
            <div key={item.product_uuid} className="border p-2">
              <div className="flex justify-between">
                <span>{item.product.name}</span>
                <span>{item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 border-t pt-4 space-y-1">
          <div className="flex justify-between">
            <span>Total</span>
            <span>₹{cartData?.summary?.total}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{cartData?.summary?.tax}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Grand Total</span>
            <span>₹{cartData?.summary?.grand_total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;