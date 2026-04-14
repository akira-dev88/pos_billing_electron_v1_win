import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getSettings, saveSettings } from "../../renderer/services/settingsApi";

export default function Settings() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await getSettings();

      if (!res) {
        setData({
          shop_name: "",
          mobile: "",
          address: "",
          gstin: "",
          invoice_prefix: "INV",
        });
      } else {
        setData(res);
      }
    }

    load();
  }, []);

  const handleSave = async () => {
    await saveSettings(data);
    alert("Saved!");
  };

  if (data === null) return <div>Loading...</div>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="bg-white p-4 rounded shadow space-y-3 max-w-lg">

        <input
          placeholder="Shop Name"
          className="border p-2 w-full"
          value={data.shop_name}
          onChange={(e) => setData({ ...data, shop_name: e.target.value })}
        />

        <input
          placeholder="Mobile"
          className="border p-2 w-full"
          value={data.mobile || ""}
          onChange={(e) => setData({ ...data, mobile: e.target.value })}
        />

        <input
          placeholder="Address"
          className="border p-2 w-full"
          value={data.address || ""}
          onChange={(e) => setData({ ...data, address: e.target.value })}
        />

        <input
          placeholder="GSTIN"
          className="border p-2 w-full"
          value={data.gstin || ""}
          onChange={(e) => setData({ ...data, gstin: e.target.value })}
        />

        <input
          placeholder="Invoice Prefix"
          className="border p-2 w-full"
          value={data.invoice_prefix || ""}
          onChange={(e) =>
            setData({ ...data, invoice_prefix: e.target.value })
          }
        />

        <button
          onClick={handleSave}
          className="bg-green-600 text-white p-2 w-full"
        >
          Save Settings
        </button>

      </div>
    </AdminLayout>
  );
}