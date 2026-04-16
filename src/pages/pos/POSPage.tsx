import { useEffect, useState } from "react";
import { getProducts } from "../../renderer/services/productApi";
import type { Product } from "../../renderer/types/product";
import { useNavigate } from "react-router-dom";
import Products from "../../pages/admin/Products";
import Reports from "../../pages/admin/Reports";

import {
  createCart,
  addItem,
  getCart,
  updateItem,
  removeItem,
  applyDiscount,
} from "../../renderer/services/cartApi";

import { checkoutCart, getInvoice, getSales } from "../../renderer/services/saleApi";
import { addCustomerPayment, createCustomer, getCustomers, getLedger } from "../../renderer/services/customerApi";
import CustomerStatement from "../admin/CustomerStatement";

function POSpage() {

  const [cartUUID, setCartUUID] = useState<string | null>(null);
  const [cartData, setCartData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [showPrint, setShowPrint] = useState(false);

  const [payments, setPayments] = useState([
    { method: "cash", amount: 0 },
  ]);

  const [loading, setLoading] = useState(false);

  const [invoiceData, setInvoiceData] = useState<any>(null);

  const navigate = useNavigate();

  // Auto-fill first row
  useEffect(() => {
    if (cartData?.summary?.grand_total) {
      setPayments((prev) => {
        if (prev.length === 1 && prev[0].amount === 0) {
          return [
            {
              method: "cash",
              amount: Number(cartData.summary.grand_total),
            },
          ];
        }
        return prev;
      });
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

    if (totalPaid < grandTotal && !selectedCustomer) {
      alert("Select customer for credit sale");
      return;
    }

    if (
      selectedCustomer &&
      totalPaid < grandTotal &&
      selectedCustomer.credit_balance > 5000
    ) {
      alert("Customer already has high pending dues");
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

  const [sales, setSales] = useState<any[]>([]);
  const [showSales, setShowSales] = useState(false);

  const loadSales = async () => {
    const data = await getSales();
    setSales(data);
  };

  useEffect(() => {
    if (selectedCustomer && cartData?.summary?.grand_total) {
      const due = selectedCustomer.credit_balance || 0;

      if (due > 0) {
        setPayments([
          {
            method: "cash",
            amount: Math.min(due, cartData.summary.grand_total),
          },
        ]);
      }
    }
  }, [selectedCustomer]);

  return (
    <div className="h-screen flex flex-col">

      {/* 🔝 TOP BAR */}
      <div className="flex justify-between items-center px-4 py-2 border-b bg-white shadow-sm">

        {/* Navigation */}
        <div className="flex gap-2">
          <button onClick={() => navigate("/pos")} className="px-3 py-1 bg-blue-500 text-white rounded">
            POS
          </button>
          <button onClick={() => navigate("/admin/dashboard")} className="px-3 py-1 bg-gray-200 rounded">
            Admin
          </button>
          <button onClick={() => navigate("/admin/products")} className="px-3 py-1 bg-gray-200 rounded">
            Products
          </button>
        </div>

        {/* Actions */}
        <button
          className="px-3 py-1 bg-black text-white rounded"
          onClick={() => {
            loadSales();
            setShowSales(true);
          }}
        >
          Sales
        </button>
      </div>

      {/* 🧱 MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">

        {/* 🛍️ LEFT: PRODUCTS */}
        <div className="w-1/2 border-r flex flex-col">

          <div className="p-3 font-bold border-b">Products</div>

          <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2">
            {products.map((p) => (
              <div
                key={p.product_uuid}
                className="border p-3 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => handleAddItem(p)}
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">₹{p.price}</div>
              </div>
            ))}
          </div>

        </div>

        {/* 🛒 RIGHT: CART */}
        <div className="w-1/2 flex flex-col">

          {/* Cart Header */}
          <div className="p-3 font-bold border-b">Cart</div>

          <div className="mb-4">
            <div className="text-xl font-bold">My Store</div>
            <div className="text-xs">GSTIN: 33ABCDE1234F1Z5</div>
            <div className="text-xs">Chennai, Tamil Nadu</div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cartData?.cart?.items?.map((item: any) => (
              <div
                key={item.product_uuid}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{item.product.name}</span>

                <div className="flex items-center gap-2">
                  <button className="px-2 bg-red-500 text-white rounded" onClick={() => handleDecrease(item)}>
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button className="px-2 bg-green-500 text-white rounded" onClick={() => handleIncrease(item)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 💰 SUMMARY + CONTROLS */}
          <div className="border-t p-3 space-y-3 bg-gray-50">

            {/* Totals */}
            <div className="text-sm space-y-1">
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

            {/* Customer */}
            <div>
              <select
                className="w-full border p-2 rounded"
                value={selectedCustomer?.customer_uuid || ""}
                onChange={(e) => {
                  const c = customers.find(x => x.customer_uuid === e.target.value);
                  setSelectedCustomer(c || null);
                }}
              >
                <option value="">Walk-in Customer</option>
                {customers.map((c) => (
                  <option key={c.customer_uuid} value={c.customer_uuid}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                className="text-blue-600 text-xs mt-1"
                onClick={() => setShowCustomerModal(true)}
              >
                + Add Customer
              </button>
            </div>

            {/* Discount */}
            <div className="flex gap-2">
              <input
                type="number"
                className="border p-2 w-full rounded"
                placeholder="Discount"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
              <button
                className="bg-blue-600 text-white px-3 rounded"
                onClick={handleApplyDiscount}
              >
                Apply
              </button>
            </div>

            {/* Payments */}
            <div className="space-y-2">
              {payments.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <select
                    className="border p-2 rounded"
                    value={p.method}
                    onChange={(e) => updatePayment(i, "method", e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                  </select>

                  <input
                    type="number"
                    className="border p-2 w-full rounded"
                    value={p.amount}
                    onChange={(e) =>
                      updatePayment(i, "amount", Number(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="text-sm">
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
            </div>

            {/* Checkout */}
            <button
              className="w-full bg-green-600 text-white p-3 rounded font-bold"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Checkout"}
            </button>

          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setShowPrint(true);

          setTimeout(() => {
            window.print();
            setShowPrint(false);
          }, 300);
        }}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Print Statement
      </button>

      {selectedCustomer?.credit_balance > 0 && (
        <button
          className="w-full bg-orange-500 text-white p-2 rounded"
          onClick={() => {
            setPayments([
              {
                method: "cash",
                amount: selectedCustomer.credit_balance,
              },
            ]);
          }}
        >
          Clear Old Due ₹{selectedCustomer.credit_balance}
        </button>
      )}

      {showPrint && (
        <div className="fixed inset-0 bg-white z-50">
          <CustomerStatement
            customer={selectedCustomer}
            ledger={ledger}
          />
        </div>
      )}


    </div>


  );


}

export default POSpage;
