import { useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../renderer/services/customerApi";

import CustomerLedgerPage from "./CustomerLedgerPage";

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

  // ✅ CREATE / UPDATE
  const handleSave = async () => {
    if (!form.name) return alert("Name required");

    try {
      if (editing) {
        const updated = await updateCustomer(
          editing.customer_uuid,
          form
        );

        setCustomers((prev) =>
          prev.map((c) =>
            c.customer_uuid === updated.customer_uuid ? updated : c
          )
        );

        setEditing(null);
      } else {
        const created = await createCustomer(form);
        setCustomers((prev) => [created, ...prev]);
      }

      setForm({ name: "", mobile: "", address: "", gstin: "" });

    } catch (e) {
      console.error(e);
      alert("Save failed");
    }
  };

  // ✅ EDIT
  const handleEdit = (c: any) => {
    setEditing(c);
    setForm({
      name: c.name,
      mobile: c.mobile || "",
      address: c.address || "",
      gstin: c.gstin || "",
    });
  };

  // ✅ DELETE
  const handleDelete = async (uuid: string) => {
    if (!confirm("Delete customer?")) return;

    await deleteCustomer(uuid);
    setCustomers((prev) =>
      prev.filter((c) => c.customer_uuid !== uuid)
    );
  };

  return (
    <div className="space-y-4">

      {/* 🔷 HEADER */}
      <h1 className="text-2xl font-bold">Customers</h1>

      {/* 🔷 FORM */}
      <div className="bg-white p-4 rounded shadow space-y-2">
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

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editing ? "Update" : "Create"}
          </button>

          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                setForm({
                  name: "",
                  mobile: "",
                  address: "",
                  gstin: "",
                });
              }}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* 🔷 LIST */}
      <div className="bg-white rounded shadow">
        {customers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No customers found
          </div>
        ) : (
          customers.map((c) => (
            <div
              key={c.customer_uuid}
              className="flex justify-between items-center border-b p-3"
            >
              {/* LEFT */}
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-gray-500">
                  {c.mobile}
                </div>

                {/* 💰 CREDIT */}
                <div className="text-xs mt-1">
                  Credit:
                  <span
                    className={`ml-1 font-semibold ${
                      c.credit_balance > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    ₹{c.credit_balance || 0}
                  </span>
                </div>
              </div>

              {/* RIGHT */}
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
          ))
        )}
      </div>

      {/* 🔷 LEDGER MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded shadow w-[700px] max-h-[80vh] flex flex-col">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <div className="font-bold text-lg">
                  {selectedCustomer.name}
                </div>

                <div className="text-xs text-gray-500">
                  Credit:
                  <span
                    className={`ml-1 font-semibold ${
                      selectedCustomer.credit_balance > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    ₹{selectedCustomer.credit_balance || 0}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 overflow-y-auto flex-1">
              <CustomerLedgerPage customer={selectedCustomer} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}