import { useEffect, useState } from "react";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  type Supplier,
} from "../../renderer/services/supplierApi";

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Supplier>>({});

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Supplier load error:", e);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  // ➕ CREATE
  const handleCreate = async () => {
    if (!form.name.trim()) return;

    try {
      const newSupplier = await createSupplier(form);

      setSuppliers((prev) => [...prev, newSupplier]);

      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch (e) {
      console.error("Create supplier error:", e);
    }
  };

  // ✏️ START EDIT
  const startEdit = (s: Supplier) => {
    setEditingId(s.supplier_uuid);
    setEditForm({
      name: s.name,
      phone: s.phone,
      email: s.email,
      address: s.address,
    });
  };

  // 💾 SAVE EDIT
  const handleUpdate = async (id: string) => {
    try {
      const updated = await updateSupplier(id, editForm);

      setSuppliers((prev) =>
        prev.map((s) =>
          s.supplier_uuid === id ? updated : s
        )
      );

      setEditingId(null);
      setEditForm({});
    } catch (e) {
      console.error("Update supplier error:", e);
    }
  };

  // ❌ DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this supplier?")) return;

    try {
      await deleteSupplier(id);
      setSuppliers((prev) =>
        prev.filter((s) => s.supplier_uuid !== id)
      );
    } catch (e) {
      console.error("Delete supplier error:", e);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>

      {/* ➕ CREATE */}
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
          placeholder="Phone"
          className="border p-2 w-full"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="border p-2 w-full"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
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

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white p-2 w-full rounded"
        >
          Add Supplier
        </button>
      </div>

      {/* 📋 LIST */}
      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : suppliers.length === 0 ? (
          <div className="text-center text-gray-500">
            No suppliers found
          </div>
        ) : (
          suppliers.map((s) => (
            <div
              key={s.supplier_uuid}
              className="border-b py-2 space-y-1"
            >
              {editingId === s.supplier_uuid ? (
                <>
                  <input
                    className="border p-1 w-full"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    className="border p-1 w-full"
                    value={editForm.phone || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        phone: e.target.value,
                      })
                    }
                  />

                  <input
                    className="border p-1 w-full"
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        email: e.target.value,
                      })
                    }
                  />

                  <input
                    className="border p-1 w-full"
                    value={editForm.address || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        address: e.target.value,
                      })
                    }
                  />

                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleUpdate(s.supplier_uuid)}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-gray-500">
                      {s.phone} {s.email && `• ${s.email}`}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(s)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(s.supplier_uuid)
                      }
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}