import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  getStaff,
  createStaff,
  type Staff,
} from "../../renderer/services/staffApi";

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

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
    try {
      setLoading(true);
      const data = await getStaff();
      setStaff(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Staff error:", e);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const newStaff = await createStaff(form);

      // ✅ safer update
      setStaff((prev) => [...prev, newStaff]);

      // ✅ reset form
      setForm({
        name: "",
        email: "",
        password: "",
        role: "cashier",
      });

    } catch (e) {
      console.error("Create staff error:", e);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Staff</h1>

        {/* ➕ Create */}
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
            placeholder="Password"
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

          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white p-2 w-full rounded"
          >
            Create Staff
          </button>
        </div>

        {/* 📋 List */}
        <div className="bg-white p-4 rounded shadow">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : staff.length === 0 ? (
            <div className="text-center text-gray-500">
              No staff found
            </div>
          ) : (
            staff.map((s) => (
              <div
                key={s.user_uuid}
                className="flex justify-between border-b py-2"
              >
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-gray-500">
                    {s.email}
                  </div>
                </div>

                <span className="text-sm capitalize">
                  {s.role}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}