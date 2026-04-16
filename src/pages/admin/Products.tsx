import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../renderer/services/productApi";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
  });

  // 📦 LOAD
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (e) {
      console.error(e);
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ➕ CREATE / UPDATE
  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      alert("Name & Price required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock || 0),
      };

      if (editing) {
        await updateProduct(editing.product_uuid, payload);
      } else {
        await createProduct(payload);
      }

      // reset
      setForm({ name: "", price: "", stock: "" });
      setEditing(null);

      await loadProducts();
    } catch (e) {
      console.error(e);
      alert("Save failed");
    }

    setSaving(false);
  };

  // ✏️ EDIT
  const handleEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name || "",
      price: String(p.price || ""),
      stock: String(p.stock || 0),
    });
  };

  // ❌ CANCEL EDIT
  const handleCancel = () => {
    setEditing(null);
    setForm({ name: "", price: "", stock: "" });
  };

  // 🗑 DELETE
  const handleDelete = async (uuid: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      await deleteProduct(uuid);
      await loadProducts();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  if (loading) {
    return <div className="p-4">Loading products...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* 🧾 FORM */}
      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-3 gap-2">

        <input
          className="border p-2"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          className="border p-2"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="number"
          className="border p-2"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <div className="col-span-3 flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`flex-1 p-2 text-white ${
              editing ? "bg-yellow-600" : "bg-blue-600"
            } ${saving ? "opacity-50" : ""}`}
          >
            {saving
              ? "Saving..."
              : editing
              ? "Update Product"
              : "Add Product"}
          </button>

          {editing && (
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* 📦 PRODUCT LIST */}
      <div className="bg-white rounded shadow">

        <div className="grid grid-cols-4 p-3 border-b font-semibold">
          <span>Name</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Actions</span>
        </div>

        {(products || []).map((p) => (
          <div
            key={p.product_uuid}
            className="grid grid-cols-4 p-3 border-b items-center"
          >
            <span>{p.name}</span>
            <span>₹{p.price}</span>
            <span>{p.stock ?? "-"}</span>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(p)}
                className="bg-yellow-500 text-white px-2"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p.product_uuid)}
                className="bg-red-600 text-white px-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}