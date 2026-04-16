import { useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerLedger,
} from "../../renderer/services/customerApi";
import CustomerLedgerPage from "./CustomerLedgerPage";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
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

  const openLedger = async (customer: any) => {
    setSelectedCustomer(customer);

    try {
      const data = await getCustomerLedger(customer.customer_uuid);
      setLedger(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setLedger([]);
    }
  };

  const handleSave = async () => {
    if (!form.name) return alert("Name required");

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow mb-4 space-y-2">
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

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white p-2 w-full rounded"
        >
          {editing ? "Update Customer" : "Create Customer"}
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded shadow">
        {customers.map((c) => (
          <div
            key={c.customer_uuid}
            className="flex justify-between border-b py-2 items-center"
          >
            <div
              className="cursor-pointer"
              onClick={() => openLedger(c)}
            >
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-gray-500">
                {c.mobile}
              </div>
            </div>

            <div className="flex gap-2">

              <button
                onClick={() => setSelectedCustomer(c)}
                className="text-blue-600 text-sm"
              >
                View Ledger
              </button>

              <button
                onClick={() => handleEdit(c)}
                className="text-blue-600"
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

      {/* 📊 LEDGER MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[700px] max-h-[80vh] overflow-y-auto">

            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold">
                {selectedCustomer.name} Ledger
              </h2>

              <button onClick={() => setSelectedCustomer(null)}>
                ✕
              </button>
            </div>

            <CustomerLedgerPage customer={selectedCustomer} />

          </div>
        </div>
      )}
    </div>
  );
}