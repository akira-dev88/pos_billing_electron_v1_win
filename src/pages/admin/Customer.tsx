import { useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../renderer/services/customerApi";

import CustomerLedgerModal from "./CustomerLedgerPage";
import { apiGet } from "../../renderer/services/api";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const [editing, setEditing] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    gstin: "",
    credit_limit: 0,
  });

  const [aging, setAging] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);

  // 🔄 LOAD ALL DATA
  useEffect(() => {
    loadCustomers();
    loadInsights();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadInsights = async () => {
    try {
      const [agingData, reminderData] = await Promise.all([
        apiGet("/customers/aging"),
        apiGet("/customers/reminders"),
      ]);

      setAging(Array.isArray(agingData) ? agingData : []);
      setReminders(Array.isArray(reminderData) ? reminderData : []);
    } catch (e) {
      console.error("Insights error:", e);
    }
  };

  // 🔁 RESET FORM
  const resetForm = () => {
    setEditing(null);
    setForm({
      name: "",
      mobile: "",
      address: "",
      gstin: "",
      credit_limit: 0,
    });
  };

  // 💾 SAVE
  const handleSave = async () => {
    if (!form.name) return alert("Name required");

    try {
      if (editing) {
        const updated = await updateCustomer(editing.customer_uuid, form);

        setCustomers((prev) =>
          prev.map((c) =>
            c.customer_uuid === updated.customer_uuid ? updated : c
          )
        );
      } else {
        const created = await createCustomer(form);
        setCustomers((prev) => [created, ...prev]);
      }

      resetForm();
    } catch (e) {
      console.error(e);
      alert("Save failed");
    }
  };

  // ✏️ EDIT
  const handleEdit = (c: any) => {
    setEditing(c);
    setForm({
      name: c.name,
      mobile: c.mobile || "",
      address: c.address || "",
      gstin: c.gstin || "",
      credit_limit: c.credit_limit || 0,
    });
  };

  // ❌ DELETE
  const handleDelete = async (uuid: string) => {
    if (!confirm("Delete customer?")) return;

    await deleteCustomer(uuid);
    setCustomers((prev) =>
      prev.filter((c) => c.customer_uuid !== uuid)
    );
  };

  return (
    <div className="space-y-6">

      {/* 🔷 HEADER */}
      <h1 className="text-2xl font-bold">Customers</h1>

      {/* 🔷 MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* 🧾 LEFT: FORM */}
        <div className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="font-semibold">
            {editing ? "Edit Customer" : "Add Customer"}
          </h2>

          <input
            placeholder="Name"
            className="border p-2 w-full"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Mobile"
            className="border p-2 w-full"
            value={form.mobile}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value })
            }
          />

          <input
            placeholder="Address"
            className="border p-2 w-full"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <input
            placeholder="GSTIN"
            className="border p-2 w-full"
            value={form.gstin}
            onChange={(e) =>
              setForm({ ...form, gstin: e.target.value })
            }
          />

          {/* ✅ CREDIT LIMIT */}
          <input
            type="number"
            placeholder="Credit Limit"
            className="border p-2 w-full"
            value={form.credit_limit}
            onChange={(e) =>
              setForm({
                ...form,
                credit_limit: Number(e.target.value),
              })
            }
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editing ? "Update" : "Create"}
            </button>

            {editing && (
              <button
                onClick={resetForm}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* 📋 CENTER: CUSTOMER LIST */}
        <div className="bg-white rounded shadow col-span-2">
          {customers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No customers
            </div>
          ) : (
            (customers || []).map((c) => {
              const availableCredit =
                (c.credit_limit || 0) - (c.credit_balance || 0);

              return (
                <div
                  key={c.customer_uuid}
                  className="flex justify-between items-center border-b p-3"
                >
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-gray-500">
                      {c.mobile}
                    </div>

                    {/* 💰 CREDIT INFO */}
                    <div className="text-xs mt-1">
                      Credit:
                      <span
                        className={`ml-1 font-semibold ${
                          c.credit_balance > c.credit_limit
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        ₹{c.credit_balance || 0} / ₹{c.credit_limit || 0}
                      </span>
                    </div>

                    {/* 🧠 AVAILABLE CREDIT */}
                    <div className="text-xs text-gray-500">
                      Available: ₹{availableCredit}
                    </div>
                  </div>

                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="text-blue-600"
                    >
                      Ledger
                    </button>

                    <button
                      onClick={() => handleEdit(c)}
                      className="text-gray-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c.customer_uuid)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 🔥 INSIGHTS */}
      <div className="grid grid-cols-2 gap-6">

        {/* 📊 AGING */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Credit Aging</h2>

          {aging.length === 0 ? (
            <div className="text-sm text-gray-500">No data</div>
          ) : (
            aging.map((c, i) => (
              <div key={i} className="border-b py-2 text-sm">
                <div className="font-semibold">{c.name}</div>

                <div className="grid grid-cols-4 text-xs mt-1">
                  <span>0-30: ₹{c.aging["0_30"]}</span>
                  <span>31-60: ₹{c.aging["31_60"]}</span>
                  <span>61-90: ₹{c.aging["61_90"]}</span>
                  <span className="text-red-600">
                    90+: ₹{c.aging["90_plus"]}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🔔 REMINDERS */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3 text-red-600">
            Payment Reminders
          </h2>

          {reminders.length === 0 ? (
            <div className="text-sm text-gray-500">
              No pending dues
            </div>
          ) : (
            reminders.map((r: any, i) => (
              <div
                key={i}
                className="flex justify-between text-sm py-1 border-b"
              >
                <span>{r.name}</span>
                <span>₹{r.due}</span>
                <span className="text-red-500">
                  {r.days} days
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 📊 LEDGER MODAL */}
      {selectedCustomer && (
        <CustomerLedgerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}