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

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    gstin: "",
  });

  const [editing, setEditing] = useState<any | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getCustomers();
    setCustomers(Array.isArray(data) ? data : []);
  };

  const resetForm = () => {
    setForm({ name: "", mobile: "", address: "", gstin: "" });
    setEditing(null);
  };

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

  const handleEdit = (c: any) => {
    setEditing(c);
    setForm({
      name: c.name,
      mobile: c.mobile || "",
      address: c.address || "",
      gstin: c.gstin || "",
    });
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm("Delete customer?")) return;

    await deleteCustomer(uuid);
    setCustomers((prev) =>
      prev.filter((c) => c.customer_uuid !== uuid)
    );
  };

  const [aging, setAging] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    load();
    loadInsights();
  }, []);

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


  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Customers</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="font-semibold">
          {editing ? "Edit Customer" : "Add Customer"}
        </h2>

        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          placeholder="Mobile"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
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

      {/* LIST */}
      <div className="bg-white rounded shadow">
        {customers.map((c) => (
          <div
            key={c.customer_uuid}
            className="flex justify-between items-center border-b p-3"
          >
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-gray-500">{c.mobile}</div>

              <div className="text-xs mt-1">
                Credit:
                <span
                  className={`ml-1 font-semibold ${c.credit_balance > 0
                    ? "text-red-600"
                    : "text-green-600"
                    }`}
                >
                  ₹{c.credit_balance || 0}
                </span>
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
        ))}
      </div>

      {/* 🔥 INSIGHTS SECTION */}
      <div className="grid grid-cols-2 gap-4">

        {/* 📊 CREDIT AGING */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Credit Aging</h2>

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

        {/* 🔔 PAYMENT REMINDERS */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2 text-red-600">
            Payment Reminders
          </h2>

          {reminders.length === 0 ? (
            <div className="text-sm text-gray-500">No pending dues</div>
          ) : (
            reminders.map((r: any, i) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b">
                <span>{r.name}</span>
                <span>₹{r.due}</span>
                <span className="text-red-500">{r.days} days</span>
              </div>
            ))
          )}
        </div>

      </div>

      {/* LEDGER MODAL */}
      {selectedCustomer && (
        <CustomerLedgerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}