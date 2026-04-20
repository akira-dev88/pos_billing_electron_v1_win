import { useEffect, useState } from "react";
import {
  getSales,
  getInvoice,
  type Invoice,
  type Sale,
} from "../../renderer/services/saleApi";
import { IonIcon } from "@ionic/react";
import {
  eyeOutline,
  printOutline,
  closeOutline,
  cashOutline,
  calendarOutline,
  documentTextOutline,
  downloadOutline,
  trendingUpOutline,
  checkmarkCircleOutline,
  searchOutline,
  pricetagOutline,
  pricetag,
} from "ionicons/icons";

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

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
      console.log("=== FULL INVOICE DATA ===");
      console.log(invoice);
      console.log("=== SUMMARY OBJECT ===");
      console.log(invoice?.summary);
      console.log("=== ITEMS ARRAY ===");
      console.log(invoice?.items);
      console.log("=== GRAND TOTAL ===");
      console.log(invoice?.grand_total);
      setInvoiceData(invoice);
    } catch (e) {
      console.error("Invoice error:", e);
    }
  };

  const format = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Calculate stats - Fixed version
  const totalSales = sales.reduce((sum, sale) => {
    const grandTotal = typeof sale.grand_total === 'string' ? parseFloat(sale.grand_total) : (sale.grand_total || 0);
    return sum + grandTotal;
  }, 0);

  const averageSale = totalSales / (sales.length || 1);

  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.created_at).toDateString();
    const today = new Date().toDateString();
    return saleDate === today;
  }).reduce((sum, sale) => {
    const grandTotal = typeof sale.grand_total === 'string' ? parseFloat(sale.grand_total) : (sale.grand_total || 0);
    return sum + grandTotal;
  }, 0);

  // Filter sales
  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || sale.created_at?.startsWith(filterDate);
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex justify-between items-center font-inter">
        <div>
          <h1 className="text-3xl font-bold text-white">Sales</h1>
        </div>
        <button
          onClick={loadSales}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          <IonIcon icon={documentTextOutline} className="text-xl" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-start">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm">Total Sales</p>
              <p className="text-2xl font-bold mt-1">₹{totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <IonIcon icon={trendingUpOutline} className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm">Average Sale</p>
              <p className="text-2xl font-bold mt-1">₹{averageSale.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <IonIcon icon={cashOutline} className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm">Today's Sales</p>
              <p className="text-2xl font-bold mt-1">₹{todaySales.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <IonIcon icon={calendarOutline} className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold mt-1">{sales.length}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <IonIcon icon={documentTextOutline} className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by invoice number or customer name..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <IonIcon icon={searchOutline} className="text-2xl" />
          </div>
        </div>

        <input
          type="date"
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto text-start">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Invoice</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-center p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-center p-4 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500">
                    {searchTerm || filterDate ? "No sales match your search" : "No sales found"}
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.sale_uuid} className="border-b border-gray-100 hover:bg-gray-50 transition-all group">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{sale.invoice_number}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {sale.sale_uuid?.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700">{sale.customer?.name || "Walk-in Customer"}</div>
                      {sale.customer?.mobile && (
                        <div className="text-xs text-gray-400 mt-0.5">{sale.customer.mobile}</div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-green-600 text-lg">
                        ₹{format(sale.grand_total)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-600">{new Date(sale.created_at).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">{new Date(sale.created_at).toLocaleTimeString()}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        <IonIcon icon={checkmarkCircleOutline} className="text-xs" />
                        Completed
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleView(sale)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-flex items-center gap-1"
                        title="View Invoice"
                      >
                        <IonIcon icon={eyeOutline} className="text-lg" />
                        <span className="text-sm">View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVOICE MODAL */}
      {invoiceData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fadeIn">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Invoice Details</h2>
              <button
                onClick={() => setInvoiceData(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <IonIcon icon={closeOutline} className="text-xl text-gray-500" />
              </button>
            </div>

            {/* Invoice Content */}
            <div className="p-6" id="invoice-content">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="text-xs text-gray-400 mb-1">
                  Invoice #{invoiceData.invoice_number || invoiceData.sale_uuid?.slice(0, 8) || "-"}
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {invoiceData.shop?.name || "My Store"}
                </h2>
                <div className="text-xs text-gray-500 mt-1">
                  {invoiceData.shop?.address || "Chennai, Tamil Nadu"}
                </div>
                <div className="text-xs text-gray-400">
                  GSTIN: {invoiceData.shop?.gstin || "33ABCDE1234F1Z5"}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Date: {new Date(invoiceData.created_at || Date.now()).toLocaleString()}
                </div>
              </div>

              <hr className="my-3 border-gray-200" />

              {/* Customer Info */}
              {(invoiceData.customer || invoiceData.customer_name) && (
                <div className="mb-3 text-sm">
                  <div className="font-semibold text-gray-700">Customer:</div>
                  <div className="text-gray-600">
                    {invoiceData.customer?.name || invoiceData.customer_name || "Walk-in Customer"}
                  </div>
                  {(invoiceData.customer?.mobile || invoiceData.customer_name) && (
                    <div className="text-xs text-gray-400">{invoiceData.customer?.mobile || invoiceData.customer_name}</div>
                  )}
                </div>
              )}

              {/* Items - Check multiple possible data structures */}
              <div className="space-y-2 mb-3">
                <div className="font-semibold text-gray-700 text-sm">Items:</div>
                {(invoiceData.items?.length || invoiceData.cart?.items?.length) ? (
                  (invoiceData.items || invoiceData.cart?.items || []).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-100">
                      <div>
                        <div className="text-gray-700">{item.name || item.product?.name}</div>
                        <div className="text-xs text-gray-400">
                          Qty: {item.qty || item.quantity || 1} × ₹{format(item.price || item.product?.price)}
                        </div>
                      </div>
                      <div className="font-medium text-gray-700">
                        ₹{format(item.total || (item.price * (item.qty || item.quantity || 1)))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-400">No items</div>
                )}
              </div>

              <hr className="my-3 border-gray-200" />

              {/* Summary - Try multiple possible field names */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">
                    ₹{format(
                      invoiceData.summary?.total ||
                      invoiceData.subtotal ||
                      invoiceData.total ||
                      0
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="text-gray-800">
                    ₹{format(
                      invoiceData.summary?.tax ||
                      invoiceData.tax ||
                      invoiceData.gst ||
                      ((invoiceData.summary?.grand_total || invoiceData.grand_total || 0) * 0.18)
                    )}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-800">Grand Total</span>
                  <span className="font-bold text-green-600 text-lg">
                    ₹{format(
                      invoiceData.summary?.grand_total ||
                      invoiceData.grand_total ||
                      invoiceData.total_amount ||
                      invoiceData.amount ||
                      0
                    )}
                  </span>
                </div>
              </div>

              {/* Payment Info if available */}
              {(invoiceData.payments?.length > 0 || invoiceData.payment_method) && (
                <>
                  <hr className="my-3 border-gray-200" />
                  <div className="space-y-1 text-sm">
                    <div className="font-semibold text-gray-700">Payment:</div>
                    {invoiceData.payments?.length > 0 ? (
                      invoiceData.payments.map((payment: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-gray-600 capitalize">{payment.method}</span>
                          <span className="text-gray-800">₹{format(payment.amount)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 capitalize">{invoiceData.payment_method || "Cash"}</span>
                        <span className="text-gray-800">₹{format(invoiceData.grand_total || invoiceData.total_amount)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <hr className="my-3 border-gray-200" />

              {/* Footer */}
              <div className="text-center">
                <div className="text-sm text-gray-600">Thank you for your purchase! 🙏</div>
                <div className="text-xs text-gray-400 mt-1">Visit again!</div>
              </div>
            </div>

            {/* DEBUG: Remove after fixing */}
            <div className="text-xs bg-gray-100 p-2 rounded mb-2 overflow-auto max-h-32">
              <pre>{JSON.stringify(invoiceData, null, 2)}</pre>
            </div>

            {/* Modal Footer Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <IonIcon icon={printOutline} className="text-lg" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setInvoiceData(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <IonIcon icon={closeOutline} className="text-lg" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}