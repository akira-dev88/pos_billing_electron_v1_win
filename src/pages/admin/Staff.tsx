import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getStaff, createStaff } from "../../renderer/services/staffApi";

export default function Staff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });

  useEffect(() => {
    getStaff().then(setStaff);
  }, []);

  const handleCreate = async () => {
    const newStaff = await createStaff(form);
    setStaff((prev) => [...prev, newStaff]);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Staff</h1>

      {/* Create */}
      <div className="bg-white p-4 rounded shadow mb-4 space-y-2">
        <input placeholder="Name" className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input placeholder="Email" className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input placeholder="Password" className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="cashier">Cashier</option>
          <option value="manager">Manager</option>
        </select>

        <button onClick={handleCreate} className="bg-blue-600 text-white p-2 w-full">
          Create Staff
        </button>
      </div>

      {/* List */}
      <div className="bg-white p-4 rounded shadow">
        {staff.map((s, i) => (
          <div key={i} className="flex justify-between border-b py-2">
            <span>{s.name}</span>
            <span>{s.role}</span>
          </div>
        ))}
      </div>

    </AdminLayout>
  );
}