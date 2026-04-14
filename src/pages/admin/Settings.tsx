import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getSettings, saveSettings } from "../../renderer/services/settingsApi";

export default function Settings() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getSettings().then(setData);
  }, []);

  const handleSave = async () => {
    await saveSettings(data);
    alert("Saved!");
  };

  if (!data) return <div>Loading...</div>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="bg-white p-4 rounded shadow space-y-2">

        <input className="border p-2 w-full"
          value={data.shop_name}
          onChange={(e) => setData({ ...data, shop_name: e.target.value })}
        />

        <input className="border p-2 w-full"
          value={data.mobile}
          onChange={(e) => setData({ ...data, mobile: e.target.value })}
        />

        <input className="border p-2 w-full"
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
        />

        <button
          onClick={handleSave}
          className="bg-green-600 text-white p-2 w-full"
        >
          Save
        </button>

      </div>
    </AdminLayout>
  );
}