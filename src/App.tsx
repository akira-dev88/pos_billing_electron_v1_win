import { useEffect, useState } from "react";
import { getProducts } from "./renderer/services/productApi";
import type { Product } from "./renderer/types/product";

import {
  createCart,
  addItem,
  getCart,
  updateItem,
  removeItem,
  applyDiscount,
} from "./renderer/services/cartApi";

import { checkoutCart, getInvoice } from "./renderer/services/saleApi";
import { addCustomerPayment, createCustomer, getCustomers, getLedger } from "./renderer/services/customerApi";

function App() {

  const [cartUUID, setCartUUID] = useState<string | null>(null);
  const [cartData, setCartData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [payments, setPayments] = useState([
    { method: "cash", amount: 0 },
  ]);

  const [loading, setLoading] = useState(false);

  const [invoiceData, setInvoiceData] = useState<any>(null);

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
      const res = await checkoutCart(
        cartUUID,
        payments,
        selectedCustomer?.customer_uuid || null
      );

      console.log("🔥 FULL CHECKOUT RESPONSE:", res);

      console.log("✅ Checkout success:", res);

      // 🔥 IMPORTANT: get sale_uuid
      const saleUUID = res.sale?.sale_uuid;

      if (!saleUUID) {
        console.error("❌ sale_uuid missing", res);
        alert("Invoice failed");
        return;
      }

      const invoice = await getInvoice(saleUUID);
      setInvoiceData(invoice);

      // ⏱ auto print after render
      setTimeout(() => {
        window.print();
      }, 500);

      alert("Payment successful");

      // reset cart
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

  const [discount, setDiscount] = useState(0);

  const handleApplyDiscount = async () => {
    if (!cartUUID) return;

    await applyDiscount(cartUUID, discount);
    await refreshCart();
  };

  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    mobile: "",
  });

  const [ledger, setLedger] = useState<any[]>([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    getCustomers().then(setCustomers);
  }, []);

  const handleSelectCustomer = async (c: any) => {
    setSelectedCustomer(c);

    const data = await getLedger(c.customer_uuid);
    setLedger(data);
  };

  const handleCustomerPayment = async () => {
    if (!selectedCustomer) return;

    await addCustomerPayment(selectedCustomer.customer_uuid, {
      amount: paymentAmount,
      method: paymentMethod,
    });

    // refresh ledger
    const data = await getLedger(selectedCustomer.customer_uuid);
    setLedger(data);

    setPaymentAmount(0);
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

        <div className="mt-6 border-t pt-4">

          <h2 className="font-semibold">Customer</h2>

          {/* Select */}
          <select
            className="w-full border p-2 mt-2"
            value={selectedCustomer?.customer_uuid || ""}
            onChange={(e) => {
              const c = customers.find(
                (x) => x.customer_uuid === e.target.value
              );
              setSelectedCustomer(c || null);
            }}
          >
            <option value="">Walk-in Customer</option>

            {customers.map((c) => (
              <option key={c.customer_uuid} value={c.customer_uuid}>
                {c.name} ({c.mobile})
              </option>
            ))}
          </select>

          {/* Add new */}
          <button
            className="text-blue-600 text-sm mt-2"
            onClick={() => setShowCustomerModal(true)}
          >
            + Add Customer
          </button>

          {/* Selected info */}
          {selectedCustomer && (
            <div className="mt-2 text-sm bg-gray-100 p-2">
              <div><b>{selectedCustomer.name}</b></div>
              <div>📞 {selectedCustomer.mobile}</div>
              <div>💰 Balance: ₹{selectedCustomer.credit_balance || 0}</div>
            </div>
          )}

        </div>

        {selectedCustomer && (
          <div className="mt-4 border p-3">

            <h3 className="font-bold mb-2">Ledger</h3>

            {/* Ledger List */}
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {ledger.map((entry, i) => (
                <div key={i} className="flex justify-between text-sm border-b pb-1">
                  <span>{entry.type}</span>
                  <span>₹{entry.amount}</span>
                </div>
              ))}
            </div>

            {/* Payment Entry */}
            <div className="mt-3 space-y-2">

              <h4 className="font-semibold">Add Payment</h4>

              <div className="flex gap-2">
                <input
                  type="number"
                  className="border p-2 w-full"
                  placeholder="Amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                />

                <select
                  className="border p-2"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <button
                className="w-full bg-blue-600 text-white p-2"
                onClick={handleCustomerPayment}
              >
                Add Payment
              </button>
            </div>

          </div>
        )}

        <div className="mt-4 border-t pt-4">
          <h2 className="font-semibold">Discount</h2>

          <div className="flex gap-2 mt-2">
            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Enter discount"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />

            <button
              className="bg-blue-600 text-white px-4"
              onClick={handleApplyDiscount}
            >
              Apply
            </button>
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

      {/* INVOICE MODAL */}
      {invoiceData && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">

          <div className="bg-white p-4 w-[300px] text-sm font-mono">

            <h2 className="text-center font-bold">
              {invoiceData?.shop?.name}
            </h2>

            <div className="text-center text-xs">
              {invoiceData?.shop?.address}
            </div>

            <div className="text-center text-xs mb-2">
              GSTIN: {invoiceData?.shop?.gstin}
            </div>

            <hr className="my-2" />

            {/* Items */}
            {invoiceData?.items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-xs">
                <span>
                  {item.name} x{item.qty}
                </span>
                <span>₹{item.total}</span>
              </div>
            ))}

            <hr className="my-2" />

            <div className="flex justify-between text-xs">
              <span>Total</span>
              <span>₹{invoiceData?.summary?.total}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span>GST</span>
              <span>₹{invoiceData?.summary?.tax}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Grand Total</span>
              <span>₹{invoiceData?.summary?.grand_total}</span>
            </div>

            <hr className="my-2" />

            <div className="text-center text-xs">
              Thank you! 🙏
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                className="w-full bg-blue-600 text-white p-2"
                onClick={() => window.print()}
              >
                Print
              </button>

              <button
                className="w-full bg-gray-400 text-white p-2"
                onClick={() => setInvoiceData(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {showCustomerModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">

          <div className="bg-white p-6 w-[300px]">

            <h2 className="font-bold mb-4">New Customer</h2>

            <input
              className="w-full border p-2 mb-2"
              placeholder="Name"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
            />

            <input
              className="w-full border p-2 mb-4"
              placeholder="Mobile"
              value={newCustomer.mobile}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, mobile: e.target.value })
              }
            />

            <div className="flex gap-2">
              <button
                className="w-full bg-green-600 text-white p-2"
                onClick={async () => {
                  const c = await createCustomer(newCustomer);

                  setCustomers((prev) => [...prev, c]);
                  setSelectedCustomer(c);

                  setNewCustomer({ name: "", mobile: "" });
                  setShowCustomerModal(false);
                }}
              >
                Save
              </button>

              <button
                className="w-full bg-gray-400 text-white p-2"
                onClick={() => setShowCustomerModal(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;