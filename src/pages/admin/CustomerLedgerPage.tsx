import { useEffect, useState } from "react";
import {
  getCustomerLedger,
  addCustomerPayment,
} from "../../renderer/services/customerApi";
import CustomerStatement from "./CustomerStatement";

export default function CustomerLedgerPage({ customer }: any) {
  const [ledger, setLedger] = useState<any[]>([]);
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("cash");

  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    load();
  }, [customer]);

  const load = async () => {
    if (!customer) return;

    const data = await getCustomerLedger(customer.customer_uuid);
    setLedger(Array.isArray(data) ? data : []);
  };

  const handlePayment = async () => {
    if (!amount) return alert("Enter amount");

    await addCustomerPayment(customer.customer_uuid, {
      amount,
      method,
    });

    setAmount(0);
    await load();
  };

  return (
    <div className="space-y-4">

      {/* 💳 Add Payment */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="font-semibold">Add Payment</h2>

        <div className="flex gap-2">
          <input
            type="number"
            className="border p-2 w-full"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <select
            className="border p-2"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          <button
            onClick={handlePayment}
            className="bg-green-600 text-white px-4"
          >
            Pay
          </button>

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

        </div>
      </div>

      {/* 📋 Ledger */}
      <div className="bg-white rounded shadow">
        <div className="grid grid-cols-4 p-3 border-b font-semibold">
          <span>Type</span>
          <span>Amount</span>
          <span>Note</span>
          <span>Date</span>
        </div>

        {ledger.map((l) => (
          <div
            key={l.id}
            className="grid grid-cols-4 p-3 border-b text-sm"
          >
            <span className="capitalize">{l.type}</span>
            <span>₹{l.amount}</span>
            <span>{l.note}</span>
            <span>
              {new Date(l.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}