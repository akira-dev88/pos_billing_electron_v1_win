import { useEffect, useState } from "react";
import {
  getSales,
  getInvoice,
  type Invoice,
  type Sale,
} from "../../renderer/services/saleApi";

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const data = await getSales();
      setSales(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Sales error:", e);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (sale: Sale) => {
    try {
      const invoice = await getInvoice(sale.sale_uuid);
      setInvoiceData(invoice);
    } catch (e) {
      console.error("Invoice error:", e);
    }
  };

  const format = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sales</h1>

      {/* TABLE */}
      <div className="bg-white rounded shadow">
        <div className="grid grid-cols-4 p-3 border-b font-semibold">
          <span>Invoice</span>
          <span>Total</span>
          <span>Date</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : sales.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No sales found
          </div>
        ) : (
          (sales || []).map((sale) => (
            <div
              key={sale.sale_uuid}
              className="grid grid-cols-4 p-3 border-b items-center"
            >
              <span>{sale.invoice_number}</span>

              <span>₹{format(sale.grand_total)}</span>

              <span>
                {sale.created_at
                  ? new Date(sale.created_at).toLocaleDateString()
                  : "-"}
              </span>

              <button
                onClick={() => handleView(sale)}
                className="bg-blue-600 text-white px-2 py-1 rounded"
              >
                View
              </button>
            </div>
          ))
        )}
      </div>

      {/* INVOICE MODAL */}
      {invoiceData && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 w-[300px] text-sm font-mono">

            <div className="text-center text-xs mb-2">
              Invoice: {invoiceData.invoice_number || "-"}
            </div>

            <h2 className="text-center font-bold">
              {invoiceData.shop?.name || "Shop"}
            </h2>

            <div className="text-center text-xs">
              {invoiceData.shop?.address || ""}
            </div>

            <div className="text-center text-xs mb-2">
              GSTIN: {invoiceData.shop?.gstin || "-"}
            </div>

            <hr className="my-2" />

            {/* Items */}
            {invoiceData.items?.length ? (
              invoiceData.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>
                    {item.name} x{item.qty}
                  </span>
                  <span>₹{format(item.total)}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-xs text-gray-500">
                No items
              </div>
            )}

            <hr className="my-2" />

            {/* Summary */}
            <div className="flex justify-between text-xs">
              <span>Total</span>
              <span>₹{format(invoiceData.summary?.total)}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span>GST</span>
              <span>₹{format(invoiceData.summary?.tax)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Grand Total</span>
              <span>
                ₹{format(invoiceData.summary?.grand_total)}
              </span>
            </div>

            <hr className="my-2" />

            <div className="text-center text-xs">
              Thank you 🙏
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                className="w-full bg-blue-600 text-white p-2 rounded"
                onClick={() => window.print()}
              >
                Print
              </button>

              <button
                className="w-full bg-gray-400 text-white p-2 rounded"
                onClick={() => setInvoiceData(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}