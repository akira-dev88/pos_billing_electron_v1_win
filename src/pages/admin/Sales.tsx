import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getSales, getInvoice } from "../../renderer/services/saleApi";

export default function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setLoading(true);
    const data = await getSales();
    setSales(data);
    setLoading(false);
  };

  const handleView = async (sale: any) => {
    const invoice = await getInvoice(sale.sale_uuid);
    setInvoiceData(invoice);

    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sales</h1>

      {/* 📋 TABLE */}
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
          sales.map((sale) => (
            <div
              key={sale.sale_uuid}
              className="grid grid-cols-4 p-3 border-b items-center"
            >
              <span>{sale.invoice_number}</span>
              <span>₹{sale.grand_total}</span>
              <span>
                {new Date(sale.created_at).toLocaleDateString()}
              </span>

              <button
                onClick={() => handleView(sale)}
                className="bg-blue-600 text-white px-2 py-1"
              >
                View / Print
              </button>
            </div>
          ))
        )}
      </div>

      {/* 🧾 INVOICE MODAL */}
      {invoiceData && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center print:bg-white">

          <div className="bg-white p-4 w-[300px] text-sm font-mono">

            <h2 className="text-center font-bold">
              {invoiceData?.shop?.name}
            </h2>

            <div className="text-center text-xs">
              {invoiceData?.shop?.address}
            </div>

            <div className="text-center text-xs mb-2">
              GSTIN: {invoiceData?.shop?.gstin}
            </div>

            <hr className="my-2" />

            {/* Items */}
            {invoiceData?.items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-xs">
                <span>
                  {item.name} x{item.qty}
                </span>
                <span>₹{item.total}</span>
              </div>

              
            ))}

            <hr className="my-2" />

            <div className="flex justify-between text-xs">
              <span>Total</span>
              <span>₹{invoiceData?.summary?.total}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span>GST</span>
              <span>₹{invoiceData?.summary?.tax}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Grand Total</span>
              <span>₹{invoiceData?.summary?.grand_total}</span>
            </div>

            <hr className="my-2" />

            <div className="text-center text-xs">
              Thank you 🙏
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-2 print:hidden">
              <button
                className="w-full bg-blue-600 text-white p-2"
                onClick={() => window.print()}
              >
                Print
              </button>

              <button
                className="w-full bg-gray-400 text-white p-2"
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