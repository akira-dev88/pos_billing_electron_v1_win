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

  const [payments, setPayments] = useState([
    { method: "cash", amount: 0 },
  ]);

  const [loading, setLoading] = useState(false);

  // Auto-fill first row
  useEffect(() => {
    if (cartData?.summary?.grand_total) {
      setPayments([
        {
          method: "cash",
          amount: Number(cartData.summary.grand_total),
        },
      ]);
    }
  }, [cartData]);

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

    if (totalPaid < grandTotal) {
      alert("Insufficient payment");
      return;
    }

    setLoading(true);

    try {
      const res = await checkoutCart(cartUUID, payments);

      console.log("✅ Checkout success:", res);

      alert("Payment successful");

      // 🔄 Reset
      const newCart = await createCart();
      setCartUUID(newCart.cart_uuid);
      setCartData(null);
      setPayments([{ method: "cash", amount: 0 }]);

    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }

    setLoading(false);
  };

  const updatePayment = (index: number, field: string, value: any) => {
    const updated = [...payments];
    updated[index] = { ...updated[index], [field]: value };
    setPayments(updated);
  };

  const addPaymentRow = () => {
    setPayments([...payments, { method: "upi", amount: 0 }]);
  };

  const removePaymentRow = (index: number) => {
    const updated = payments.filter((_, i) => i !== index);
    setPayments(updated);
  };

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const grandTotal = Number(cartData?.summary?.grand_total || 0);

  const balance = totalPaid - grandTotal;

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

          <h2 className="font-semibold">Payments</h2>

          {payments.map((p, index) => (
            <div key={index} className="flex gap-2 items-center">

              {/* Method */}
              <select
                className="border p-2"
                value={p.method}
                onChange={(e) => updatePayment(index, "method", e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>

              {/* Amount */}
              <input
                type="number"
                className="border p-2 w-full"
                value={p.amount}
                onChange={(e) =>
                  updatePayment(index, "amount", Number(e.target.value))
                }
              />

              {/* Remove */}
              {payments.length > 1 && (
                <button
                  className="px-2 bg-red-500 text-white"
                  onClick={() => removePaymentRow(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* Add Payment */}
          <button
            className="text-blue-600 text-sm"
            onClick={addPaymentRow}
          >
            + Add Payment
          </button>

          {/* Summary */}
          <div className="flex justify-between">
            <span>Paid</span>
            <span>₹{totalPaid}</span>
          </div>

          <div className="flex justify-between">
            <span>Balance</span>
            <span className={balance < 0 ? "text-red-500" : "text-green-600"}>
              ₹{balance}
            </span>
          </div>

          {/* Checkout */}
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