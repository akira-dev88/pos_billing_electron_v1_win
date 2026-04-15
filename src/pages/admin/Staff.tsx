import { useEffect, useState } from "react";
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  type Staff,
} from "../../renderer/services/staffApi";

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [editing, setEditing] = useState<Staff | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    const data = await getStaff();
    setStaff(data);
  };

  // ➕ CREATE
  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) return;

    const newStaff = await createStaff(form);
    setStaff((prev) => [...prev, newStaff]);

    setForm({
      name: "",
      email: "",
      password: "",
      role: "cashier",
    });
  };

  // ✏️ EDIT START
  const startEdit = (s: Staff) => {
    setEditing(s);
    setForm({
      name: s.name,
      email: s.email,
      password: "",
      role: s.role,
    });
  };

  // 💾 SAVE EDIT
  const handleUpdate = async () => {
    if (!editing) return;

    const updated = await updateStaff(editing.user_uuid, form);

    setStaff((prev) =>
      prev.map((s) =>
        s.user_uuid === editing.user_uuid ? updated : s
      )
    );

    setEditing(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "cashier",
    });
  };

  // 🗑️ DELETE
  const handleDelete = async (uuid: string) => {
    if (!confirm("Delete this staff?")) return;

    await deleteStaff(uuid);

    setStaff((prev) => prev.filter((s) => s.user_uuid !== uuid));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Staff</h1>

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
          placeholder="Email"
          className="border p-2 w-full"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password (optional for edit)"
          className="border p-2 w-full"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <select
          className="border p-2 w-full"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="cashier">Cashier</option>
          <option value="manager">Manager</option>
        </select>

        {editing ? (
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white p-2 w-full rounded"
          >
            Update Staff
          </button>
        ) : (
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white p-2 w-full rounded"
          >
            Create Staff
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded shadow">
        {staff.map((s) => (
          <div
            key={s.user_uuid}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-gray-500">
                {s.email}
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm capitalize">
                {s.role}
              </span>

              <button
                onClick={() => startEdit(s)}
                className="bg-yellow-500 text-white px-2 py-1 text-xs"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(s.user_uuid)}
                className="bg-red-600 text-white px-2 py-1 text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}