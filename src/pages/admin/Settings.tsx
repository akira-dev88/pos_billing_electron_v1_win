import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "../../renderer/services/settingsApi";

export default function Settings() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getSettings();

        // ✅ FIX: extract from API format
        const settings = res?.data;

        setData(
          settings || {
            shop_name: "",
            mobile: "",
            address: "",
            gstin: "",
            invoice_prefix: "INV",
          }
        );
      } catch (e) {
        console.error("Settings load failed", e);

        setData({
          shop_name: "",
          mobile: "",
          address: "",
          gstin: "",
          invoice_prefix: "INV",
        });
      }
    }

    load();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await saveSettings(data);

      if (!res?.success) {
        alert("Save failed");
        return;
      }

      // ✅ sync UI with backend response
      setData(res.data);

      alert("Settings saved ✅");
    } catch (e) {
      console.error(e);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (data === null) {
    return <div className="p-4">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="bg-white p-5 rounded-xl shadow space-y-4">

        {/* Shop Name */}
        <div>
          <label className="text-sm font-medium">Shop Name *</label>
          <input
            className="border p-2 w-full rounded mt-1"
            value={data.shop_name || ""}
            onChange={(e) =>
              setData({ ...data, shop_name: e.target.value })
            }
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="text-sm font-medium">Mobile</label>
          <input
            className="border p-2 w-full rounded mt-1"
            value={data.mobile || ""}
            onChange={(e) =>
              setData({ ...data, mobile: e.target.value })
            }
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium">Address</label>
          <textarea
            className="border p-2 w-full rounded mt-1"
            value={data.address || ""}
            onChange={(e) =>
              setData({ ...data, address: e.target.value })
            }
          />
        </div>

        {/* GSTIN */}
        <div>
          <label className="text-sm font-medium">GSTIN</label>
          <input
            className="border p-2 w-full rounded mt-1"
            value={data.gstin || ""}
            onChange={(e) =>
              setData({ ...data, gstin: e.target.value })
            }
          />
        </div>

        {/* Invoice Prefix */}
        <div>
          <label className="text-sm font-medium">Invoice Prefix</label>
          <input
            className="border p-2 w-full rounded mt-1"
            value={data.invoice_prefix || ""}
            onChange={(e) =>
              setData({ ...data, invoice_prefix: e.target.value })
            }
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full p-2 rounded text-white font-semibold ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

      </div>
    </div>
  );
}